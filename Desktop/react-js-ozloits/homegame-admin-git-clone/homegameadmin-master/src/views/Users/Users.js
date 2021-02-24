import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge, Card, CardBody, CardHeader, Col, Row, Table,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, InputGroup, InputGroupAddon, Button, Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import Moment from 'react-moment';
import { toast } from 'react-toastify';
import Pagination from "react-js-pagination";
import { postData } from '../../services/service';

class Users extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      loading: true,
      activePage: 1,
      results: [],
      usersear: null,
      user_type:'all',

      totalDeviceInfo: false,
       
      deviceInfo: {}
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
    this.getUsers();
  }
  setStateFromInput(e) {
    this.setState({ user_type: e.target.value },()=>{
      this.getUsers();
    });
  }

  deleteUser(id) {
    let data = { user_id: id }
    postData('delete-user', data).then((res) => {

     
      if (res.success) {
        this.getUsers();
        toast.success(res.message);
        console.log("this i smain response ", res)
      }
      this.setState({
        loading: false,

      });

    });
  }

  setUsers(e) {
    this.setState({ usersear: e.target.value });
  }

  UserRow(result, index) {
    // console.log('this is consoling from USer row', result)
    const userLink = `/user/${result.id}`
    const getBadge = (status) => {
      return status === 'Active' ? 'success' :
        status === 'Inactive' ? 'secondary' :
          status === 'Pending' ? 'warning' :
            status === 'Banned' ? 'danger' :
              'primary'
    }
    const phoneVerification = (status) => {
      return status === 1 ? 'success' :
        status === 0 ? 'warning' :
          'primary'
    }

    return (

      <tr key={result.id.toString()}>
        {/* <td>{index +1}</td> */}
         <td>{this.state.pageMeta.per_page *(this.state.activePage-1)+index+1}</td>
         <td><Link to={userLink}>{result.name}</Link></td>
        <td>{(result.username && result.username !== '') ? result.username : result.temp_id}</td>
        <td><Moment format="DD MMM, Y hh:mm A">{result.created_at}</Moment>
        </td>
         
         {/* gg code here */}

        <td>{(result.device_other_info) ? <span className="pointer" onClick={() => this.toggleModalDeviceInfo(result.device_other_info)}>Device-Info </span>
        : 
        
        <span>N/A</span>
      } 

        </td>

      
        

        {/* gg code here */}

        <td><Link to={userLink}><Badge color={phoneVerification(result.is_mobile_verified)}>{(result.is_mobile_verified === 1 && result.username !== '') ? 'Verified' : 'Not Verified'}</Badge></Link></td>
        <td>
            <div className="float-center">
              {(result.have_app === 1) ?
                  <Link to= "#" ><span className="badge badge-success">
                  Yes</span></Link> :
                  <Link to= "#" ><span className="badge badge-danger">
                  No</span></Link>
              }
            </div>
        </td>
        <td><Link to={userLink}><Badge color={getBadge(result.status)}>{result.status}</Badge></Link></td>
        <td>
          <Dropdown isOpen={this.state.dropdownOpen[index]} toggle={() => {
            this.toggle(index);
          }}>
            <DropdownToggle caret>
              Action
                  </DropdownToggle>
            <DropdownMenu>
              <DropdownItem><i className="fa fa-info" aria-hidden="true"></i><Link to={userLink}>Detail</Link></DropdownItem>
              {(result.status === 'Active') ?
                <DropdownItem onClick={() => { this.updateStatus(result.id, 'Inactive') }}><i className="fa fa-times" aria-hidden="true"></i>Inactive</DropdownItem> :
                <DropdownItem onClick={() => { this.updateStatus(result.id, 'Active') }}><i className="fa fa-check" aria-hidden="true"></i>Active</DropdownItem>
              }
              {/* <DropdownItem className="text-danger" onClick={() => { this.deleteUser(result.id) }}><i className="fa fa-trash-o" aria-hidden="true"></i>Delete</DropdownItem> */}
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>
    )
  }

  updateStatus(id, status) {
    this.setState({ loading: true });
    let data = { id: id, status: status };
    postData('update-status', data).then((res) => {
      if (res.success) {
        this.getUsers(this.state.activePage);
        toast.success(res.message);
        
      }
      this.setState({
        loading: false,
      });
    });
  }

  getUsers = (page = 1) => {
    page = page && page.target ? page = 1 : page
    this.setState({ loading: true });
    let data = { 
       page: page, 
       limit: 10 };
   if (this.state.usersear) {
     data.keywords = this.state.usersear;
   }
   if (this.state.user_type) {
    data.user_type = this.state.user_type;
  }
   
    postData('users', data).then(async(res) => {
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
        //toast.error(res.message)
        this.setState({loading:false , notfound: true})
      }
    });
  }

  handlePageChange(pageNumber = '2') {
  this.getUsers(pageNumber)
    //this.setState({activePage: pageNumber});
  }

//  g code here

