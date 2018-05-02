module.exports = {
  enqueue: (item, child) =>
    console.log('enqueue', item.title, '->', child),

  dequeue: item =>
    console.log('dequeue', item.title),

  status: (queue, visited) =>
    console.log('status: queue', queue.length, 'visited', visited.size)
}
