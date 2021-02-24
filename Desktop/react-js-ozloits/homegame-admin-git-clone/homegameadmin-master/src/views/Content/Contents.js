import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge, Card, CardBody, CardHeader, Col, Row, Table,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, InputGroup, InputGroupAddon, Button, Input
} from 'reactstrap';
// import Moment from 'react-moment';
import { toast } from 'react-toastify';
import Pagination from "react-js-pagination";
import { postData } from '../../services/service';

class Contents extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      loading: true,
      activePage: 1,
      events: null,
      results: []
    };
  }
  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }
  componentDidMount = async () => {
    this.getEvents();
  }
  deleteEvent(id) {
    let data = { id: id }
    postData('delete-event', data).then((res) => {
      if (res.success) {
        this.getEvents(this.state.activePage);
        toast.success(res.message);
      }
      this.setState({
        loading: false,

      });

    });
  }
  EventRow(result, index) {
    // console.log(result)
    // // const result = props.result
     const userLink = `/content-detail/${result.id}`
    const getBadge = (status) => {
      return status === 'Active' ? 'success' : 'secondary'
    }
    const phoneVerification = (status) => {
      return status === 1 ? 'success' :
        status === 0 ? 'warning' :
          'primary'
    }
    return (
      <tr key={result.id.toString()}>
        {/* <td>{index+1}</td> */}
        {/* <th scope="row"><Link to={userLink}>{result.id}</Link></th> */}
        <td>{this.state.pageMeta.per_page *(this.state.activePage-1)+index+1}</td>
       
        {/* <td><Link to={userLink}>{result.title}</Link></td> */}
        <td>{result.title}</td>
        <td>{result.type}</td>
        <td title={result.content}>{result.content.slice(0, 80) + "..."}</td>
        <td><Link to={userLink}><Badge color={getBadge(result.status)}>{result.status}</Badge></Link></td>
        <td>
          <Dropdown isOpen={this.state.dropdownOpen[index]} toggle={() => {
            this.toggle(index);
          }}>
            <DropdownToggle caret>
              Action
                  </DropdownToggle>
            <DropdownMenu>
              {/* {(result.status === 'Active') ? 
                    <DropdownItem onClick={() => {this.updateStatus(result.id, 'Inactive')}}><i className="fa fa-times"></i>Inactive</DropdownItem> : 
                    <DropdownItem onClick={() => {this.updateStatus(result.id, 'Active')}}><i className="fa fa-check "></i>Active</DropdownItem>
                    } */}
              <DropdownItem className="text-danger"><Link to={`edit-content/` + result.id}><i className="fa fa-pencil"></i>Edit</Link></DropdownItem>
              {/* <DropdownItem className="text-danger" onClick={() => {this.deleteEvent(result.id)}}><i className="fa fa-trash-o"></i>Delete</DropdownItem> */}
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>
    )
  }


  updateStatus(id, status) {
    this.setState({ loading: true });
    let data = { id: id, status: status };

    postData('update-status-event', data).then((res) => {
      if (res.success) {
        this.getEvents(this.state.activePage);
        toast.success(res.message);
      }
      this.setState({
        loading: false,

      });

    });
  }

  getEvents = (page = 1) => {

    let keywords = this.state.events;

    this.setState({ loading: true });
    let data = { page: page, limit: 10 };
    if (keywords) {
      data.keywords = keywords;
    }
    console.log("keywords", keywords);
    postData('all-content', data).then((res) => {
      console.log("resss", res);
      if (res.success) {
        this.setState({
          loading: false,
          results: res.data,
          pageMeta: res.meta,
          activePage: res.meta.current_page,
          dropdownOpen: new Array(res.meta.total_count + 1).fill(false),
        });
      } else {
        toast.error(res.message);
      }

    });
  }

  handlePageChange(pageNumber = '2') {
    console.log(`active page is ${pageNumber}`)
    this.getEvents(pageNumber)
    //this.setState({activePage: pageNumber});
  }
  setEvents(e) {
    this.setState({ events: e.target.value });
  }
  render() {

    if (this.state.loading) {
      return <div className="text-center mt-5"><h3>Loading...</h3></div>
    } else {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-filter"></i> Filter
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="4">
                      <InputGroup>
                        <Input type="text" id="input2-group2" placeholder="Title" />
                        <InputGroupAddon addonType="append">
                          <Button type="button" color="primary" ><i className="fa fa-search"></i> Search</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                    {/* <Col md="8">
                    <Link className="btn btn-primary" style={{'float':'right'}}  to={{pathname: '/add-event' }} >Add Content</Link>
                  </Col> */}
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Contents <small className="text-muted">List</small>
                </CardHeader>
                <CardBody>
                  <Table responsive hover bordered>
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th scope="col">Title</th>
                        <th scope="col">Type</th>
                        <th scope="col">Content</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.results ? this.state.results.map((result, index) =>
                        this.EventRow(result, index)
                      ) :
                        "No Data Found"}
                    </tbody>
                  </Table>
                </CardBody>
                <CardBody>
                  <div>
                    <Pagination
                      firnstPageText={'First'}
                      lastPageText={'Last'}
                      prevPageText={'Prev'}
                      nextPageText={'Next'}
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.pageMeta.per_page}
                      totalItemsCount={this.state.pageMeta.total_count}
                      pageRangeDisplayed={5}
                      onChange={pageNumber => {
                        this.handlePageChange(pageNumber);
                      }}
                    />
                  </div>
                </CardBody>
              </Card>

            </Col>
          </Row>
        </div>
      )
    }
  }
}

export default Contents;
