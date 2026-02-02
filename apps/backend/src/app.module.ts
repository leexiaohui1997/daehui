import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PermissionModule } from './modules/permission/permission.module'
import { PermissionMenuModule } from './modules/permission-menu/permission-menu.module'
import { RedisModule } from './modules/redis/redis.module'
import { UserModule } from './modules/user/user.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') === 'development', // 开发环境方便调试，生产环境请关闭
      }),
    }),
    SharedModule,
    RedisModule,
    UserModule,
    PermissionModule,
    PermissionMenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
