import {
    applyDecorators,
    SetMetadata,
    UseGuards,
} from '@nestjs/common/decorators/core'

import { RolesType } from 'types/Roles'
import { AuthGuard } from '../guards/AuthGuard'
import { RolesGuard } from '../guards/RolesGuard'

export const Auth = (...roles: RolesType[]) => {
    return applyDecorators(
        SetMetadata('roles', roles.length ? roles : null),
        UseGuards(AuthGuard, ...(roles.length ? [RolesGuard] : [])),
    )
}
