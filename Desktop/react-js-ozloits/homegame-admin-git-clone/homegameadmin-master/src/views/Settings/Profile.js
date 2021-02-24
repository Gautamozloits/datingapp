import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, CardHeader, FormGroup, Label, FormText, CardFooter } from 'reactstrap';
import SimpleReactValidator from "simple-react-validator";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postData, getUser } from '../../services/service';
import { setUserSession} from '../../services/authService';
//import Cookies from 'universal-cookie';
//const cookies = new Cookies();
const formData = {};


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      username: '',
      email:'',
      contact_number: ''
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this, 
      className: 'text-danger'
    });
  }

  componentDidMount = async () => {
    let user = await getUser();
    console.log(user)
    this.setState({
      username: user.username,
      email: user.email,
      contact_number: user.contact_number
    })
  }
  handleOnChange(event) {
    this.setState({ [event.target.name]: event.target.value });  
  }


  submitForm = async () => {
    if (this.validator.allValid()) {
      let data = { username: this.state.username, email: this.state.email, contact_number: this.state.contact_number ,user_id:JSON.parse(localStorage.getItem('user_detail')).id};
      let res = await postData('update-profile', data);
      if (res.success) {
        await setUserSession(res.result)
        toast.success(res.message);
        //this.props.history.push('/dashboard')
      } else {
        toast.error(res.message);
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  render() {
    return (
      <div className="app flex-row">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card>
                <CardHeader>
                  <strong>Update Profile</strong>
                </CardHeader>
                <CardBody>
                  <div className="form-group">
                    <label>Username</label>
                    <input className="form-control" type="text" value={this.state.username} onChange={this.handleOnChange} name="username" placeholder="Enter username"/>
                    {this.validator.message('username', this.state.username, 'required')}
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input className="form-control" type="email" value={this.state.email} onChange={this.handleOnChange} name="email" placeholder="Enter email address"/>
                    {this.validator.message('email', this.state.email, 'required')}
                  </div>

                  <div className="form-group">
                    <label>Contact Number</label>
                    <input className="form-control" type="text" value={this.state.contact_number} onChange={this.handleOnChange} name="contact_number" placeholder="Enter contact number"/>
                    {this.validator.message('contact_number', this.state.contact_number, 'required')}
                  </div>

                  <button className="btn btn-primary" onClick={this.submitForm}>Update</button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Profile;
