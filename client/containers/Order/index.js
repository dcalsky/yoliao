import React, { Component } from 'react'
import moment from 'moment'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createOrder } from '../../Api/order'
import { getFloors } from '../../Api/floor'
import { getCurrentUser } from '../../Api/user'
import CartList from '../../components/CartList'
import DatePicker from 'react-datepicker'
import style from './style.styl'
import alipayImage from '../../images/alipay.png'
import './react-datepicker.css'

const finalTime = 22 // We send final orders to vendor before 22:00

class Order extends Component {
  constructor(props) {
    super(props)
    const { user, cart } = this.props
    if(!getCurrentUser()) hashHistory.push('/login') // if not login, back to login page
    if(Object.keys(cart.foods).length === 0) hashHistory.push('/') // if none food in cart, back to index page
    this.minStartDay = moment().hour() < finalTime ? 1 : 2  // If this moment late than 22:00, order is pull off to tomorrow
    this.state = {
      startDate: moment().add(this.minStartDay, 'days'),
      endDate: moment().add(this.minStartDay, 'days'),
      days: 1,
      room: user.room,
      floor: user.floor || '西南一',
      mobilePhoneNumber: user.mobilePhoneNumber,
      name: user.name,
      floors: []
    }
    getFloors().then(result => {
      const floors = result.map(floor => {
        return floor.get('name')
      })
      this.setState({
        floors: floors
      })
    })
  }
  handleBack() {
    hashHistory.push('/')
  }
  handleCreateOrder() {
    const { cart } = this.props
    createOrder(cart.total, cart.foods, this.state.startDate, this.state.endDate,  this.state.floor, this.state.room, this.state.name, this.state.mobilePhoneNumber)
      .then(result => {
        console.log(result)
      })
  }
  handleDateChange({ startDate, endDate }) {
    startDate = startDate || this.state.startDate
    endDate = endDate || this.state.endDate
    if (startDate.isAfter(endDate)) {
      let temp = startDate
      startDate = endDate
      endDate = temp
    }
    let days = endDate.diff(startDate, 'days') + 1
    this.setState({ days, startDate, endDate })
  }

  handleChangeStart(startDate) {
    this.handleDateChange({ startDate })
  }

  handleChangeEnd(endDate) {
    this.handleDateChange({ endDate })
  }
  handleChangeInput(type, e) {
    const value = e.target.value
    switch (type) {
      case 'name':
        this.setState({name: value})
        break
      case 'mobilePhoneNumber':
        this.setState({mobilePhoneNumber: value})
        break
      case 'floor':
        this.setState({floor: value})
        break
      case 'room':
        this.setState({room: value})
        break
    }
  }
  skipPayment() {
    hashHistory.push('/payment')
  }
  render() {
    const { cart } = this.props
    return (
      <div className="order">
        <ul className="order-address">
          <li className="order-address-item">
            <span>寝室楼</span>
            <select value={this.state.floor} onChange={this.handleChangeInput.bind(this, 'floor')}>
              {
                this.state.floors.map((floor, i) => {
                  return (
                    <option key={`option-${i}`} value={floor}>{floor}</option>
                  )
                })
              }
            </select>
          </li>
          <li className="room">
            <span>房间号</span>
            <input type="text" placeholder="房间号" onChange={this.handleChangeInput.bind(this, 'room')}/>
          </li>
        </ul>

        <ul className="order-user">
          <li className="order-user-item">
            <span>真实姓名</span>
            <input type="text" placeholder="姓名" value={this.state.name} onChange={this.handleChangeInput.bind(this, 'name')}/>
          </li>
          <li className="room">
            <span>联系方式</span>
            <input type="text" placeholder="手机号码" value={this.state.mobilePhoneNumber} onChange={this.handleChangeInput.bind(this, 'mobilePhoneNumber')}/>
          </li>
        </ul>

        <ul className="order-date">
        <li className="order-date-item">
          <span>起送时间</span>
          <DatePicker
            className="order-start-date"
            selected={this.state.startDate}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            minDate={moment().add(this.minStartDay, 'days')}
            onChange={::this.handleChangeStart}
            popoverAttachment='top center'
            popoverTargetAttachment='bottom center'
            popoverTargetOffset='0px -80px' />
        </li>
          <li className="order-date-item">
            <span>结束时间</span>
            <DatePicker
              className="order-end-date"
              selected={this.state.endDate}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              minDate={moment().add(this.minStartDay, 'days')}
              onChange={::this.handleChangeEnd}
              popoverAttachment='top center'
              popoverTargetAttachment='bottom center'
              popoverTargetOffset='0px -80px'/>
          </li>
      </ul>

        <ul className="order-pay">
          <li className="order-coupon-item">
            <span>优惠券</span>
            <select value="优惠券选择" >
              <option value="优惠券1">优惠1</option>
            </select>
          </li>
          <li className="order-pay-item">
            <span>支付方式</span>
            <img src={alipayImage} alt="alipay icon"/>
          </li>
        </ul>

        <ul className="order-amount">
          {this.props.cart.foods.map((food, i) => {
            return (
              <li className="order-cart-item" key={`cart-${i}`}>
                <span>{food.name}</span>
                <span style={{float: 'right'}}>{food.count} 份</span>
              </li>
            )
          })}
          <li className="order-amount-days">
            <span>送餐天数</span>
            <span style={{float: 'right'}}>{this.state.days} 天</span>
          </li>
          <li className="order-amount-days">
            <span>共计</span>
            <span style={{float: 'right'}}>{this.state.days * this.props.cart.total}元</span>
          </li>
        </ul>
        <div className="pay">
          <button onClick={::this.handleCreateOrder}>确认下单</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    cart: state.get('cart').toJS(),
    user: state.get('user').toJS()
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Order)
