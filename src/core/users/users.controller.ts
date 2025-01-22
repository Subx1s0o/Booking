import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers() {
        return await this.usersService.getAllUsers()
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(id)
    }

    @Get('business')
    async getBusinessUsers() {}

    @Get('client')
    async getClientUsers() {}

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() data) {
        return await this.usersService.updateUser(id, data)
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return await this.usersService.deleteUser(id)
    }
}
