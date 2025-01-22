import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Query,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { Auth } from '@/shared/decorators/Auth'

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

    @Patch(':id')
    @Auth()
    async updateUser(@Param('id') id: string, @Body() data) {
        return await this.usersService.updateUser(id, data)
    }

    @Delete(':id')
    @Auth()
    async deleteUser(@Param('id') id: string) {
        return await this.usersService.deleteUser(id)
    }
}
