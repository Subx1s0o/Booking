import { JwtModule } from '@nestjs/jwt'

import { Module } from '@nestjs/common'
import { ConfigService } from '@/shared/services/config.service'
import { DatabaseRepository } from '@/infra/database/database.repository'
import { AuthController } from './auth.controller'

@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET') as string,
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [DatabaseRepository],
})
export class AuthModule {}
