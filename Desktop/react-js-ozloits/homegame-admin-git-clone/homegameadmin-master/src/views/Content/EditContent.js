import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { postData } from '../../services/service';
import SimpleReactValidator from 'simple-react-validator';
import CKEditor from 'ckeditor4-react';

class EditContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      isLoading: false

    }
    this.validator = new SimpleReactValidator();
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  componentDidMount = async () => {
    this.getEvent();
  }


  setStateFromInput = (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);

  }
// updating contents 
  contactSubmit(e) {
    e.preventDefault();
    if (this.validator.allValid()) {
      let contentDetail = {};
      contentDetail.id = this.props.match.params.id;
      contentDetail = {
        id: this.props.match.params.id,
        content: this.state.content,
        title: this.state.title
      }
      console.log(contentDetail);
      postData('edit-content', contentDetail).then((res) => {
        if (res.success) {
          this.notifysucess(res.message, true);
          this.setState({
            isLoading : true
          })
        } else {
          this.notify(res.message, false)
        }
      })
        .catch(function (error) {
          alert(error)
          // this.setState({ enable: true })
        })

    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
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
  notifysucess(msg, status) {
    toast.success(msg, {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });

    setTimeout(() => {
      this.setState({ enable: true })
      if (status) {
        window.history.back();

      }
    }, 1000);
  }
  onEditorChange(evt) {
    this.setState({
      content: evt.editor.getData()
    });

  }

  // getting contents list
  getEvent() {
    let userdetail = {};
    userdetail.id = this.props.match.params.id;
    this.setState({ loading: true });
    postData('content-detail', userdetail).then((res) => {
      if (res.success) {
        this.setState({
          loading: false,
          title: res.data.title,
          content: res.data.content,
        });
      } else {
        toast.error(res.message);
      }
    });
  }

  render() {


    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong ><i className="fa fa-folder-open-o pr-1"></i>Content id: {this.props.match.params.id}</strong>
                <Link className="btn btn-primary" style={{ 'float': 'right' }} to={{ pathname: '/contents' }} >Go Back</Link>
              </CardHeader>
              <CardBody>
                <div className="col-md-12">
                  <div className="row">
                    <section className="register-page section-b-space">
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="col-lg-12">
                              <div className="d-inline-block justify-content-end">
                              </div>
                              <div>
                                <form className="theme-form">
                                  <div className="form-row">
                                    <div className="col-md-6">
                                      <label htmlFor="title">Title</label>
                                      <input ref={el => this.inputTitle = el} maxLength='25' name="title" type="text" className="form-control" id="title"
                                        placeholder="Title" required="" onChange={this.setStateFromInput} value={this.state.title} />
                                      <span className="validate" style={{ 'color': 'red' }}>
                                        {this.validator.message('title', this.state.title, 'required')}
                                      </span>
                                    </div>

                                  </div>
                                  <br />
                                  <div className="row">
                                    <div className="col-md-12">
                                      <CKEditor data={this.state.content} name="content" type="classic" onChange={this.onEditorChange} />

                                    </div>
                                  </div>

                                  <div className="row">
                                    {this.state.isLoading ? <button className="buttonload btn btn-solid m-2 btn-primary">
                                      <i className="fa fa-spinner fa-spin"></i> Loading
                                    </button>:<button className="btn btn-solid m-2 btn-primary" onClick={this.contactSubmit.bind(this)}>Update Content</button>  }
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default EditContent;
