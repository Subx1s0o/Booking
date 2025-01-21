import { Module } from '@nestjs/common'
import { ClientUserService } from './client-user.service'
import { ClientUserController } from './client-user.controller'

@Module({
    controllers: [ClientUserController],
    providers: [ClientUserService],
})
export class ClientUserModule {}
