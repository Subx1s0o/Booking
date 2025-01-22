import { Request } from 'express'
import { RolesType } from './Roles'

export type RequestUser = Request & {
    user: {
        id: string
        role: RolesType
    }
}
