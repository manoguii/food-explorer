import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as bodyParser from 'body-parser'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  app.use(
    bodyParser.json({
      verify: function (req, res, buf) {
        req.rawBody = buf.toString()
      },
    }),
  )

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  const config = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription('The Restaurant API food explorer')
    .setVersion('1.0')
    .addTag('Dish')
    .addTag('Categories')
    .addTag('Attachments')
    .addTag('Carts')
    .addTag('Sessions')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.enableCors()
  await app.listen(port)
}
bootstrap()
