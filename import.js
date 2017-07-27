const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017/namu'

/* eslint-disable no-useless-escape */
const link = /\[\[([^\[\]]+?)(?:\|(.+?))?\]\]/g

function parse (text) {
  if (text.toLowerCase().startsWith('#redirect') || text.startsWith('#넘겨주기')) {
    return text.substring(text.indexOf(' ') + 1).trim()
  }

  const links = []
  text.replace(link, (match, href, value) => {
    if (href.startsWith('http://') || href.startsWith('https://')) return
    const index = href.indexOf('#')

    if (index < 0) links.push(href)
    else href.substring(0, index)
  })

  return [...new Set(links)].sort()
}

function each (cursor, iterator) {
  return new Promise((resolve, reject) =>
    cursor.forEach(iterator, err => err ? reject(err) : resolve()))
}

async function main () {
  const db = await MongoClient.connect(url)
  console.log('connected')

  const wiki = await db.collection('wiki')
  const result = await db.collection('result')

  await result.deleteMany({})
  console.log('delete results')

  await result.createIndex({ title: 1 }, { unique: true })
  console.log('created index')

  const cursor = wiki
    .find({ namespace: '0' })
    .project({ title: 1, text: 1 })

  const iterator = ({ title, text }) => {
    console.log('starts', title)

    result
      .insertOne({ title, links: parse(text) })
      .then(() => console.log('finish', title))
      .catch(err => console.error(err))
  }

  await each(cursor, iterator)
  await db.close()
}

console.log('please enter following command before start this script')
console.log('you can find namuwiki database on [[나무위키:데이터베이스 덤프]] document')
console.log('$ mongoimport --db namu --collection wiki --type json --drop --jsonArray --file namuwiki_20170327.json')

main()
  .then(result => console.log(result))
  .catch(y => console.error(y))
