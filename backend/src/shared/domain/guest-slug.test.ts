import { describe, expect, it } from "vitest"
import { newGuestSlug } from "./guest-slug"

describe("guest slug", () => {
  it("normalizes Vietnamese guest names", async () => {
    await expect(newGuestSlug("Chú 3 Hưng", async () => false)).resolves.toBe("chu-3-hung")
  })
  it("adds the first available numeric suffix within a wedding", async () => {
    const taken = new Set(["anh-ba-hung", "anh-ba-hung-1"])
    await expect(newGuestSlug("Anh Ba Hưng", async slug => taken.has(slug))).resolves.toBe("anh-ba-hung-2")
  })
})
