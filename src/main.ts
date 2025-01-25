import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://booking-chi-umber.vercel.app',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    )
    const config = new DocumentBuilder()
        .setTitle('Booking')
        .setDescription('The Booking API ')
        .setVersion('1.0')
        .addBearerAuth()
        .setContact(
            'Contact',
            'https://github.com/Subx1s0o',
            'subx1s0o@gmail.com',
        )
        .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, documentFactory)
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
