import { IsDateString, IsString, Matches } from 'class-validator'

export class CreateReservationDto {
    @IsDateString()
    date: string

    @IsString()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
        message: 'Time must be in the format HH:mm (e.g., 00:00)',
    })
    time: string
}
