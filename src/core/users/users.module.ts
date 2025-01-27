import { Module } from '@nestjs/common'

import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { PrismaService } from '@/shared/services/prisma.service'
import { CloudinaryModule } from '@/common/cloudinary/cloudinary.module'

@Module({
    imports: [CloudinaryModule],
    controllers: [UsersController],
    providers: [UsersService, PrismaService],
})
export class UsersModule {}
