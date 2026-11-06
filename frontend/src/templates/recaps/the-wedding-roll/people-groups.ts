import type { TheWeddingRollMedia, TheWeddingRollPeopleGroup } from './content'

type RecordValue = Record<string, unknown>

function mediaItems(value: unknown): TheWeddingRollMedia[] {
  const values = Array.isArray(value) ? value : value && typeof value === 'object' ? [value] : []
  return values
    .filter(
      (item): item is TheWeddingRollMedia =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as RecordValue).src === 'string',
    )
    .slice(0, 10)
}

export function normalizePeopleGroups(
  peopleBehindTheDay: unknown,
  behindTheScenes?: unknown,
): TheWeddingRollPeopleGroup[] {
  if (!peopleBehindTheDay || typeof peopleBehindTheDay !== 'object') return []
  const people = peopleBehindTheDay as RecordValue
  if (Array.isArray(people.groups)) {
    return people.groups
      .filter((group): group is RecordValue => Boolean(group) && typeof group === 'object')
      .map((group, index) => ({
        id: typeof group.id === 'string' ? group.id : `people-group-${index + 1}`,
        title: typeof group.title === 'string' ? group.title : `Nhóm ${index + 1}`,
        caption: typeof group.caption === 'string' ? group.caption : '',
        photos: mediaItems(group.photos),
      }))
      .slice(0, 10)
  }

  const legacyPeople = Array.isArray(people.people) ? people.people : []
  const migrated = legacyPeople
    .filter((person): person is RecordValue => Boolean(person) && typeof person === 'object')
    .map((person, index) => ({
      id: typeof person.id === 'string' ? person.id : `person-${index + 1}`,
      title: typeof person.name === 'string' ? person.name : `Người thân ${index + 1}`,
      caption: typeof person.role === 'string' ? person.role : '',
      photos: mediaItems([person.portrait, person.gallery].flat()),
    }))

  if (behindTheScenes && typeof behindTheScenes === 'object') {
    const backstage = behindTheScenes as RecordValue
    const items = Array.isArray(backstage.items) ? backstage.items : []
    const photos = items.flatMap((item) => {
      if (!item || typeof item !== 'object') return []
      const record = item as RecordValue
      return mediaItems([record.cover, record.gallery].flat())
    })
    if (photos.length) {
      migrated.push({
        id: 'behind-the-scenes',
        title: 'Hậu trường',
        caption: typeof backstage.intro === 'string' ? backstage.intro : '',
        photos: photos.slice(0, 10),
      })
    }
  }
  return migrated.slice(0, 10)
}
