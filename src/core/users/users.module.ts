import { Module } from '@nestjs/common'
import { BusinessUserModule } from './business/business-user.module'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { DatabaseRepository } from '@/infra/database/database.repository'

@Module({
    imports: [BusinessUserModule],
    controllers: [UsersController],
    providers: [UsersService, DatabaseRepository],
})
export class UsersModule {}
