const fs = require('fs')

const dates = [
  /^\d+세기$/,
  /^\d+년$/,
  /^\d+월 \d+일$/
]

function save (list) {
  const path = process.env.RESULT_PATH || './result.txt'
  const data = list.concat('').join('\n') // newline at end

  return new Promise((resolve, reject) =>
    fs.writeFile(path, data, (err, res) => err ? reject(err) : resolve(res)))
}

async function find (db, visited, queue, logger) {
  const noDate = process.env.NO_DATE === '1'
  const { FIRST: first, LAST: last } = process.env

  const result = await db.collection('result')
  if (!(await result.findOne({ title: last }))) return { error: 'last not found' }
  if (!(await result.findOne({ links: last }))) return { error: 'last never referenced' }

  queue.enqueue({ title: first, path: [first] })
  while (true) {
    const item = queue.dequeue()
    if (!item) return { error: 'queue is empty' }

    visited.add(item.title)
    if (process.env.QUIET_DEQUEUE !== '1') logger.dequeue(item)

    const doc = await result.findOne({ title: item.title })
    if (!doc) continue

    const routes = doc.links.filter(title => {
      if (noDate && dates.some(regex => title.match(regex))) return false
      return !visited.has(title) // not yet visited
    })

    for (const title of routes) {
      const path = item.path.concat(title)

      queue.enqueue({ title, path })
      if (process.env.QUIET_ENQUEUE !== '1') logger.enqueue(item, title)

      if (title === last) {
        await save(path)
        return { error: null, result: path }
      }
    }

    if (process.env.QUIET_STATUS !== '1') logger.status(queue, visited)
  }
}

module.exports = find
