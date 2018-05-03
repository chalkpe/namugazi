require('dotenv').config()

const { h, render, Component, Color } = require('ink')
const Box = require('ink-box')

const find = require('./find')
const link = require('./link')
const Queue = require('./queue')
const database = require('./database')

class Namugazi extends Component {
  constructor (...args) {
    super(...args)

    this.state = {
      visited: new Set(),
      queue: new Queue(),

      error: '',
      item: null,
      result: null
    }
  }

  render (props, state) {
    const status = (
      <Color cyan>
        Queue size: {state.queue.length || 'unknown'}
        <br />
        Visited nodes: {state.visited.size || 'unknown'}
      </Color>
    )

    const colour = state.result ? 'green' : 'white'
    const content = link(state.result || state.item).join('\n-> ') || 'Searching...'

    const path = [
      <br />,
      <Box padding={1} borderStyle="round" borderColor={colour}>{content}</Box>
    ]

    const error = state.error && (
      <Color red>
        <br />
        {state.error}
      </Color>
    )

    return (
      <div>
        {[status, path, error]}
      </div>
    )
  }

  componentDidMount () {
    const { db } = this.props
    const { visited, queue } = this.state

    const logger = {
      enqueue: item => this.setState({ item }),
      dequeue: item => this.setState({ item }),
      status: (queue, visited) => this.setState({ queue, visited })
    }

    find(db, visited, queue, logger)
      .then(res => this.setState(res))
      .catch(err => this.setState({ error: err.message }))
      .then(() => setTimeout(() => process.exit(0), 1000))
  }
}

database().then(db => render(<Namugazi db={db} />))
