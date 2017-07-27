const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017/namu'

module.exports = () => MongoClient.connect(url)
