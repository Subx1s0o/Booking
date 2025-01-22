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
import {
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiParam,
} from '@nestjs/swagger'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Get all users' })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Limit number of users per page',
    })
    @ApiOkResponse({
        description: 'Successfully fetched all users.',
    })
    @ApiBadRequestResponse({
        description: 'Invalid query parameters.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.',
    })
    @Get()
    async getAllUsers(
        @Query('page') page: string,
        @Query('limit') limit: string,
    ) {
        return await this.usersService.getAllUsers({}, page, limit)
    }

    @ApiOperation({ summary: 'Get business users' })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Limit number of business users per page',
    })
    @ApiOkResponse({
        description: 'Successfully fetched business users.',
    })
    @ApiBadRequestResponse({
        description: 'Invalid query parameters.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.',
    })
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

    @ApiOperation({ summary: 'Get client users' })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Limit number of client users per page',
    })
    @ApiOkResponse({
        description: 'Successfully fetched client users.',
    })
    @ApiBadRequestResponse({
        description: 'Invalid query parameters.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.',
    })
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
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', description: 'User ID', required: true })
    @ApiOkResponse({
        description: 'Successfully fetched user.',
    })
    @ApiBadRequestResponse({
        description: 'Invalid user ID.',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.',
    })
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(id)
    }

    @ApiOperation({ summary: 'Update user' })
    @ApiOkResponse({
        description: 'Successfully updated user.',
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data.',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.',
    })
    @Patch()
    @Auth()
    async updateUser(@Req() req: RequestUser, @Body() data: UpdateUserDto) {
        return await this.usersService.updateUser(req.user.id, data)
    }

    @ApiOperation({ summary: 'Delete user' })
    @ApiOkResponse({
        description: 'Successfully deleted user.',
    })
    @ApiBadRequestResponse({
        description: 'Invalid request to delete user.',
    })
    @ApiResponse({
        status: 404,
        description: 'User not found.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.',
    })
    @Delete()
    @Auth()
    async deleteUser(@Req() req: RequestUser) {
        return await this.usersService.deleteUser(req.user.id)
    }
}
