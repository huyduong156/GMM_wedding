import { z } from 'zod'

const emailSchema = z.string().trim().email().max(320).transform((value) => value.toLowerCase())
const passwordSchema = z.string().min(12).max(128)

export const registerRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().trim().min(1).max(120).optional(),
}).strict()

export const verifyEmailRequestSchema = z.object({
  token: z.string().min(20).max(512),
}).strict()

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
}).strict()

export const forgotPasswordRequestSchema = z.object({ email: emailSchema }).strict()
export const resetPasswordRequestSchema = z.object({
  token: z.string().min(20).max(512),
  password: passwordSchema,
}).strict()

export type RegisterRequest = z.infer<typeof registerRequestSchema>
export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>

