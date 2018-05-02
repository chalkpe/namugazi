require('dotenv').config()

const { h, render, Component, Color } = require('ink')
const Box = require('ink-box')

const find = require('./find')
const Queue = require('./queue')
const database = require('./database')

class Namugazi extends Component {
  constructor (...args) {
    super(...args)

    this.state = {
      visited: new Set(),
      queue: new Queue(),

      path: [],
      next: '',

      error: '',
      result: []
    }
  }

  render (props, state) {
    const status = (
      <Color cyan>
        queue: {state.queue.length || 'unknown'}
        {'\t'}
        visited: {state.visited.size || 'unknown'}
      </Color>
    )

    const path = state.result.length ? (
      <Box borderStyle="round" borderColor="green" padding={1}>
        {state.result.join('\n-> ')}
      </Box>
    ) : state.path.length ? (
      <Box borderStyle="round" padding={1}>
        {state.path.join('\n-> ')}
        {state.next ? `\n~~> ${state.next}` : ''}
      </Box>
    ) : (
      <div>
        <Box borderStyle="round" padding={1}>
          Calculating...
        </Box>
      </div>
    )

    return (
      <div>
        {status}
        <br />
        {path}
        {state.error && (
          <Color red>
            <br />
            {state.error}
          </Color>
        )}
      </div>
    )
  }

  componentDidMount () {
    const { db } = this.props
    const { visited, queue } = this.state

    const logger = {
      dequeue: item => this.setState({ path: item.path }),
      enqueue: (item, next) => this.setState({ path: item.path, next }),
      status: (queue, visited) => this.setState({ queue, visited })
    }

    find(db, visited, queue, logger)
      .then(res => this.setState(res))
      .catch(err => this.setState({ error: err.message }))
      .then(() => setTimeout(() => process.exit(0), 1000))
  }
}

database().then(db => render(<Namugazi db={db} />))
