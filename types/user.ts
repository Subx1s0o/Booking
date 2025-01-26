import { RolesType } from './Roles'

export type User = {
    id: string
    firstName: string
    secondName: string
    password: string
    phone?: number
    email: string
    role: RolesType
    address?: string
    business?: string
}
