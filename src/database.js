const { MongoClient } = require('mongodb')
const URL = 'mongodb://localhost:27017/namu'

module.exports = (url = URL) => MongoClient.connect(url)
