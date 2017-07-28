module.exports = class Queue {
  constructor (data = []) {
    this.inbox = data
    this.outbox = []
  }

  enqueue (item) {
    this.inbox.push(item)
  }

  dequeue () {
    if (this.outbox.length === 0) {
      this.outbox = this.inbox.reverse()
      this.inbox = []
    }

    return this.outbox.pop()
  }

  get length () {
    return this.inbox.length + this.outbox.length
  }
}
