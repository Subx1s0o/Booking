import { Module } from '@nestjs/common'
import { BusinessUserService } from './business-user.service'
import { BusinessUserController } from './business-user.controller'

@Module({
    controllers: [BusinessUserController],
    providers: [BusinessUserService],
})
export class BusinessUserModule {}
