export class RsvpError extends Error {
  constructor(readonly code: string, readonly status: number, message: string) {
    super(message)
    this.name = 'RsvpError'
  }
}
