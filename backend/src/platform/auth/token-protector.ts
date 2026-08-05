import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

export class TokenProtector {
  private readonly key: Buffer

  constructor(secret: string) {
    this.key = createHash('sha256').update(secret, 'utf8').digest()
  }

  encrypt(value: string): string {
    const iv = randomBytes(12)
    const cipher = createCipheriv('aes-256-gcm', this.key, iv)
    const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
    const tag = cipher.getAuthTag()
    return Buffer.concat([iv, tag, ciphertext]).toString('base64url')
  }

  decrypt(payload: string): string {
    const bytes = Buffer.from(payload, 'base64url')
    const iv = bytes.subarray(0, 12)
    const tag = bytes.subarray(12, 28)
    const ciphertext = bytes.subarray(28)
    const decipher = createDecipheriv('aes-256-gcm', this.key, iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
  }
}

