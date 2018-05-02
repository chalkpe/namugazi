require('dotenv').config()

const fs = require('fs')
const database = require('./database')
const Queue = require('./queue')

const dates = [
  /^\d+세기$/,
  /^\d+년$/,
  /^\d+월 \d+일$/
]

function save (list) {
  const path = process.env.RESULT_PATH || './result.txt'
  const data = list.concat('').join('\n')

  console.log()
  list.forEach(title => console.log(title))
  console.log()

  return new Promise((resolve, reject) =>
    fs.writeFile(path, data, (err, res) => err ? reject(err) : resolve(res)))
}

async function find (db) {
  const result = await db.collection('result')
  const { FIRST: first, LAST: last } = process.env

  const theLast = await result.findOne({ title: last })
  if (!theLast) return console.log('last not found')

  const xref = await result.findOne({ links: last })
  if (!xref) return console.log('last never referenced')

  const visited = new Set()
  const queue = new Queue([{
    title: first, path: [first]
  }])

  while (true) {
    const item = queue.dequeue()
    if (!item) return console.log('empty')

    visited.add(item.title)
    if (process.env.QUIET_DEQUEUE !== '1') console.log('dequeue', item.title)

    const doc = await result.findOne({ title: item.title })
    if (!doc) continue

    const routes = doc.links.filter(title => {
      if (process.env.NO_DATE === '1' &&
        dates.some(regex => title.match(regex))) return false

      return !visited.has(title) // not yet visited
    })

    for (const title of routes) {
      const path = item.path.concat(title)

      queue.enqueue({ title, path })
      if (process.env.QUIET_ENQUEUE !== '1') console.log('enqueue', item.title, '->', title)

      if (title === last) {
        console.log('found', last)
        return save(path)
      }
    }

    if (process.env.QUIET_STATUS !== '1') {
      console.log('status: queue', queue.length, 'visited', visited.size)
      console.log('------------------------------------------------')
    }
  }
}

async function main () {
  const start = new Date()
  const db = await database()

  await find(db)
  await db.close()

  console.log('time', new Date() - start)
}

main()
  .then(() => console.log('done'))
  .catch(err => console.error(err))
