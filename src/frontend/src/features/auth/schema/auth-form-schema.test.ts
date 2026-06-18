import { describe, expect, it } from 'vitest'
import { registerSchema } from './auth-form-schema'

describe('registerSchema', () => {
  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'Password123!',
      confirmPassword: 'Different123!',
    })

    expect(result.success).toBe(false)
  })
})
