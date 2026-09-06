import Swal, { type SweetAlertOptions, type SweetAlertResult } from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const DEFAULT_TIMER = 2200
const alertInstance = Swal.mixin({})

function fire(options: SweetAlertOptions): Promise<SweetAlertResult> {
  if (import.meta.env.MODE === 'test')
    return Promise.resolve({ isDismissed: true } as SweetAlertResult)
  return Promise.resolve(
    alertInstance.fire({
      ...(options.toast ? {} : { heightAuto: false }),
      ...options,
    }),
  ).catch(() => ({ isDismissed: true }) as SweetAlertResult)
}

let timedQueue: Promise<unknown> = Promise.resolve()

function timed(options: SweetAlertOptions): Promise<SweetAlertResult> {
  const next = timedQueue.then(() =>
    fire({
      toast: true,
      position: 'top-end',
      timer: DEFAULT_TIMER,
      timerProgressBar: true,
      showConfirmButton: false,
      ...options,
    }),
  )
  timedQueue = next.then(
    () => undefined,
    () => undefined,
  )
  return next
}

export const notifications = {
  fire(options: SweetAlertOptions) {
    return options.showCancelButton
      ? this.confirm(options)
      : options.toast === false
        ? this.alert(options)
        : timed(options)
  },
  close() {
    alertInstance.close()
  },
  success(title: string, options: SweetAlertOptions = {}) {
    return timed({ icon: 'success', title, ...options })
  },
  error(title: string, text?: string, options: SweetAlertOptions = {}) {
    return timed({ icon: 'error', title, ...(text ? { text } : {}), ...options })
  },
  info(title: string, text?: string, options: SweetAlertOptions = {}) {
    return timed({ icon: 'info', title, ...(text ? { text } : {}), ...options })
  },
  warning(title: string, text?: string, options: SweetAlertOptions = {}) {
    return timed({ icon: 'warning', title, ...(text ? { text } : {}), ...options })
  },
  alert(options: SweetAlertOptions) {
    return fire({
      timer: DEFAULT_TIMER,
      timerProgressBar: true,
      showConfirmButton: false,
      ...options,
    })
  },
  confirm(options: SweetAlertOptions) {
    return fire({
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
      focusCancel: true,
      ...options,
    })
  },
  delete(title: string, text: string) {
    return fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#a43d34',
      reverseButtons: true,
      focusCancel: true,
    })
  },
}

export type Notifications = typeof notifications
