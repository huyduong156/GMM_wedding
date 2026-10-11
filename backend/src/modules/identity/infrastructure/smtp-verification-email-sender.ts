import nodemailer from 'nodemailer'

import type { IdentityEmailSender } from '@/modules/identity/application/ports'

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character,
  )
}

function formatExpiry(date: Date) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date)
}

function verificationEmailHtml(url: string, expiresAt: Date) {
  const safeUrl = escapeHtml(url)
  const safeExpiry = escapeHtml(formatExpiry(expiresAt))
  return `<!doctype html>
<html lang="vi">
  <body style="margin:0;padding:0;background:#f5f0ea;color:#30241f;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Xác minh email để bắt đầu chuẩn bị ngày cưới cùng Ourday.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f0ea;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border:1px solid #eadfd5;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:26px 32px;background:#4b2d23;color:#fffaf5;">
                <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#e6c58c;">OURDAY</div>
                <div style="margin-top:8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.15;">Một nơi cho ngày trọng đại</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 32px;">
                <div style="display:inline-block;padding:7px 10px;border-radius:999px;background:#f7efe6;color:#9a6b3f;font-size:11px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;">Xác minh tài khoản</div>
                <h1 style="margin:18px 0 12px;color:#30241f;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:normal;line-height:1.2;">Chào mừng bạn đến với Ourday</h1>
                <p style="margin:0;color:#6f625b;font-size:16px;line-height:1.7;">Chỉ còn một bước nhỏ để kích hoạt tài khoản và bắt đầu tạo không gian cưới riêng của bạn.</p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 24px;">
                  <tr>
                    <td align="center" style="border-radius:10px;background:#9a5f3f;">
                      <a href="${safeUrl}" style="display:inline-block;padding:14px 24px;border:1px solid #9a5f3f;border-radius:10px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">Xác minh email</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;color:#8a7a70;font-size:12px;line-height:1.6;">Nếu nút không hoạt động, hãy sao chép liên kết dưới đây vào trình duyệt:</p>
                <p style="margin:0;word-break:break-all;color:#9a5f3f;font-size:12px;line-height:1.6;"><a href="${safeUrl}" style="color:#9a5f3f;">${safeUrl}</a></p>
                <div style="height:1px;margin:28px 0;background:#eee5dc;"></div>
                <p style="margin:0;color:#8a7a70;font-size:12px;line-height:1.6;">Liên kết này hết hạn lúc <strong style="color:#5e4b41;">${safeExpiry}</strong>.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background:#fbf8f4;color:#9a8b82;font-size:11px;line-height:1.6;">Nếu bạn không tạo tài khoản Ourday, bạn có thể bỏ qua email này.</td>
            </tr>
          </table>
          <p style="margin:18px 0 0;color:#a49389;font-size:11px;line-height:1.5;">© Ourday · Thiệp đẹp, khách mời đủ, kỷ niệm còn mãi.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

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
    const expiry = formatExpiry(input.expiresAt)
    await this.transport.sendMail({
      from: this.from,
      to: input.email,
      subject: 'Xác minh email | Ourday',
      text: `Chào mừng bạn đến với Ourday.\n\nXác minh email tại: ${url.toString()}\n\nLiên kết hết hạn lúc ${expiry}.`,
      html: verificationEmailHtml(url.toString(), input.expiresAt),
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
