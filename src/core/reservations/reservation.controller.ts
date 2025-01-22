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

@Controller('reservations')
@Auth()
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Auth('client')
    @Post(':id')
    async create(@Param('id') businessId: string, @Req() req: RequestUser) {
        return await this.reservationService.create(businessId, req.user.id)
    }

    @Get()
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Req() req: RequestUser,
    ) {
        return await this.reservationService.findAll(req.user.id, page, limit)
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.reservationService.findOne(id)
    }

    @Patch(':id')
    async updateReservation(
        @Param('id') reservationId: string,
        @Body()
        updateDto: UpdateReservationDto,
    ) {
        return await this.reservationService.updateOne({
            id: reservationId,
            data: updateDto,
        })
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.reservationService.delete(id)
    }
}
