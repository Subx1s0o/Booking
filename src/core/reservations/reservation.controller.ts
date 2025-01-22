import { Controller, Delete, Get, Param, Patch } from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { Auth } from '@/shared/decorators/Auth'

@Controller('reservations')
@Auth()
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Auth('client')
    async create() {}

    async findAll() {}

    @Get(':id')
    async findOne(@Param('id') id: string) {}

    @Patch(':id')
    async update(@Param('id') id: string, data) {}

    @Delete(':id')
    async remove(@Param('id') id: string) {}
}
