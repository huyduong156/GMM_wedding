import { hash as argonHash, verify as argonVerify } from '@node-rs/argon2'
import type { Options as ArgonOptions } from '@node-rs/argon2'

import type { PasswordHasher } from '@/modules/identity/application/ports'

const ARGON_OPTIONS: ArgonOptions = {
  algorithm: 2,
  memoryCost: 65_536,
  timeCost: 3,
  parallelism: 4,
  outputLen: 32,
}

export class ArgonPasswordHasher implements PasswordHasher {
  private dummyHashPromise?: Promise<string>

  hash(password: string): Promise<string> {
    return argonHash(password, ARGON_OPTIONS)
  }

  verify(hash: string, password: string): Promise<boolean> {
    return argonVerify(hash, password)
  }

  async verifyDummy(password: string): Promise<void> {
    this.dummyHashPromise ??= this.hash('gmm-dummy-password-not-an-account')
    await this.verify(await this.dummyHashPromise, password)
  }

  needsRehash(hash: string): boolean {
    return !hash.startsWith('$argon2id$v=19$m=65536,t=3,p=4$')
  }
}