toggleModalDeviceInfo = (device_info = "") => {
  console.log("user is prointing", device_info)
  this.setState({
    totalDeviceInfo: !this.state.totalDeviceInfo,
    deviceInfo: (device_info) ? JSON.parse(device_info): {},
  });
};


  userDeviceInfo(result, index) {
    const { deviceInfo, totalDeviceInfo } = this.state;
    console.log("this is device info ", deviceInfo)

    //  var result = result; {result.hidden_pols} device_other_info
   // console.log("this is result 444  = ",  deviceInfo.device_other_info)
    // console.log("this is result = (deviceInfo.device_other_info). ", JSON.parse(JSON.stringify(deviceInfo.device_other_info)))
    // console.log("this is result = (deviceInfo.device_other_info). ", deviceInfo.device_other_info)
    // console.log("this is result 33 = ",  deviceInfo.device_other_info.is_device)
    // {(result.date_1 && result.date_1 !== "" && result.date_1 !== 'null') ? <Moment format="DD/MM/YYYY">{result.date_1}</Moment> :  ""}<br/> {deviceInfo.device_other_info.modelName} && deviceInfo === {}


    return (
      <Modal isOpen={totalDeviceInfo}>
        <ModalHeader background color="blue">Device Information</ModalHeader>
        <ModalBody style={{ maxHeight: "300px", overflow: "auto" }}>
        
              <div>

               

          <ul class="list-group">
                            
          <li class="list-group-item">Device Brand Name:  <b>{(deviceInfo.brand && deviceInfo.brand !== '') ? <span>{deviceInfo.brand}</span> : "N/A" }</b></li>

          <li class="list-group-item">Device Manufacturer Company:  <b>{(deviceInfo.manufacturer && deviceInfo.manufacturer !== '') ? <span>{deviceInfo.brand}</span> : "N/A" }</b></li>


          <li class="list-group-item">Device Model Name:  <b>{(deviceInfo.modelName && deviceInfo.modelName !== '') ? <span>{deviceInfo.modelName}</span> : "N/A" }</b></li>

          <li class="list-group-item">Device Model year:  <b>{(deviceInfo.deviceYearClass && deviceInfo.deviceYearClass !== '') ? <span>{deviceInfo.deviceYearClass}</span> : "N/A" }</b></li>
          <li class="list-group-item">Device Model Id:  <b>{(deviceInfo.modelId && deviceInfo.modelId !== '') ? <span>{deviceInfo.modelId}</span> : "N/A" }</b></li>

          <li class="list-group-item">Device Design Name:  <b>{(deviceInfo.designName && deviceInfo.designName !== '') ? <span>{deviceInfo.deviceYearClass}</span> : "N/A" }</b></li>


          <li class="list-group-item">Device Product Name:  <b>{(deviceInfo.productName && deviceInfo.productName !== '') ? <span>{deviceInfo.productName}</span> : "N/A" }</b></li>

          <li class="list-group-item">Device Total Memory:  <b>{(deviceInfo.totalMemory && deviceInfo.totalMemory !== '') ? <span>{deviceInfo.totalMemory}</span> : "N/A" }</b></li>

          <li class="list-group-item">Device Operating System Name:  <b>{(deviceInfo.osName && deviceInfo.osName !== '') ? <span>{deviceInfo.osName}</span> : "N/A" }</b></li>

          <li class="list-group-item">Device Operating System Version:  <b>{(deviceInfo.osVersion && deviceInfo.osVersion !== '') ? <span>{deviceInfo.osVersion}</span> : "N/A" }</b></li>

          <li class="list-group-item">Device  Operating System Build Id:  <b>{(deviceInfo.osBuildId && deviceInfo.osBuildId !== '') ? <span>{deviceInfo.osBuildId}</span> : "N/A" }</b></li>

          <li class="list-group-item">Device Operating System Internal Build Id:  <b>{(deviceInfo.osInternalBuildId && deviceInfo.osInternalBuildId !== '') ? <span>{deviceInfo.osInternalBuildId}</span> : "N/A" }</b></li>

          <li class="list-group-item">Device Name:  <b>{(deviceInfo.deviceName && deviceInfo.deviceName !== '') ? <span>{deviceInfo.deviceName}</span> : "N/A" }</b></li>

          <li class="list-group-item">Device supported Cpu Architectures:  <b>{(deviceInfo.supportedCpuArchitectures && deviceInfo.supportedCpuArchitectures !== '') ? <span>{deviceInfo.supportedCpuArchitectures}</span> : "N/A" }</b></li>
          
          
        </ul> 

             

          </div>
                   
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.toggleModalDeviceInfo()}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  //  g code here




  render() {
let {loading ,results, notfound}  =this.state
    //const userList = usersData.filter((user) => user.id < 10)
    if (loading) {
      return <div className="text-center mt-5">
       
      <h3>Loading...</h3></div>
    } else {
      return (
        <div className="animated fadeIn">
         {this.userDeviceInfo()}
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
                        <Input type="text" id="input2-group2" name="usersear" value={this.state.usersear} onChange={this.setUsers.bind(this)} placeholder="Name or Phone number" />
                        <InputGroupAddon addonType="append">
                          <Button type="button" onClick={this.getUsers.bind(this)} color="primary"><i className="fa fa-search"></i> Search</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                    <Col md="3">
                      <InputGroup>
                        <select name="user_type" value={this.state.user_type} onChange={this.setStateFromInput.bind(this)} className="form-control" id="user_type">
                          <option value="all">All User</option>
                          <option value="active">Active User</option>
                          <option value="Inactive">Inactive User</option>
                          {/* <option value="Pending">Pending User</option>
                          <option value="Banned">Banned User</option> */}
                        </select>
                      </InputGroup>
                      </Col>
                  </FormGroup>

                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Users <small className="text-muted">List</small>
                </CardHeader>
                <CardBody>
                  <Table responsive hover bordered>
                    <thead>
                      <tr>
                        <th scope="col">Sr.No</th>
                        <th scope="col">Name</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Registered</th>
                        <th scope="col">Device Info</th>
                        <th scope="col">Phone Verification</th>
                        <th scope="col">Have App</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      { notfound === false && results ? 
                      results.map((result, index) =>
                        this.UserRow(result, index)
                      ):""}
                    </tbody>
                  </Table>
                  { notfound === true ?
                  <p style={{textAlign: "center",color: '#bf5d5d'}}><b>Related data is not available    </b></p>:''}
                </CardBody>
                <CardBody>
                  <div>
                  { notfound === false && results ?
                    <Pagination
                      firstPageText={'First'}
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

export default Users;
