const database = require('./database')

const aggregate = (col, agg) => new Promise((resolve, reject) =>
  col.aggregate(agg, (err, res) => err ? reject(err) : resolve(res)))

async function surf (db) {
  const result = await db.collection('result')

  const stack = []
  let doc = (await aggregate(result, [{ $sample: { size: 1 } }]))[0]

  while (true) {
    stack.push(doc.title)

    const count = doc.links.length
    if (!count) return { stack, message: ['no links at', doc.title] }

    const nextDocs = await Promise.all(
      doc.links.map(title => result.findOne({ title })))

    const availableDocs = nextDocs.filter(x => x)
    const n = availableDocs.length

    if (!n) return { stack, message: ['not found', nextDocs.filter(x => !x)] }
    doc = availableDocs[Math.floor(Math.random() * n)]
  }
}

database().then(db => surf(db)
  .then(data => {
    data.stack.forEach(title => console.log(title))

    console.log()
    console.log(...data.message)
    console.log('length', data.stack.length)
    return db.close()
  })
  .then(() => console.log('closed'))
  .catch(console.error.bind(console)))
