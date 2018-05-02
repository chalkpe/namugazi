const { h, Component, Color } = require('ink')

class Logger extends Component {
	constructor() {
		super()
		this.state = {
			path: [],
      next: '',
      queueLength: 0,
      visitedLength: 0
		}
	}

	render (props, state) {
		return (
      <div>
        {state.path.join(' -> ')}
        {state.next ? ' ~~> ' + state.next : ''}
        <br />

        <Color green>
          queue: {state.queueLength}
          visited: {state.visitedLength}
        </Color>
      </div>
    )
	}

  enqueue (item, child) {
    this.setState({
      path: item.path,
      next: child
    })
  }

  dequeue (item) {
    this.setState({
      path: item.path,
      next: ''
    })
  }

  status (queue, visited) {
    this.setState({
      queueLength: queue.length,
      visitedLength: visited.size
    })
  }

}

module.exports = () => <Logger />
