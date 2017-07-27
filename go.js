const database = require('./database')

const aggregate = (col, agg) => new Promise((resolve, reject) =>
  col.aggregate(agg, (err, res) => err ? reject(err) : resolve(res)))

async function go () {
  const db = await database()
  const result = await db.collection('result')

  const stack = []
  let doc = (await aggregate(result, [{ $sample: { size: 1 } }]))[0]

  while (true) {
    stack.push(doc.title)
    const count = doc.links.length

    if (!count) {
      console.log('no links', doc.title)
      break
    }

    const index = Math.floor(Math.random() * count)
    const title = doc.links[index]
    const next = await result.findOne({ title })

    if (!next) {
      console.log('404', title)
      break
    }

    doc = next
  }

  return stack
}

// Promise.all([...Array(100)].map(() => go()))
//   .then(data => data.reduce((a, b) => a.length < b.length ? b : a))

go()
  .then(x => console.log(x.length, x))
  .catch(console.error.bind(console))
