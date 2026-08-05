import nodemailer from 'nodemailer'

import type { IdentityEmailSender } from '@/modules/identity/application/ports'

export class SmtpVerificationEmailSender implements IdentityEmailSender {
  private readonly transport

  constructor(
    host: string,
    port: number,
    secure: boolean,
    private readonly from: string,
    private readonly appOrigin: string,
    credentials?: { user: string; password: string },
  ) {
    this.transport = nodemailer.createTransport({
      host,
      port,
      secure,
      ...(credentials ? { auth: { user: credentials.user, pass: credentials.password } } : {}),
    })
  }

  async sendVerificationEmail(input: { email: string; token: string; expiresAt: Date }) {
    const url = new URL('/verify-email', this.appOrigin)
    url.searchParams.set('token', input.token)
    await this.transport.sendMail({
      from: this.from,
      to: input.email,
      subject: 'Xác minh email GMM Wedding',
      text: `Xác minh tài khoản tại ${url.toString()}\nLiên kết hết hạn lúc ${input.expiresAt.toISOString()}.`,
      html: `<p>Xác minh tài khoản GMM Wedding:</p><p><a href="${url.toString()}">Xác minh email</a></p><p>Liên kết hết hạn lúc ${input.expiresAt.toISOString()}.</p>`,
    })
  }

  async sendPasswordResetEmail(input: { email: string; token: string; expiresAt: Date }) {
    const url = new URL('/reset-password', this.appOrigin)
    url.searchParams.set('token', input.token)
    await this.transport.sendMail({
      from: this.from,
      to: input.email,
      subject: 'Đặt lại mật khẩu GMM Wedding',
      text: `Đặt lại mật khẩu tại ${url.toString()}\nLiên kết hết hạn lúc ${input.expiresAt.toISOString()}.`,
      html: `<p>Bạn đã yêu cầu đặt lại mật khẩu GMM Wedding:</p><p><a href="${url.toString()}">Đặt lại mật khẩu</a></p><p>Liên kết hết hạn lúc ${input.expiresAt.toISOString()}.</p>`,
    })
  }
}
