import React, {Component} from 'react'
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';
import schema from './helpers/schema'

export default class StoryCreate extends Component {
  constructor(props){
    super(props)
    this.state = {
      summary: '',
      description: '',
      type: '',
      complexity: '',
      time: '',
      cost: '',
      error: ''
    }
    let urlId = new URL(window.location.href).searchParams.get('id');
    this.id = urlId
  }

  componentDidMount(){
    if(this.id){
      axios.get(`stories/${this.id}`).then((res) => {
        this.setState(res.data)
      })
    }
  }

  makeOptions = options => {
    return [
      {display: 'Select', value: ''},
      ...options
    ].map((elem, idx) => {
      return <option key={idx} value={elem.value}>{elem.display}</option>
    })
  }

  get typeOptions(){
    return this.makeOptions(schema.type)
  }

  get complexityOptions(){
    return this.makeOptions(schema.complexity)
  }

  acceptRejectStory = accepted => {
    axios.patch('stories', {
      accepted: accepted
    }).then(res => {
      document.getElementById('storyListLink').click()
    }).catch(e => {
      this.setState({error: e.message})
    })
  }

  get bottomButtons(){
    const {summary, description, type, complexity, time, cost} = this.state
    const {role} = this.props
    const reviewing = this.id && role.toLowerCase() === 'admin'

    if(reviewing){
      return (
        <>
          <Button variant="success" className={'acceptStory'} onClick={() => {this.acceptRejectStory(true)}}>Accept</Button>
          <Button variant="danger" className={'rejectStory'} onClick={() => {this.acceptRejectStory(false)}}>Reject</Button>
        </>)
    }
    return (<Button variant="primary" type="submit" className={'submitStory'} onClick={e => {
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
    }}>Submit</Button>)
  }

  render(){
    const {summary, description, type, complexity, time, cost, error} = this.state
    const {role} = this.props
    const reviewing = this.id && role.toLowerCase() === 'admin'
    return (
      <Card className='storyCreate'>
        <Card.Body>
          <Card.Title>Create a Story</Card.Title>
          <Form>
            <Form.Group controlId="summary">
              <Form.Label>Summary</Form.Label>
              <Form.Control disabled={reviewing} type="text" placeholder="Summary" value={summary} onChange={e => {
                this.setState({summary: e.target.value})
                e.target.style.backgroundColor = ''
              }}/>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control disabled={reviewing} as='textarea' placeholder="Decription" value={description} onChange={e => {
                this.setState({description: e.target.value})
                e.target.style.backgroundColor = ''
              }}/>
            </Form.Group>

            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control disabled={reviewing}  as='select' value={type} onChange={e => {
                this.setState({type: e.target.value})
                e.target.style.backgroundColor = ''
              }}>
                {this.typeOptions}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="complexity">
              <Form.Label>Complexity</Form.Label>
              <Form.Control disabled={reviewing} as='select' value={complexity} onChange={e => {
                this.setState({complexity: e.target.value})
                e.target.style.backgroundColor = ''
              }}>
                {this.complexityOptions}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="time">
              <Form.Label>Estimated time for completion</Form.Label>
              <Form.Control disabled={reviewing} type="text" placeholder='i.e. two days' value={time} onChange={e => {
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
                <Form.Control disabled={reviewing} type="number" value={cost} onChange={e => {
                  this.setState({cost: e.target.value})
                  e.target.style.backgroundColor = ''
                }}/>
              </InputGroup>
            </Form.Group>
            {error.length ? <Alert variant='danger'>{<>{error}</>}</Alert> : null}
            {this.bottomButtons}
          </Form>
        </Card.Body>
      </Card>
    )
  }
}
