import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChatsService } from 'src/modules/chats/chats.service';
import { UsersService } from 'src/modules/users/users.service';

@Controller('user/chats')
@UseGuards(AuthGuard)
export class UserChatsWebController {
  constructor(
    private chatsService: ChatsService,
    private usersService: UsersService,
  ) {}

  // UI #1: Topbar -> sidebar list + conversation
  @Get()
  async chatsHome(@Req() req: Request, @Res() res: Response) {
    const userId = req.session?.userId;
    if (!userId) return null;

    const user = await this.usersService.findOne(userId);
    if (!user) return res.redirect('/login');

    return res.render('pages/user/chat/index', {
      layout: 'layouts/user-layout',
      title: 'Chats',
      page_title: 'Chats',
      folder: 'Chats',
      user,
      unreadCount: 0,
    });
  }

  // UI #2: Profile -> conversation-only, direct chat with target user
  @Get('with/:otherUserId')
  async directChatPage(
    @Param('otherUserId') otherUserId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.session?.userId;
    if (!userId) return null;

    const user = await this.usersService.findOne(userId);
    if (!user) return res.redirect('/login');

    const otherUser = await this.usersService.findOne(otherUserId);
    if (!otherUser) return res.redirect('/user/search');

    const chat = await this.chatsService.getOrCreateDirectChat(userId, otherUserId);

    return res.render('pages/user/chat/direct', {
      layout: 'layouts/user-layout',
      title: `Chat with ${otherUser.name}`,
      page_title: otherUser.name,
      folder: 'Chats',
      user,
      otherUser,
      chatId: chat.id,
      unreadCount: 0,
    });
  }

  // -------------------- APIs used by Velzon chat UI --------------------

  @Get('api/list')
  async apiList(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.session?.userId;
      if (!userId) return null;

      const chats = await this.chatsService.listChatsForUser(userId);
      return res.json({ success: true, chats });
    } catch (error) {
      console.error('Chat list error:', error);
      return res.status(500).json({ success: false, error: 'Failed to load chats' });
    }
  }

  @Post('api/direct')
  async apiGetOrCreateDirect(
    @Body() body: { otherUserId: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if (!userId) return null;

      const chat = await this.chatsService.getOrCreateDirectChat(userId, body.otherUserId);
      return res.json({ success: true, chatId: chat.id });
    } catch (error) {
      console.error('Create direct chat error:', error);
      return res
        .status(400)
        .json({ success: false, error: error?.message ?? 'Failed to create chat' });
    }
  }

  @Get('api/:chatId/messages')
  async apiMessages(
    @Param('chatId') chatId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if (!userId) return null;

      const messages = await this.chatsService.getMessages(Number(chatId), userId, 200);
      await this.chatsService.markRead(Number(chatId), userId);
      return res.json({ success: true, messages });
    } catch (error) {
      console.error('Chat messages error:', error);
      return res.status(400).json({ success: false, error: 'Failed to load messages' });
    }
  }

  @Post('api/:chatId/messages')
  async apiSend(
    @Param('chatId') chatId: string,
    @Body() body: { content: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if (!userId) return null;

      const msg = await this.chatsService.sendMessage(Number(chatId), userId, body.content);
      return res.json({
        success: true,
        message: msg
          ? {
              id: msg.id,
              chatId: Number(chatId),
              senderId: msg.sender?.id ?? null,
              content: msg.isDeleted ? 'This message was deleted' : msg.content,
              isDeleted: msg.isDeleted,
              createdAt: msg.createdAt,
            }
          : null,
      });
    } catch (error) {
      console.error('Send message error:', error);
      return res
        .status(400)
        .json({ success: false, error: error?.message ?? 'Failed to send message' });
    }
  }

  @Post('api/:chatId/messages/:messageId/delete')
  async apiDelete(
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.userId;
      if (!userId) return null;
      await this.chatsService.deleteMessage(Number(chatId), Number(messageId), userId);
      return res.json({ success: true });
    } catch (error) {
      console.error('Delete message error:', error);
      return res.status(400).json({ success: false, error: 'Failed to delete message' });
    }
  }
}

