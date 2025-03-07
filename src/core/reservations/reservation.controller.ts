import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
} from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { Auth } from '@/shared/decorators/Auth'
import { RequestUser } from 'types/request-user'

import { UpdateReservationDto } from './dto/update'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { CreateReservationDto } from './dto/create'

@Controller('reservations')
@ApiBearerAuth()
@Auth()
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @ApiOperation({ summary: 'Create a reservation' })
    @ApiCreatedResponse({
        description: 'The reservation has been successfully created.',
    })
    @ApiBadRequestResponse({
        description: "Client or business doesn't exist",
    })
    @ApiConflictResponse({
        description:
            'A reservation between this client and business already exists.',
    })
    @ApiUnauthorizedResponse({
        description:
            "You don't have permission to create a reservation, only clients can",
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    @Auth('client')
    @Post(':id')
    async create(
        @Param('id') businessId: string,
        @Req() req: RequestUser,
        @Body() data: CreateReservationDto,
    ) {
        return await this.reservationService.create(
            businessId,
            req.user.id,
            data,
        )
    }

    @ApiOperation({ summary: 'Finding all reservations' })
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
        description: 'The reservation has been successfully found.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    @Get()
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Req() req: RequestUser,
    ) {
        return await this.reservationService.findAll(req.user.id, page, limit)
    }

    @ApiOperation({ summary: 'Finding a specific reservation' })
    @ApiOkResponse({
        description: 'The reservation has been successfully found.',
    })
    @ApiBadRequestResponse({
        description: 'Invalid reservation ID',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.reservationService.findOne(id)
    }

    @ApiOperation({ summary: 'Update a reservation' })
    @ApiOkResponse({
        description: 'The reservation has been successfully updated.',
    })
    @ApiNotFoundResponse({
        description: 'Reservation was not found',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    @Patch(':id')
    async updateReservation(
        @Param('id') reservationId: string,
        @Body() updateDto: UpdateReservationDto,
    ) {
        return await this.reservationService.updateOne({
            id: reservationId,
            data: updateDto,
        })
    }

    @ApiOperation({ summary: 'Update the time for a reservation' })
    @ApiOkResponse({
        description: 'The reservation time has been successfully updated.',
    })
    @ApiBadRequestResponse({
        description: 'Invalid reservation ID or time format',
    })
    @ApiConflictResponse({
        description: 'This time slot is already occupied.',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    @Patch(':id/time')
    async updateReservationTime(
        @Param('id') reservationId: string,
        @Body() data: CreateReservationDto,
    ) {
        return await this.reservationService.updateReservationTime(
            reservationId,
            data,
        )
    }

    @ApiOperation({ summary: 'Delete a reservation' })
    @ApiOkResponse({
        description: 'The reservation has been successfully deleted.',
    })
    @ApiNotFoundResponse({
        description: 'Reservation was not found',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.reservationService.delete(id)
    }
}
