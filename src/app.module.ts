import { Module } from '@nestjs/common'
import { UsersModule } from './core/users/users.module'
import { ConfigModule } from './common/config/config.module'
import { PrismaService } from './shared/services/prisma.service'
import { AuthModule } from './core/auth/auth.module'
import { ConfigService } from './common/config/config.service'
import { ReservationModule } from './core/reservations/reservation.module'

@Module({
    imports: [ConfigModule, UsersModule, AuthModule, ReservationModule],
    providers: [PrismaService, ConfigService],
})
export class AppModule {}
