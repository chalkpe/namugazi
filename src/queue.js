module.exports = class Queue {
  constructor (data = []) {
    this.data = data
  }

  enqueue (item) {
    this.data.push(item)
  }

  dequeue () {
    return this.data.shift()
  }
}
