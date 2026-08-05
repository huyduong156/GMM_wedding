import argon2, { type HashOptions } from 'argon2'

import type { PasswordHasher } from '@/modules/identity/application/ports'

const ARGON_OPTIONS: HashOptions & { raw: false } = {
  type: argon2.argon2id,
  memoryCost: 65_536,
  timeCost: 3,
  parallelism: 4,
  hashLength: 32,
  raw: false,
}

export class ArgonPasswordHasher implements PasswordHasher {
  private dummyHashPromise?: Promise<string>

  hash(password: string): Promise<string> {
    return argon2.hash(password, ARGON_OPTIONS)
  }

  verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password)
  }

  async verifyDummy(password: string): Promise<void> {
    this.dummyHashPromise ??= this.hash('gmm-dummy-password-not-an-account')
    await this.verify(await this.dummyHashPromise, password)
  }

  needsRehash(hash: string): boolean {
    return argon2.needsRehash(hash, ARGON_OPTIONS)
  }
}
