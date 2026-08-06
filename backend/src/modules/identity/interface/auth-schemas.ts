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

export const resendVerificationRequestSchema = z.object({ email: emailSchema }).strict()

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
}).strict()

export const forgotPasswordRequestSchema = z.object({ email: emailSchema }).strict()
export const resetPasswordRequestSchema = z.object({
  token: z.string().min(20).max(512),
  password: passwordSchema,
}).strict()

export const updateProfileRequestSchema = z.object({
  displayName: z.string().trim().min(1).max(120).nullable().optional(),
  phone: z.string().trim().min(7).max(32).regex(/^[+\d][\d\s().-]+$/).nullable().optional(),
  avatarUrl: z.string().url().max(2048).nullable().optional(),
  locale: z.string().trim().min(2).max(16).regex(/^[a-z]{2}(?:-[A-Z]{2})?$/).optional(),
  timezone: z.string().trim().min(1).max(64).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'At least one profile field is required')

export type RegisterRequest = z.infer<typeof registerRequestSchema>
export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>
export type ResendVerificationRequest = z.infer<typeof resendVerificationRequestSchema>
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>

