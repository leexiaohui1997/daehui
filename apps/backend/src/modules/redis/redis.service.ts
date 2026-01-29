import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    })
  }

  onModuleDestroy() {
    this.client.disconnect()
  }

  /**
   * 设置值
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（秒）
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl)
    } else {
      await this.client.set(key, value)
    }
  }

  /**
   * 获取值
   * @param key 键
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  /**
   * 删除键
   * @param key 键
   */
  async del(key: string): Promise<void> {
    await this.client.del(key)
  }
}
