import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge, Card, CardBody, CardHeader, Col, Row, Table,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, InputGroup, InputGroupAddon, Button, Input
} from 'reactstrap';
import Moment from 'react-moment';
import { toast } from 'react-toastify';
import Pagination from "react-js-pagination";
import { postData } from '../../services/service';
import Placeholder from '../../assets/img/brand/defaultEvent.png';
import Global from '../../constants/Global';

class Tips extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      loading: true,
      activePage: 1,
      events: null,
      event_type:'all',
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
  deleteTips(id) {
    let data = { id: id }
    postData('softdelete-tips', data).then((res) => {
      if (res.success) {
        toast.success(res.message);
        this.getEvents();
      }
      this.setState({
        loading: false,

      });

    });
  }
  EventRow(result, index) {
    // console.log(result)
    // const result = props.result
    const userLink = `/tips/${result.id}`
    const getBadge = (status) => {
      return status === 'Pending' ? 'success' : 'secondary'
    }
    
    return (
      <tr key={result.id.toString()} >
        <td>{this.state.pageMeta.per_page * (this.state.activePage - 1) + index + 1}</td>
        <td><Link to={userLink}>{result.tips}</Link></td>
        <td><Moment format="DD/MM/YYYY">
          {result.date}
        </Moment></td>
        <td><Link to={userLink}><Badge color={getBadge(result.status)}>{(result.status === 1) ? 'Active':'Inactive'}</Badge></Link></td>
        <td>
          <Dropdown isOpen={this.state.dropdownOpen[index]} toggle={() => {
            this.toggle(index);
          }}>
            <DropdownToggle caret>
              Action
                  </DropdownToggle>
            <DropdownMenu>
             
              <DropdownItem className="text-danger"><Link to={`edit-tips/` + result.id}><i className="fa fa-pencil"></i>Edit</Link></DropdownItem>
              <DropdownItem className="text-danger" onClick={() => {this.deleteTips(result.id) }}><i className="fa fa-trash-o" aria-hidden="true"></i>Delete</DropdownItem>
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
  setStateFromInput(e) {
    this.setState({ event_type: e.target.value },()=>{
      this.getEvents();
    });
  }
  getEvents = (page = 1) => {
    page = page && page.target ? page = 1 : page
    this.setState({ loading: true });
    let data = { 
       page: page, 
       limit: 10 };
   if (this.state.events) {
     data.keywords = this.state.events;
   }
   if (this.state.event_type !== '') {
    data.event_type = this.state.event_type;
  }
  
     postData('tips', data).then((res) => {
     if (res.success) {
        this.setState({
          notfound:false,
          loading: false,
          results: res.data,
          pageMeta: res.meta,
          activePage: res.meta.current_page,
          dropdownOpen: new Array(res.meta.total_count + 1).fill(false),
        });
      } else {
        //toast.error(res.message);
        this.setState({loading:false , notfound: true})
      }
     
    });
  }

  handlePageChange(pageNumber = '2') {
    //console.log(`active page is ${pageNumber}`)
    this.getEvents(pageNumber)
    //this.setState({activePage: pageNumber});
  }
  setEvents(e) {
    this.setState({ events: e.target.value });
  }
  render() {
    let {loading ,results, notfound}  =this.state
    //const userList = usersData.filter((user) => user.id < 10)
    if (loading) {
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
                
                 <Link className="btn btn-primary" style={{ 'float': 'right' }} to={{ pathname: '/add-tips' }} > Add Tips </Link>
                </CardBody> 
              </Card>
            </Col>
          </Row> 
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Events <small className="text-muted">List</small>
                </CardHeader>
                <CardBody>
                  <Table responsive hover bordered>
                    <thead>
                      <tr>
                        <th scope="col">Sr.No</th>
                        <th scope="col">Tips</th>
                        <th scope="col">Created date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                     { notfound === false && results ?
                      results.map((result, index) =>
                        this.EventRow(result, index)
                      ):""}
                    </tbody>
                  </Table>
                  { notfound === true ?
                  <p style={{textAlign: "center",color: '#bf5d5d'}}><b>Related data is not available</b></p>:''}
                </CardBody>
                <CardBody>
                  <div>
                  { notfound === false && results ?
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
                    />:''}
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

export default Tips;
