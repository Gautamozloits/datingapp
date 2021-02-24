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


class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      oldPassword:'',
      newPassword:'',
      confirmPassword:''

    };
    this.handleOnChange = this.handleOnChange.bind(this);
    
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this, 
      className: 'text-danger',
      validators: {
        confirm: {
          message: 'The :attribute must be same as new password.',
          rule: function(val, params, validator) {
            console.log(val,': ', params[0])
            return val == params[0]
          }
        }
      }
    });
  }

  componentDidMount = async () => {

  }
  
  handleOnChange(event) {
    this.setState({ [event.target.name]: event.target.value });  
  }

  submitForm = async () => {
    
    if (this.validator.allValid()) {
      let data = { old_password: this.state.oldPassword, new_password: this.state.newPassword ,user_id:JSON.parse(localStorage.getItem('user_detail')).id};
      let res = await postData('change-password', data);
      if (res.success) {
        toast.success(res.message);
        this.props.history.push('/dashboard')
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
                  <strong>Change Password</strong>
                </CardHeader>
                <CardBody>
                  <div className="form-group">
                    <label>Old Password</label>
                    <input className="form-control" type="password" value={this.state.oldPassword} onChange={this.handleOnChange} name="oldPassword" placeholder="Enter old password"/>
                    {this.validator.message('oldPassword', this.state.oldPassword, 'required|min:6')}

                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input className="form-control" type="password" value={this.state.newPassword} onChange={this.handleOnChange} name="newPassword" placeholder="Enter new password"/>
                    {this.validator.message('newPassword', this.state.newPassword, 'required|min:6')}

                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input className="form-control" type="password" value={this.state.confirmPassword} onChange={this.handleOnChange} name="confirmPassword" placeholder="Enter confirm password"/>
                    {this.validator.message('confirmPassword', this.state.confirmPassword, `required|min:6|confirm:${this.state.newPassword}`)}

                  </div>
                  <button className="btn btn-primary" onClick={this.submitForm}>Change Password</button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ChangePassword;
