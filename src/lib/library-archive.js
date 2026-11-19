/**
 * @typedef {object} LibraryRow
 * @property {string=} title Display title.
 * @property {string=} link Source item URL used for deduplication.
 * @property {string=} cover Cover URL or local asset path.
 * @property {string=} date Archive date.
 * @property {number=} rating Rating from zero to five.
 * @property {string=} comment Personal review.
 * @property {string=} category Library category.
 */

/**
 * Normalize supported archive shapes into the fields consumed by Library.
 * @param {string} category
 * @param {any} jsonData
 */
export function normalizeLibraryRows(category, jsonData) {
  const rows = Array.isArray(jsonData)
    ? jsonData
    : (jsonData?.data ?? jsonData?.items ?? jsonData?.results ?? [])

  if (!Array.isArray(rows))
    return []

  return rows.map((raw) => {
    const item = raw?.item ?? raw
    const created = raw?.created_time
      ?? raw?.created_at
      ?? item?.created_time
      ?? item?.created_at
      ?? raw?.time
      ?? raw?.date
      ?? raw?.updated_at
      ?? ''
    const title = item?.title
      ?? item?.name
      ?? item?.original_title
      ?? item?.subject
      ?? raw?.title
      ?? ''
    const cover = item?.cover_image_url
      ?? item?.cover
      ?? item?.image
      ?? item?.poster
      ?? item?.pic
      ?? item?.thumbnail
      ?? raw?.cover
      ?? ''

    let uuid = item?.uuid ?? item?.id ?? item?.slug ?? item?.sid ?? ''
    if (!uuid && raw?.link) {
      const parts = raw.link.split('/')
      uuid = parts[parts.length - 2] || parts[parts.length - 1]
    }

    return {
      ...raw,
      _item: item,
      _created: created,
      _title: title,
      _cover: cover,
      _uuid: uuid,
      _rating: raw?.rating ?? item?.rating ?? raw?.rate ?? item?.rate ?? null,
      _comment: raw?.comment ?? item?.comment ?? raw?.notes ?? item?.notes ?? '',
      category: raw?.category || category,
    }
  })
}

function getEntryKey(entry) {
  return entry.link
    || [entry.category, entry.title, entry.date, entry.cover].join('\u0000')
}

function getEntryTime(entry) {
  const time = Date.parse(entry.date ?? entry._created ?? '')
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time
}

/**
 * Merge entries by link, let incoming data replace archived data, and sort newest first.
 * @param {LibraryRow[]} archived
 * @param {LibraryRow[]} incoming
 */
export function mergeLibraryEntries(archived, incoming) {
  const entries = new Map()

  for (const entry of archived)
    entries.set(getEntryKey(entry), entry)
  for (const entry of incoming)
    entries.set(getEntryKey(entry), entry)

  return [...entries.values()].sort((a, b) => {
    const left = getEntryTime(a)
    const right = getEntryTime(b)
    return left === right ? 0 : right > left ? 1 : -1
  })
}

/**
 * Return the newest distinct entries across categories.
 * @param {LibraryRow[]} entries
 * @param {number} limit
 */
export function selectLatestLibraryEntries(entries, limit = 30) {
  return mergeLibraryEntries([], entries).slice(0, Math.max(0, limit))
}
