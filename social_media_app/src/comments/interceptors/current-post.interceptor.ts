import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  Request
} from '@nestjs/common';
import { PostsService } from '../../posts/posts.service';

@Injectable()
export class CurrentPostInterceptor implements NestInterceptor {
  constructor(private postsService: PostsService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const postId  = request.body.postId || {};

    if (postId) {
      const post = await this.postsService.getPost(postId);
      request.currentPost = post;
    }
     
    return handler.handle();
  }
}