import { JwtModule } from '@nestjs/jwt'

import { Module } from '@nestjs/common'
import { ConfigService } from '@/common/config/config.service'

import { AuthController } from './auth.controller'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from './auth.service'
import { PrismaService } from '@/shared/services/prisma.service'
import { CloudinaryModule } from '@/common/cloudinary/cloudinary.module'

@Module({
    imports: [
        CloudinaryModule,
        ConfigModule,
        JwtModule.registerAsync({
            global: true,
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET') as string,
                signOptions: { expiresIn: '5d' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [PrismaService, ConfigService, AuthService],
})
export class AuthModule {}
