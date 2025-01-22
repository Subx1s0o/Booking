import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Query,
    Req,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { Auth } from '@/shared/decorators/Auth'
import { RequestUser } from 'types/request-user'
import { UpdateUserDto } from './dto/update'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers(
        @Query('page') page: string,
        @Query('limit') limit: string,
    ) {
        return await this.usersService.getAllUsers({}, page, limit)
    }

    @Get('business')
    async getBusinessUsers(
        @Query('page') page: string,
        @Query('limit') limit: string,
    ) {
        return await this.usersService.getAllUsers(
            { role: 'business' },
            page,
            limit,
        )
    }

    @Get('client')
    async getClientUsers(
        @Query('page') page: string,
        @Query('limit') limit: string,
    ) {
        return await this.usersService.getAllUsers(
            { role: 'client' },
            page,
            limit,
        )
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(id)
    }

    @Patch()
    @Auth()
    async updateUser(@Req() req: RequestUser, @Body() data: UpdateUserDto) {
        return await this.usersService.updateUser(req.user.id, data)
    }

    @Delete()
    @Auth()
    async deleteUser(@Req() req: RequestUser) {
        return await this.usersService.deleteUser(req.user.id)
    }
}
