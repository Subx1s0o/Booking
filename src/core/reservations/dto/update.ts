import { ApiPropertyOptional } from '@nestjs/swagger'
import { Statuses } from '@/shared/constans/statuses'
import { Transform, Type } from 'class-transformer'
import {
    IsDate,
    IsIn,
    IsNumber,
    IsOptional,
    Matches,
    Min,
} from 'class-validator'
import { StatusesType } from 'types/statuses.type'

export class UpdateReservationDto {
    @ApiPropertyOptional({
        description: 'Status of the reservation',
        enum: Object.values(Statuses),
        example: Statuses.CLOSED,
    })
    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsIn(Object.values(Statuses))
    status: StatusesType

    @ApiPropertyOptional({
        description: 'Time of the reservation in HH:mm',
        example: '14:30',
        pattern: '^([0-1]\\d|2[0-3]):([0-5]\\d)$',
    })
    @IsOptional()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Time must be in the format HH:mm (e.g., 00:00)',
    })
    time: string

    @ApiPropertyOptional({
        description: 'Date of the reservation',
        example: '2025-01-24T14:30:00.000Z',
        type: String,
        format: 'date-time',
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    reservationDate: Date

    @ApiPropertyOptional({
        description: 'Duration of the reservation (minimum 15m)',
        example: 30,
        minimum: 15,
    })
    @IsOptional()
    @IsNumber()
    @Min(15, { message: 'Duration must be at least 15 minutes' })
    duration: number
}
