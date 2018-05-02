module.exports = {
  enqueue: (item, child) =>
    (process.env.QUIET_ENQUEUE !== '1')
    && console.log('enqueue', item.title, '->', child),

  dequeue: item =>
    (process.env.QUIET_DEQUEUE !== '1')
    && console.log('dequeue', item.title),

  status: (queue, visited) =>
    (process.env.QUIET_STATUS !== '1')
    && console.log('status: queue', queue.length, 'visited', visited.size)
}
