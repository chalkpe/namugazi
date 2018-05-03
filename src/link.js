module.exports = function link (last) {
  if (!last) return []
  if (last.path) return last.path

  const list = []
  while (true) {
    list.push(last.title)
    if (!(last = last.prev)) break
  }

  return list.reverse()
}
