import { Statuses } from '@/shared/constans/statuses'

export type StatusesType = (typeof Statuses)[keyof typeof Statuses]
