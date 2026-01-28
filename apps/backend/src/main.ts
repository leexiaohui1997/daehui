import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 注册全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor())
  // 注册全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
