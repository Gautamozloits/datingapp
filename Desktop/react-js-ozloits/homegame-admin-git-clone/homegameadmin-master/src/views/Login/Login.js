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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email_username: '',
      password: '',
      loading: false,
      is_login:false,
    };
    this.validator = new SimpleReactValidator();
    this.handleOnChange = this.handleOnChange.bind(this);
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

  // login = async (event) => {
  //   event.preventDefault();
  //   let data = { username: this.state.username, password: this.state.password };
  //   let res = await postData('login', data);
  //   if (res.success) {
  //     // console.log("response !",res.result.role)
  //     localStorage.setItem('user_role', res.result.role)
  //     const user_role = localStorage.getItem('user_role');
  //     console.log("Role of user during login ::=>", user_role);

  //     await setUserSession(res.result)
  //     this.props.history.push('/dashboard')
  //   } else {
  //     toast.error(res.message);
  //   }
  // }
  contactSubmit(e) {	
		e.preventDefault();
    if (this.validator.allValid()) {
    let data = { username: this.state.email_username, password: this.state.password };
    postData('login', data).then((res) => {
     
    if (res.success) {
      setUserSession(res.data);
      console.log( res.data);
      this.setState({is_login:true});
      localStorage.setItem('user_role', 'admin');
      localStorage.setItem('user_detail',JSON.stringify(res.data));
      toast.success(res.message);
      this.props.history.push('/dashboard')        
      } else {
        this.setState({email_username:""});
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
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="">                        
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input ref="email_username" name="email_username" onChange={this.handleOnChange} type="text" placeholder="Username" autoComplete="off" value={this.state.email_username}/>
                       </InputGroup>
                      <div className="validate" style={{ 'color': '#bf5d5d' }}>{this.validator.message('username', this.state.email_username, 'required')}</div>
                      <InputGroup className="mt-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input ref="password" name="password" onChange={this.handleOnChange} type="password" placeholder="Password" autoComplete="off" value={this.state.password}/>
                      </InputGroup>
                      <div className="validate" style={{ 'color': '#bf5d5d' }}>{this.validator.message('password', this.state.password, 'required')}</div>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4 mt-4" onClick={this.contactSubmit.bind(this)}>Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Link color="link" className="px-0 " to={`/forgot-password`}>Forgot password?</Link>
                        </Col>
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

export default Login;
