import { httpClient } from '@/features/auth/api/http-client'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types'

export function login(request: LoginRequest, signal?: AbortSignal) {
  return httpClient<LoginResponse>('/api/auth/login', {
    body: request,
    method: 'POST',
    signal,
  })
}

export function register(request: RegisterRequest, signal?: AbortSignal) {
  return httpClient<RegisterResponse>('/api/auth/register', {
    body: request,
    method: 'POST',
    signal,
  })
}
