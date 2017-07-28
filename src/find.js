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

    console.log('dequeue', item.title)
    visited.add(item.title)

    if (process.env.DEQUEUE === '1' && item.title === last) {
      console.log('found')
      return save(item.path)
    }

    const doc = await result.findOne({ title: item.title })
    if (!doc) continue

    const routes = doc.links.filter(title => {
      if (process.env.NO_DATE === '1' &&
        dates.some(regex => title.match(regex))) return false

      return !visited.has(title) // not yet visited
    })

    for (const title of routes) {
      const path = item.path.concat(title)

      if (process.env.DEQUEUE !== '1' && title === last) {
        console.log('found')
        return save(path)
      }

      queue.enqueue({ title, path })
      if (process.env.QUIET_ENQUEUE !== '1') console.log('enqueue', title)
    }

    console.log('queue', queue.data.length, 'set', visited.size)
    console.log('------------------------------------------------')
  }
}

async function main () {
  const db = await database()

  await find(db)
  await db.close()
}

main()
  .then(() => console.log('done'))
  .catch(err => console.error(err))
