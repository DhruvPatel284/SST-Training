import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Chat } from './chat.entity';
import { ChatMember } from './chat-member.entity';
import { ChatMessage, ChatMessageType } from './chat-message.entity';
import { User } from '../users/user.entity';
import { FollowsService } from '../follows/follows.service';

type ListChatsItem = {
  chatId: number;
  type: 'direct' | 'group';
  otherUser: { id: string; name: string; profile_image?: string | null } | null;
  lastMessage: { id: number; content: string; createdAt: Date; senderId: string | null } | null;
  unreadCount: number;
};

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    @InjectRepository(ChatMember) private memberRepo: Repository<ChatMember>,
    @InjectRepository(ChatMessage) private messageRepo: Repository<ChatMessage>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private followsService: FollowsService,
  ) {}

  private async assertMember(chatId: number, userId: string) {
    const membership = await this.memberRepo.findOne({
      where: { chat: { id: chatId }, user: { id: userId } },
      relations: ['chat', 'user'],
    });
    if (!membership) throw new ForbiddenException('You are not a member of this chat');
    return membership;
  }

  async getOrCreateDirectChat(currentUserId: string, otherUserId: string) {
    if (currentUserId === otherUserId) {
      throw new BadRequestException('You cannot chat with yourself');
    }

    // Allow chat if there is an accepted follow in either direction:
    // - current user follows other, or
    // - other user follows current user.
    const canChatAsFollowing = await this.followsService.isFollowing(
      currentUserId,
      otherUserId,
    );
    const canChatAsFollower = await this.followsService.isFollowing(
      otherUserId,
      currentUserId,
    );
    if (!canChatAsFollowing && !canChatAsFollower) {
      throw new ForbiddenException('You can only chat with your followers or following');
    }

    const otherUser = await this.userRepo.findOne({ where: { id: otherUserId } });
    if (!otherUser) throw new NotFoundException('User not found');

    // Find existing direct chat containing BOTH users and only 2 members.
    const existing = await this.chatRepo
      .createQueryBuilder('chat')
      .innerJoin('chat.members', 'm')
      .where('chat.type = :type', { type: 'direct' })
      .groupBy('chat.id')
      .having('COUNT(m.id) = 2')
      .andHaving('SUM(m.userId = :u1) > 0', { u1: currentUserId })
      .andHaving('SUM(m.userId = :u2) > 0', { u2: otherUserId })
      .getOne();

    if (existing) return existing;

    const chat = await this.chatRepo.save(
      this.chatRepo.create({
        type: 'direct',
        creator: { id: currentUserId } as User,
      }),
    );

    await this.memberRepo.save([
      this.memberRepo.create({
        chat: { id: chat.id } as Chat,
        user: { id: currentUserId } as User,
        lastReadAt: new Date(),
      }),
      this.memberRepo.create({
        chat: { id: chat.id } as Chat,
        user: { id: otherUserId } as User,
        lastReadAt: null,
      }),
    ]);

    return chat;
  }

  async listChatsForUser(userId: string): Promise<ListChatsItem[]> {
    const memberships = await this.memberRepo.find({
      where: { user: { id: userId } },
      relations: ['chat'],
      order: { joinedAt: 'DESC' },
    });

    const chatIds = memberships.map((m) => m.chat.id);
    if (chatIds.length === 0) return [];

    const chats = await this.chatRepo.find({
      where: chatIds.map((id) => ({ id })),
      relations: ['members', 'members.user'],
    });

    const latestByChat = new Map<number, ChatMessage>();
    await Promise.all(
      chats.map(async (chat) => {
        const last = await this.messageRepo.findOne({
          where: { chat: { id: chat.id }, isDeleted: false },
          relations: ['sender'],
          order: { createdAt: 'DESC' },
        });
        if (last) latestByChat.set(chat.id, last);
      }),
    );

    // Unread counts based on member.lastReadAt
    const unreadCountsRaw = await this.messageRepo
      .createQueryBuilder('msg')
      .innerJoin(ChatMember, 'cm', 'cm.chatId = msg.chatId AND cm.userId = :userId', { userId })
      .select('msg.chatId', 'chatId')
      .addSelect('COUNT(msg.id)', 'cnt')
      .where('msg.chatId IN (:...chatIds)', { chatIds })
      .andWhere('msg.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('(cm.lastReadAt IS NULL OR msg.createdAt > cm.lastReadAt)')
      .andWhere('msg.senderId != :userId', { userId })
      .groupBy('msg.chatId')
      .getRawMany<{ chatId: number; cnt: string }>();

    const unreadByChat = new Map<number, number>();
    for (const row of unreadCountsRaw) unreadByChat.set(Number(row.chatId), Number(row.cnt));

    const items: ListChatsItem[] = chats
      .map((chat) => {
        const other =
          chat.type === 'direct'
            ? chat.members.find((m) => m.user?.id !== userId)?.user
            : null;

        const last = latestByChat.get(chat.id);
        const lastDto = last
          ? {
              id: last.id,
              content: last.content,
              createdAt: last.createdAt,
              senderId: last.sender?.id ?? null,
            }
          : null;

        return {
          chatId: chat.id,
          type: chat.type,
          otherUser: other
            ? { id: other.id, name: other.name, profile_image: other.profile_image ?? null }
            : null,
          lastMessage: lastDto,
          unreadCount: unreadByChat.get(chat.id) ?? 0,
        };
      })
      .sort((a, b) => {
        const at = a.lastMessage?.createdAt?.getTime() ?? 0;
        const bt = b.lastMessage?.createdAt?.getTime() ?? 0;
        return bt - at;
      });

    return items;
  }

  async getMessages(chatId: number, userId: string, limit = 50) {
    await this.assertMember(chatId, userId);

    const messages = await this.messageRepo.find({
      where: { chat: { id: chatId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
      take: limit,
    });

    return messages.map((m) => ({
      id: m.id,
      chatId,
      senderId: m.sender?.id ?? null,
      senderName: m.sender?.name ?? null,
      senderProfileImage: m.sender?.profile_image ?? null,
      messageType: m.messageType,
      content: m.isDeleted ? 'This message was deleted' : m.content,
      isDeleted: m.isDeleted,
      createdAt: m.createdAt,
    }));
  }

  async markRead(chatId: number, userId: string) {
    const membership = await this.assertMember(chatId, userId);
    membership.lastReadAt = new Date();
    await this.memberRepo.save(membership);
    return true;
  }

  async sendMessage(chatId: number, senderId: string, content: string) {
    await this.assertMember(chatId, senderId);

    const chat = await this.chatRepo.findOne({
      where: { id: chatId },
      relations: ['members', 'members.user'],
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const otherUser = chat.members.find((m) => m.user?.id !== senderId)?.user;
    if (!otherUser) {
      throw new BadRequestException('Chat does not have another member');
    }

    // Allow sending only if there is still an accepted follow in either direction.
    const canSendAsFollowing = await this.followsService.isFollowing(
      senderId,
      otherUser.id,
    );
    const canSendAsFollower = await this.followsService.isFollowing(
      otherUser.id,
      senderId,
    );
    if (!canSendAsFollowing && !canSendAsFollower) {
      throw new ForbiddenException(
        'You must follow this user before sending a new message.',
      );
    }

    const text = (content ?? '').trim();
    if (!text) throw new BadRequestException('Message content is required');

    const msg = await this.messageRepo.save(
      this.messageRepo.create({
        chat: { id: chatId } as Chat,
        sender: { id: senderId } as User,
        messageType: ChatMessageType.TEXT,
        content: text,
        isDeleted: false,
      }),
    );

    return this.messageRepo.findOne({
      where: { id: msg.id },
      relations: ['sender'],
    });
  }

  async deleteMessage(chatId: number, messageId: number, userId: string) {
    await this.assertMember(chatId, userId);

    const msg = await this.messageRepo.findOne({
      where: { id: messageId, chat: { id: chatId } },
      relations: ['sender'],
    });
    if (!msg) throw new NotFoundException('Message not found');
    if ((msg.sender?.id ?? null) !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    msg.isDeleted = true;
    await this.messageRepo.save(msg);
    return true;
  }
}

