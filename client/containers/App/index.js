import React, { Component } from 'react'

export class App extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}