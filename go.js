const database = require('./database')

const aggregate = (col, agg) => new Promise((resolve, reject) =>
  col.aggregate(agg, (err, res) => err ? reject(err) : resolve(res)))

async function go () {
  const db = await database()
  const result = await db.collection('result')

  const stack = []
  let doc = (await aggregate(result, [{ $sample: { size: 1 } }]))[0]

  while (true) {
    if (!doc) break

    stack.push(doc.title)
    if (!doc.links.length) break

    const next = Math.floor(Math.random() * doc.links.length)
    doc = await result.findOne({ title: doc.links[next] })
  }

  return stack
}

Promise.all([...Array(100)].map(() => go()))
  .then(data => data.reduce((a, b) => a.length < b.length ? b : a))
  .then(x => console.log(x.length, x))
  .catch(console.error.bind(console))
