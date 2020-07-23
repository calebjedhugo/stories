import React, {Component} from 'react'
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';

export default class StoryCreate extends Component {
  state = {
    summary: '',
    description: '',
    type: '',
    complexity: '',
    time: '',
    cost: '',
    error: ''
  }

  makeOptions = options => {
    return options.map((elem, idx) => {
      return <option key={idx} value={elem.value}>{elem.display}</option>
    })
  }

  get typeOptions(){
    return this.makeOptions(
      [
        {display: 'Select', value: ''},
        {display: 'Enhancement', value: 'enhancement'},
        {display: 'Bug Fix', value: 'bugfix'},
        {display: 'Development', value: 'development'},
        {display: 'QA', value: 'qa'}
      ]
    )
  }

  get complexityOptions(){
    return this.makeOptions(
      [
        {display: 'Select', value: ''},
        {display: 'Low', value: 'low'},
        {display: 'Mid', value: 'mid'},
        {display: 'High', value: 'high'},
      ]
    )
  }

  render(){
    const {summary, description, type, complexity, time, cost, error} = this.state
    return (
      <Card className='loginForm'>
        <Card.Body>
          <Card.Title>Create a Story</Card.Title>
          <Form>
            <Form.Group controlId="summary">
              <Form.Label>Summary</Form.Label>
              <Form.Control type="text" placeholder="Summary" value={summary} onChange={e => {
                this.setState({summary: e.target.value})
                e.target.style.backgroundColor = ''
              }}/>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as='textarea' placeholder="Decription" value={description} onChange={e => {
                this.setState({description: e.target.value})
                e.target.style.backgroundColor = ''
              }}/>
            </Form.Group>

            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control as='select' value={type} onChange={e => {
                this.setState({type: e.target.value})
                e.target.style.backgroundColor = ''
              }}>
                {this.typeOptions}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="complexity">
              <Form.Label>Complexity</Form.Label>
              <Form.Control as='select' value={complexity} onChange={e => {
                this.setState({complexity: e.target.value})
                e.target.style.backgroundColor = ''
              }}>
                {this.complexityOptions}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="time">
              <Form.Label>Estimated time for completion</Form.Label>
              <Form.Control type="text" placeholder='i.e. two days' value={time} onChange={e => {
                this.setState({time: e.target.value})
                e.target.style.backgroundColor = ''
              }}/>
            </Form.Group>
            <Form.Group controlId="cost">
              <Form.Label>Associated Cost</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="number" value={cost} onChange={e => {
                  this.setState({cost: e.target.value})
                  e.target.style.backgroundColor = ''
                }}/>
              </InputGroup>
            </Form.Group>
            {error.length ? <Alert variant='danger'>{<>{error}</>}</Alert> : null}
            <Button variant="primary" type="submit" className={'submitStory'} onClick={e => {
              e.preventDefault()//No refresh, please.
              let newError = []
              let required = ['summary', 'description', 'type', 'complexity', /*'time', 'cost'*/]
              required.forEach(elem => {
                if(!this.state[elem]){
                  newError.push(<p key={elem}>{`${elem} is required.`}</p>)
                  document.getElementById(elem).style.backgroundColor = 'yellow'
                }
              })
              if(newError.length){
                return this.setState({error: newError})
              }
              let reqObj = {
                summary: summary,
                description: description,
                type: type,
                complexity: complexity,
                time: time,
                estimatedHrs: cost
              }
              console.log(reqObj)
              axios.post('stories', reqObj).then(res => {
                console.log(res.data)
                // const {id, createdBy, summary, description, type, cost, complexity, estimatedHrs, time} = res.data
                this.setState({error: ''})
                document.getElementById('storyListLink').click()
              }).catch(e => {
                console.error(e)
                this.setState({error: e.message})
              })
            }}>Submit</Button>
          </Form>
        </Card.Body>
      </Card>
    )
  }
}
