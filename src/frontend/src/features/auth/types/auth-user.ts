export type UserRole = 'Admin' | 'Manager' | 'Member'

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
}
