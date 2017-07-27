const fs = require('fs')
const database = require('./database')
const Queue = require('./queue')

async function main (db) {
  const result = await db.collection('result')

  const first = process.env.FIRST
  const last = process.env.LAST

  const queue = new Queue([{ title: first, path: [first] }])
  const visitedTitles = new Set()

  while (true) {
    const item = queue.dequeue()
    if (!item) return console.log('empty')

    console.log('dequeue', item.title)
    visitedTitles.add(item.title)

    const doc = await result.findOne({ title: item.title })
    if (!doc) continue

    const list = doc.links.filter(title => !visitedTitles.has(title))
    for (let i = 0; i < list.length; i++) {
      const next = {
        title: list[i],
        path: item.path.slice().concat(list[i])
      }

      if (next.title === last) {
        console.log('found')
        return fs.writeFileSync('result.txt', next.path.concat('').join('\n'))
      }

      queue.enqueue(next)
      console.log('enqueue', next.title)
    }

    console.log('queue', queue.data.length, 'set', visitedTitles.size)
    console.log('------------------------------------------------')
  }
}

database()
  .then(async db => {
    await main(db)
    await db.close()
  })
  .then(x => console.log('finished'))
  .catch(e => console.error(e))
