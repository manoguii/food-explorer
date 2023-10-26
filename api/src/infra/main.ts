import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  const config = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription('The Restaurant API food explorer')
    .setVersion('1.0')
    .addTag('Dish')
    .addTag('Categories')
    .addTag('Attachments')
    .addTag('Orders')
    .addTag('Sessions')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.enableCors()
  await app.listen(port)
}
bootstrap()
