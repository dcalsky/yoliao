import React from 'react'
import _ from 'lodash'

export default React.createClass({
  render() {
    console.log(this.props.cart.foods)
    return (
      <ul className="cart-list">
        {this.props.cart.foods.map((food, i) => {
          return (
            <li className="cart-food" key={i}>
              {food.id}
              <br />
              {food.count}
            </li>
          )
        })}
      </ul>
    )
  }
})