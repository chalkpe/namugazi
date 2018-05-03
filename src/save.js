const fs = require('fs')

module.exports = function save (list) {
  const path = process.env.RESULT_PATH || './result.txt'
  const data = list.concat('').join('\n') // newline at end

  return new Promise((resolve, reject) =>
    fs.writeFile(path, data, (err, res) => err ? reject(err) : resolve(res)))
}
