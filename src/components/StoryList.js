import React, {Component} from 'react'
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import schema from './helpers/schema'

export default class StoryList extends Component {
  state = {
    list: [],
    by: 'id',
    reversed: false,
    type: ''
  }

  makeOptions = options => {
    return [
      {display: 'None', value: ''},
      ...options
    ].map((elem, idx) => {
      return <option key={idx} value={elem.value}>{elem.display}</option>
    })
  }

  get typeOptions(){
    return this.makeOptions(schema.type)
  }

  headers = [
    {display: 'ID', value: 'id'},
    {display: 'Summary', value: 'summary'},
    {display: 'Description', value: 'description'},
    {display: 'Type', value: 'type'},
    {display: 'Complexity', value: 'complexity'},
    {display: 'Esitmated time for completion', value: 'estimatedHrs'},
    {display: 'Cost', value: 'cost'}
  ]

  componentDidMount(){
    axios.get('stories').then(res => {
      this.setState({list: res.data})
    })
  }

  get tableHead(){
    let {by} = this.state
    let ths = this.headers.map((header) => {
      return <th key={header.value} className={header.value === by ? 'sortingHeader' : ''} onClick={() => {
        this.setState({
          by: header.value,
          reversed: header.value === by && !this.state.reversed
        })
      }}>{header.display}</th>
    })
    return <thead><tr>{ths}</tr></thead>
  }

  get tableBody(){
    const {by, reversed, type} = this.state
    let orderedList = JSON.parse(JSON.stringify(this.state.list))
    orderedList.sort((a, b) => {
      if(by === 'cost' || by === 'id' || by === 'estimatedHrs') return Number(a[by]) - Number(b[by])
      else {
        a = a[by].toUpperCase()
        b = b[by].toUpperCase()
        return a < b ? -1 : a > b ? 1 : 0
      }
    })
    if(reversed) orderedList.reverse() //This could be optimized by reversing in the sort function.
    let trs = orderedList.map((elem, idx) => {
      if(elem.type === type || !type){
        return (
          <tr>
            {this.headers.map(header => {
              return <td key={header.value}>{elem[header.value]}</td>
            })}
          </tr>
        )
      } else {
        return null
      }
    })
    return <tbody>{trs}</tbody>
  }

  render(){
    let {type} = this.state
    return (
      <>
        <Card className='storyList'>
          <Card.Body>
            <Card.Title>Current Stories</Card.Title>
            <Form.Group controlId="type">
              <Form.Label>Filter Type</Form.Label>
              <Form.Control as='select' value={type} onChange={e => {
                this.setState({type: e.target.value})
                e.target.style.backgroundColor = ''
              }}>
                {this.typeOptions}
              </Form.Control>
            </Form.Group>
            <div className={'cardTableContainer'}>
              <Table>
                {this.tableHead}
                {this.tableBody}
              </Table>
            </div>
          </Card.Body>
        </Card>
      </>
    )
  }
}
