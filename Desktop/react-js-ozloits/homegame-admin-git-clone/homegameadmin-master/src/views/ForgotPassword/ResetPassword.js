import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postData, setUserSession, isLoggedIn } from '../../services/authService';
import SimpleReactValidator from 'simple-react-validator';
//import Cookies from 'universal-cookie';
//const cookies = new Cookies();


const formData = {};

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm_password:'',
      password: '',
      loading: false,
      is_login:false,
    };
  
    this.handleOnChange = this.handleOnChange.bind(this);
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this, 
      className: 'text-danger',
      validators: {
        confirm: {
          message: 'The :attribute must be same as new password.',
          rule: function(val, params, validator) {
            return val == params[0]
          }
        }
      }
    });
  }

  componentDidMount = async () => {   

    if (isLoggedIn()) {
      this.props.history.push('/dashboard')
    }
  }

  handleOnChange=(e) =>{
    var obj = {};
		obj[e.target.name] = e.target.value;
		this.setState({ field: e.target.files });
		this.setState(obj);
  }

  contactSubmit(e) {	
    console.log(this.props.match.params.hash_code);

		e.preventDefault();
    if (this.validator.allValid()) {
    let data = {newpassword: this.state.password,hash_code:this.props.match.params.hash_code};
    postData('reset-password', data).then((res) => {
    if (res.success) {
      toast.success(res.message);
      this.props.history.push('/login')  ; 
      } else {
        this.setState({confirm_password:""});
        this.setState({password:""});
        toast.error(res.message);
      }
    });
   } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
	notifysucess(msg, status) {
		toast.success(msg, {
			position: "bottom-center",
			autoClose: 1000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true
		});   
	}
	notify(msg, status) {
		toast.error(msg, {
			position: "bottom-center",
			autoClose: 1000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true
		});

	}
  
  render() {    
    return (
      <div className="app flex-row align-items-center">         
        <Container>
          <Row className="justify-content-center">
            <Col md="4">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h4>Reset Password</h4>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mt-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input ref="password" name="password" onChange={this.handleOnChange} type="password" placeholder="New Password" autoComplete="off" value={this.state.password}/>
                      </InputGroup>
                      <div className="validate" style={{ 'color': '#bf5d5d' }}>
                      {this.validator.message('Password', this.state.password, 'required|min:6')}
                        </div>
                      <InputGroup className="mt-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input ref="password" name="confirm_password" onChange={this.handleOnChange} type="password" placeholder="Confirm Password" autoComplete="off" value={this.state.confirm_password}/>
                      </InputGroup>
                      <div className="validate" style={{ 'color': '#bf5d5d' }}>
                      {this.validator.message('Confirm Password', this.state.confirm_password, `required||min:6|confirm:${this.state.password}`)}
                       </div>

                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4 mt-4" onClick={this.contactSubmit.bind(this)}>Reset</Button>
                        </Col>
                        {/* <Col xs="6" className="text-right">
                          <Link color="link" className="px-0 " to={`/forgot-password`}>Back to login</Link>
                        </Col> */}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>

              </CardGroup>
            </Col>
          </Row>
    </Container> 
      </div>
    );
  }
}

export default ResetPassword;
