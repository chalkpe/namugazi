module.exports = class Queue {
  constructor (params) {
    this.data = params
  }

  enqueue (item) {
    this.data.push(item)
  }

  dequeue () {
    return this.data.shift()
  }
}
