import { Module } from '@nestjs/common'
import { BusinessUserModule } from './business/business-user.module'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
    imports: [BusinessUserModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
