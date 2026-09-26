export function mergeSectionOrder(
  canonicalKeys: string[],
  storedKeys: string[],
  pinnedKeys: string[] = [],
) {
  const pinned = new Set(pinnedKeys)
  const storedReorderable = [
    ...new Set(storedKeys.filter((key) => canonicalKeys.includes(key) && !pinned.has(key))),
  ]
  const canonicalReorderable = canonicalKeys.filter((key) => !pinned.has(key))
  const reorderable = [
    ...storedReorderable,
    ...canonicalReorderable.filter((key) => !storedReorderable.includes(key)),
  ]
  let reorderableIndex = 0
  return canonicalKeys.map((key) =>
    pinned.has(key) ? key : reorderable[reorderableIndex++],
  )
}
