const database = require('./database')

const aggregate = (col, agg) => new Promise((resolve, reject) =>
  col.aggregate(agg, (err, res) => err ? reject(err) : resolve(res)))

async function surf (db) {
  const result = await db.collection('result')

  const stack = []
  const visited = new Set()

  let doc = (await aggregate(result, [{ $sample: { size: 1 } }]))[0]

  while (true) {
    stack.push(doc.title)
    visited.add(doc.title)

    const links = doc.links.filter(link => !visited.has(link))
    if (!links.length) return { stack, message: '204' }

    const routes = links.map(title => result.findOne({ title }))
    const available = (await Promise.all(routes)).filter(x => x)
    const n = available.length

    if (!n) return { stack, message: '404' }
    doc = available[Math.floor(Math.random() * n)]
  }
}

database().then(db => surf(db)
  .then(data => {
    data.stack.forEach(title => console.log(title))

    console.log()
    console.log(data.message, 'size', data.stack.length)

    return db.close()
  })
  .then(() => console.log('closed'))
  .catch(console.error.bind(console)))
