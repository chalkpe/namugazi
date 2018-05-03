const dates = [
  /^\d+세기$/,
  /^\d+년$/,
  /^\d+월 \d+일$/
]

const isBanned = title =>
  process.env.NO_DATE === '1'
  && dates.some(regex => title.match(regex))

module.exports = async function find (db, visited, queue, logger) {
  const { FIRST, LAST, QUIET_ENQUEUE, QUIET_DEQUEUE, QUIET_STATUS } = process.env

  const printStatus = QUIET_STATUS !== '1'
  const printEnqueue = QUIET_ENQUEUE !== '1'
  const printDequeue = QUIET_DEQUEUE !== '1'

  const useLink = !printEnqueue && !printDequeue

  const col = await db.collection('result')
  if (!(await col.findOne({ title: LAST }))) return { error: 'last not found' }
  if (!(await col.findOne({ links: LAST }))) return { error: 'last never referenced' }

  visited.add(FIRST)
  if (useLink) queue.enqueue({ title: FIRST, prev: null })
  else queue.enqueue({ title: FIRST, path: [FIRST] })

  while (true) {
    const item = queue.dequeue()
    if (!item) return { error: 'queue is empty' }
    if (printDequeue) logger.dequeue(item)

    const doc = await col.findOne({ title: item.title })
    if (!doc) continue // referenced invalid doc (broken link)

    for (const title of doc.links) {
      if (isBanned(title)) continue
      if (visited.has(title)) continue

      const next = useLink
        ? { title, prev: item }
        : { title, path: item.path.concat(title) }

      if (title === LAST) return { error: null, result: next }

      queue.enqueue(next)
      visited.add(title)
      if (printEnqueue) logger.enqueue(next)
    }

    if (printStatus) logger.status(queue, visited)
  }

  return { error: 'not found' }
}
