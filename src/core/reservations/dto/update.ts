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
    @IsOptional()
    @Transform(({ value }) => value.trim())
    @IsIn(Object.values(Statuses))
    status: StatusesType

    @IsOptional()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Time must be in the format HH:mm (e.g., 00:00)',
    })
    time: string

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    reservationDate: Date

    @IsOptional()
    @IsNumber()
    @Min(15, { message: 'Duration must be at least 15 minutes' })
    duration: number
}
