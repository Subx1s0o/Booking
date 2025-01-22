import { Roles } from '@/shared/constans/roles'

export type RolesType = (typeof Roles)[keyof typeof Roles]
