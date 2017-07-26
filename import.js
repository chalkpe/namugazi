const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017/namu'

/* eslint-disable no-useless-escape */
const link = /\[\[([^\[\]]+?)(?:\|(.+?))?\]\]/g

function parse (text) {
  const links = []

  text.replace(link, (match, href, value) => {
    if (href.startsWith('http://') || href.startsWith('https://')) return
    const index = href.indexOf('#')

    if (index < 0) links.push(href)
    else href.substring(0, index)
  })

  return [...new Set(links)].sort()
}

async function main () {
  const db = await MongoClient.connect(url)

  const wiki = await db.collection('wiki')
  const result = await db.collection('result')

  const one = 1024
  const max = await wiki.count()

  console.log()
  console.log('size     ', max)
  await new Promise((resolve, reject) => setTimeout(resolve, 5000))

  for (let i = 0; i < max; i += one) await run(wiki, result, i, one)

  await db.close()
  console.log('done')
}

async function run (wiki, result, skip, limit) {
  console.log('running  ', skip)

  const docs = await wiki
    .find({})
    .skip(skip)
    .limit(limit)
    .project({ title: 1, text: 1 })
    .toArray()

  console.log('inserting', skip)

  const res = docs.map(doc => ({
    title: doc.title, links: parse(doc.text)
  }))

  await result.insertMany(res)
  console.log('finished ', skip, res.length)
}

console.log('please enter following command before start this script')
console.log('you can find namuwiki database on [[나무위키:데이터베이스 덤프]] document')
console.log('$ mongoimport --db namu --collection wiki --type json --drop --jsonArray --file namuwiki_20170327.json')

main()
  .then(result => console.log(result))
  .catch(y => console.error(y))
