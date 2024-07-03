import { TagsModule } from './modules/tags/tags.module';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { AppService } from 'src/app.service';
import { PagesModule } from './modules/pages/pages.module';
import { ArticlesModule } from 'src/modules/article/article.module';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppViewController } from './app-view.controller';
import { ProductsModule } from './modules/products/products.module';
import { WebsiteModule } from './modules/website/website.module';
import { GlobalModule } from './global/global.module';
import { CommentsModule } from './modules/comments/comments.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { mongoValidationFilter } from './filters/mongoServerError.filter';
import { validationFilter } from './filters/validation.filter';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { CosModule } from './modules/cos/cos.module';
import { UsersModule } from './modules/users/users.module';
import { AppApiController } from './app-api.controller';
import { LanguageMiddleware } from './middlewares/language.middleware';
import { KeywordsModule } from './modules/keywords/keywords.module';
import { RolesGuard } from './modules/auth/roles.guard';
import { AppStaticController } from './app-static.controller';
import { MagazinesModule } from './modules/magazines/magazines.module';
import { VideosModule } from './modules/videos/videos.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_SECRET_URL),
    ProductsModule,
    PagesModule,
    ArticlesModule,
    WebsiteModule,
    GlobalModule,
    CommentsModule,
    AuthModule,
    UsersModule,
    CosModule,
    TagsModule,
    KeywordsModule,
    MagazinesModule,
    VideosModule,
  ],
  controllers: [AppViewController, AppApiController, AppStaticController],
  providers: [
    AppService,
    // APP_GUARD:提供者令牌（token），用于指定全局异常过滤器
    // APP_INTERCEPTOR:特殊的提供者令牌，用于指定全局守卫
    // APP_PIPE:用于指定全局管道的提供者令牌
    // APP_FILTER:用于指定全局拦截器的提供者令牌
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: validationFilter,
    },
    {
      provide: APP_FILTER,
      useClass: mongoValidationFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
