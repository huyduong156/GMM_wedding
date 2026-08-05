import { useEffect, useState } from 'react'
import { ArrowClockwise, Clock } from '@phosphor-icons/react'
import { AuthApiError, authApi } from '../../../shared/api/auth'

const COOLDOWN_SECONDS = 60

function resendEnabled() {
  return import.meta.env.VITE_AUTH_RESEND_ENABLED === 'true'
}

function resendError(reason: unknown) {
  if (!(reason instanceof AuthApiError)) return 'Không thể gửi lại email lúc này. Vui lòng thử lại.'
  if (reason.code === 'RATE_LIMITED') return 'Bạn đã yêu cầu quá nhiều lần. Vui lòng chờ rồi thử lại.'
  if (reason.code === 'REQUEST_ORIGIN_REJECTED') return 'Yêu cầu bị từ chối. Hãy kiểm tra cấu hình địa chỉ frontend.'
  return 'Không thể gửi lại email lúc này. Vui lòng thử lại.'
}

export function ResendVerificationControl({ initialEmail = '' }: { initialEmail?: string }) {
  const enabled = resendEnabled()
  const [email, setEmail] = useState(initialEmail)
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  async function resend() {
    if (!enabled || !email.trim() || submitting || cooldown > 0) return
    setSubmitting(true); setError(''); setMessage('')
    try {
      await authApi.resendVerification(email.trim())
      setMessage('Nếu tài khoản đang chờ xác minh, một email mới đã được gửi.')
      setCooldown(COOLDOWN_SECONDS)
    } catch (reason) { setError(resendError(reason)) }
    finally { setSubmitting(false) }
  }

  return <section className="auth-resend" aria-labelledby="resend-verification-title">
    <div><strong id="resend-verification-title">Chưa nhận được email?</strong><span>Kiểm tra cả thư mục spam hoặc gửi lại hướng dẫn xác minh.</span></div>
    {!initialEmail ? <><label htmlFor="resend-email">Email đăng ký</label><input id="resend-email" type="email" autoComplete="email" maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} disabled={!enabled || submitting} /></> : null}
    <button className="button button-secondary auth-resend-button" type="button" onClick={resend} disabled={!enabled || !email.trim() || submitting || cooldown > 0}>
      {cooldown > 0 ? <><Clock size={16} /> Gửi lại sau {cooldown}s</> : <><ArrowClockwise size={16} /> {submitting ? 'Đang gửi…' : 'Gửi lại email xác minh'}</>}
    </button>
    {!enabled ? <small>Tính năng sẽ được bật khi backend hỗ trợ gửi lại email xác minh.</small> : null}
    {message ? <p className="auth-resend-message" role="status">{message}</p> : null}
    {error ? <p className="auth-form-error" role="alert">{error}</p> : null}
  </section>
}
