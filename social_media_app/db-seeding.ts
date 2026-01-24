// src/seed.ts

/*

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

*/




/*

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { PostsService } from './posts/posts.service';
import { CommentsService } from './comments/comments.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const authService = app.get(AuthService);
  const postsService = app.get(PostsService);
  const commentsService = app.get(CommentsService);

  console.log('🌱 Starting database seeding...');

  // Sample data
  const usernames = [
    { name: 'Alice Johnson', email: 'alice@example.com' },
    { name: 'Bob Smith', email: 'bob@example.com' },
    { name: 'Charlie Davis', email: 'charlie@example.com' },
    { name: 'Diana Miller', email: 'diana@example.com' },
    { name: 'Ethan Wilson', email: 'ethan@example.com' },
    { name: 'Fiona Brown', email: 'fiona@example.com' },
    { name: 'George Taylor', email: 'george@example.com' },
  ];

  const postContents = [
    "Just finished reading an amazing book about software architecture. The insights on microservices are game-changing!",
    "Coffee and code - the perfect combination for a productive Monday morning ☕",
    "Has anyone tried the new TypeScript 5.0 features? The decorators update is incredible!",
    "Reflecting on my journey as a developer. It's been 5 years since I wrote my first 'Hello World'.",
    "Pro tip: Always write tests before refactoring. Just saved myself hours of debugging!",
    "The sunset today was absolutely breathtaking. Nature never ceases to amaze me 🌅",
    "Started learning GraphQL and I'm already in love with it. REST might have competition!",
    "Debugging a legacy codebase is like archaeology - you never know what you'll find!",
    "Just deployed my first serverless function. The future is here!",
    "Why do we call it 'shipping code' when we're just pushing bits? 🤔",
    "Finally automated my deployment pipeline. CI/CD for the win!",
    "Working remote has its perks, but I miss the office whiteboard sessions.",
    "Just discovered this amazing VS Code extension that changed my workflow completely.",
    "Remember: Code is read more often than it's written. Keep it clean!",
    "Had an amazing brainstorming session with the team today. Innovation at its best!",
    "The best way to learn is to build. Started a new side project this weekend!",
    "Documentation is love. Documentation is life. Write those README files!",
    "Refactored 500 lines into 100. Sometimes less really is more.",
    "Attended an incredible tech conference today. The networking alone was worth it!",
    "There's no such thing as a small bug in production 😅",
    "Just hit 1000 GitHub stars on my open-source project! Thank you community!",
    "Pair programming session was so productive today. Two heads are better than one!",
    "Learning Rust has been challenging but rewarding. The compiler is strict but fair!",
    "Code review tip: Be kind, be constructive, be specific.",
    "Started meditating before coding sessions. The focus improvement is real!",
    "Database optimization reduced our query time by 80%. Performance matters!",
    "The imposter syndrome is real, but so is your progress. Keep going!",
    "Just finished a 48-hour hackathon. Exhausted but exhilarated!",
    "Clean code is not about perfection, it's about clarity and maintainability.",
    "Celebrating small wins today. Progress is progress, no matter how small!",
  ];

  const commentTemplates = [
    "Great post! I completely agree with your perspective.",
    "This is really insightful. Thanks for sharing!",
    "I had a similar experience. It's nice to know I'm not alone.",
    "Could you elaborate more on this? I'd love to learn more.",
    "Totally disagree, but I respect your opinion.",
    "This is exactly what I needed to read today!",
    "Interesting take! I never thought about it that way.",
    "Thanks for the recommendation, I'll check it out!",
    "This reminds me of a project I worked on last year.",
    "Brilliant insight! Saving this for future reference.",
    "I tried this approach and it worked wonders!",
    "Can you share more details about your implementation?",
    "This is gold! Sharing with my team.",
    "I struggled with this too. Your solution is elegant!",
    "Love the way you explained this concept.",
    "Have you considered the edge cases for this?",
    "This is the kind of content we need more of!",
    "Your posts are always so informative. Keep it up!",
    "I'm curious about the performance implications.",
    "This changed my perspective completely.",
    "Absolutely! I've been saying this for years.",
    "Great point, but what about scalability?",
    "This deserves more attention. Underrated post!",
    "I bookmarked this for later. Excellent resource!",
    "Your experience mirrors mine almost exactly.",
    "Thanks for breaking this down so clearly.",
    "This is a hot take, but I'm here for it!",
    "Can't wait to try this out in my project.",
    "You just solved a problem I've been stuck on!",
    "This is why I follow you. Quality content!",
  ];

  try {
    // Create users
    console.log('👤 Creating users...');
    const users: any[] = [];
    for (const userData of usernames) {
      const user = await authService.signup(
        userData.email,
        'Password123!',
        userData.name
      );
      users.push(user);
      console.log(`   ✓ Created user: ${userData.name}`);
    }

    // Create posts
    console.log('\n📝 Creating posts...');
    const posts: any[] = [];
    for (let i = 0; i < 28; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomContent = postContents[i % postContents.length];
      
      const post = await postsService.createPost(
        randomUser.id,
        { content: randomContent }
      );
      posts.push(post);
      console.log(`   ✓ Created post ${i + 1}/28 by ${randomUser.name}`);
    }

    // Create comments
    console.log('\n💬 Creating comments...');
    let totalComments = 0;
    for (const post of posts) {
      const numComments = Math.floor(Math.random() * 11) + 5; // 5-15 comments
      
      for (let i = 0; i < numComments; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomComment = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
        
        await commentsService.createComment(
          randomUser.id,
          post.id,
          randomComment,
        );
        totalComments++;
      }
      console.log(`   ✓ Added ${numComments} comments to post ${post.id}`);
    }

    console.log('\n✨ Seeding completed successfully!');
    console.log(`   Users created: ${users.length}`);
    console.log(`   Posts created: ${posts.length}`);
    console.log(`   Comments created: ${totalComments}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

*/