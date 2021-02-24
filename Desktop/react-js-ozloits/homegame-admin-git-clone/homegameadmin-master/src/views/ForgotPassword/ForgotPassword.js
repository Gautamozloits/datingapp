import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postData, setUserSession, isLoggedIn } from '../../services/authService';
import SimpleReactValidator from 'simple-react-validator';
//import Cookies from 'universal-cookie';
//const cookies = new Cookies();


class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      password_err:'',
      otp_err:'',
      otp:"",
      loading: false,
      is_login:false,
      reset_password:false
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
  handleOnChangePassword=(e)=>{
  
    var obj = {};
		obj[e.target.name] = e.target.value;
    this.setState({ field: e.target.files });
    console.log( e.target.name);
		this.setState(obj);
  }
  // resetSubmit(e){
  //   e.preventDefault();
  //   // if(this.state.password.toString().length < 5 ){
  //   //   this.setState({ password_err:"Please Enter Atleast 6 digit Password" });
  //   // }
  //   if(this.state.password ==='' || this.state.password.length < 5){
  //     this.setState({ password_err:"Enter Passowrd atleast 6 character & digit" });
  //   }
  //   if(this.state.password !=='' && this.state.password.length > 5){
  //     this.setState({ password_err:""});
  //   }
  //   if(this.state.otp ==='' ){
  //     this.setState({ otp_err:"Enter Otp" });
  //   } else {
  //     this.setState({ otp_err:"" });
  //   }
  //   if (this.state.password!=='' &&  this.state.password.length >5 && this.state.otp!=='' && this.state.email!=='') {
  //     let data = { email: this.state.email,otp:this.state.otp,newpassword: this.state.password};
  //     postData('reset-password', data).then((res) => {
  //         if (res.success) {     
  //           this.notifysucess(res.message, true);
  //           setTimeout(() => {      
  //             if (res.success) {
  //               this.props.history.push('/login')  ;
        
  //             }
  //           }, 1000);
  //         } else {            
  //           toast.error(res.message);
  //         }
  //     });      
  //   }
  //  } 
  contactSubmit(e) {	
		e.preventDefault();
    if (this.validator.allValid()) {
    let data = { email: this.state.email};
    postData('forgot-password', data).then((res) => {
    if (res.success) {
      this.setState({reset_password:true});
      toast.success(res.message);       
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
                      <h3>Forgot Password</h3>                     
                      <InputGroup className="">                        
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input ref="email_username" name="email"  onChange={this.handleOnChange} type="text" placeholder="Enter Your Email" autoComplete="off"  
                        value={this.state.email}/>
                       </InputGroup>
                      <div className="validate" style={{ 'color': '#bf5d5d' }}>{this.validator.message('email', this.state.email, 'required|email')}</div>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4 mt-4" onClick={this.contactSubmit.bind(this)}>Submit</Button> 
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

export default ForgotPassword;

