import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader, FormGroup, Label, FormText, CardFooter } from 'reactstrap';
import SimpleReactValidator from "simple-react-validator";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postData } from '../../services/service';
//import Cookies from 'universal-cookie';
//const cookies = new Cookies();
const formData = {};


class EditTips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tips:'',

    };
    this.handleOnChange = this.handleOnChange.bind(this);
    
    this.validator = new SimpleReactValidator();
  }

  
  componentDidMount = async () => {
    this.getEvent();
  }
  
  handleOnChange(event) {
    this.setState({ [event.target.name]: event.target.value });  
  }

  submitForm = async () => {
    
    if (this.validator.allValid()) {
      let data = { id:this.props.match.params.id,tips: this.state.tips};
      let res = await postData('edit-tips', data);
      if (res.success) {
        toast.success(res.message);
        this.props.history.push('/tips')
      } else {
        toast.error(res.message);
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  getEvent() {

    let userdetail = {};
    userdetail.id = this.props.match.params.id;
    this.setState({ loading: true });
    // let data = {limit: 10 };

    postData('tips-detail', userdetail).then((res) => { 
      if (res.success) {      
        this.setState({
          loading: false,
          'tips': res.data.tips,
        });
      } else {
        
        toast.error(res.message);
      }
    });
  }

  render() {
    return (
      <div className="app flex-row">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card>
                <CardHeader>
                  <strong>Edit Tips</strong>
                </CardHeader>
                <CardBody>
                  <div className="form-group">
                    <label>Tips</label>
                    <textarea className="form-control"  value={this.state.tips} onChange={this.handleOnChange} name="tips" placeholder="Enter Tips"/>
                    <span style={{color:'#F65F53'}}>{this.validator.message('tips', this.state.tips, 'required')}</span>

                  </div>
                  <button className="btn btn-primary" onClick={this.submitForm}>Submit</button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default EditTips;
