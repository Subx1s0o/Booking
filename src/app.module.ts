import { Module } from '@nestjs/common'
import { UsersModule } from './core/users/users.module'
import { ConfigModule } from '@nestjs/config'
import { ConfigService } from './shared/services/config.service'
import { PrismaService } from './shared/services/prisma.service'
import { AuthModule } from './core/auth/auth.module'

@Module({
    imports: [ConfigModule, UsersModule, AuthModule],
    providers: [ConfigService, PrismaService],
})
export class AppModule {}
