
import React, { Component, lazy, Suspense } from 'react';
import { Bar, Line } from 'react-chartjs-2';
// import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import * as Datetime from 'react-datetime';

import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardColumns,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table,
} from 'reactstrap';

import Moment from 'react-moment';
import Placeholder from '../../assets/img/brand/default.png';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
import { postData } from '../../services/service';
import { toast } from 'react-toastify';
import {UPLOAD_URL} from '../../constants/Global'
import {Link} from "react-router-dom";
// import MonthPicker from 'react-simple-month-picker';
// import MonthYearPicker from 'react-month-year-picker';
const moment = require("moment");
let line = {
  labels: "",
  datasets: [
    {
     
      label: 'Users',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: "",
    },
   
  ],
  
};
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      // date: [new Date(), new Date()],
      date_format:"year",
      date:moment(new Date(), 'DDMMMYY').format('YYYY-MM'),
      dropdownOpen: false,
      labels:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'],
      radioSelected: 2,
      filter:"",     

    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }
  handleChange(format,date) {
    if(format==='year'){
     this.setState({date_format:'year',date: moment(new Date(date._d), 'DDMMMYY').format('YYYY')});
      console.log('dd', moment(new Date(date._d), 'DDMMMYY').format('YYYY'));
      this.getUsersCountGraph(moment(new Date(date._d), 'DDMMMYY').format('YYYY'),format);
    } 
    if(format==='month'){
      this.setState({date_format:'month',date:moment(new Date(date._d), 'DDMMMYY').format('YYYY-MM')});
      console.log( moment(new Date(date._d), 'DDMMMYY').format('YYYY-MM'));
    }
   
  }
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  componentDidMount() {
    if(this.state.date_format==='year'){
      //this.setState({labels:['January', 'February', 'March', 'April', 'May', 'June', 'July','August','Septempber','Octber','November','December']});
      line.labels=['January', 'February', 'March', 'April', 'May', 'June', 'July','August','Septempber','Octber','November','December'];    
      line.datasets[0].data=[65, 59, 80, 81, 56, 55, 40];
     // lines.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec']
      //console.log('date', moment(this.state.date, "YYYY-MM").daysInMonth());
     // moment(date, "YYYY-MM").daysInMonth()
    }
    if(this.state.date_format==='month'){
      console.log('date', moment(this.state.date, "YYYY-MM").daysInMonth());
      
    }
    //this.getUsersCountGraph(this.state.date,this.state.date_format)
    this.getUsersCount()
    this.getEventCount()
  }
  getUsersCountGraph(date,date_format){
    postData('graph-users',{date:date,date_format:date_format}).then((res) => {
     line.datasets[0].data=[];
     // line.labels=['January', 'February', 'March', 'April', 'May', 'June', 'July','August','Septempber','Octber','November','December'];
      
      
      line.labels=[];
      // for (var i = 0; i < res.data.length; i++) {
      //   line.labels.push(res.data[i].month);
      //   line.datasets[0].data.push(res.data[i].count);
      // }
      // res.data.map((montharr, index) => {
      //     let resdata=  line.labels.find(m => m ===montharr.month)
      //     if(resdata){
          
          
      //       line.datasets[0].data.push(montharr.count);
      //     } else {
      //       line.datasets[0].data.push(0);
      //     }
      //     console.log('line-data', line.datasets[0].data);
      //   });

      // line.labels.map((montharr, index) => {
      //     let resdata=  res.data.find(m => m.month ===montharr)
      //     if(resdata){
          
          
      //       line.datasets[0].data.push(res.data.count);
      //     } else {
      //       line.datasets[0].data.push(0);
      //     }
      //     // console.log('line-data',res.data[index].count);
      //   });
     
      if (res.success) {
          this.setState({
          loading: false,
          results: res.data,
        });
      } else {
        toast.error(res.message);
      }
    }); 
  }
  getUsersCount(){
   
    postData('users',{page:1,limit:10,user_type:'all'}).then((res) => {
      if (res.success) {
          this.setState({
          loading: false,
          results: res.data,
          pageMeta: res.meta,
          activePage: res.meta.current_page,
          userCount:res.meta.total_count
        });
      } else {
        toast.error(res.message);
      }
    });
 }
  getEventCount(){
    postData('all-games', {event_type:'event' }).then((res) => {
        this.setState({eventCount:res.meta.total_count}); 
      });
  }
  
  updateStatus(id, status) {
    this.setState({ loading: true });
    let data = { id: id, status: status };
    postData('update-status', data).then((res) => {
      if (res.success) {
        this.getUsersCount(this.state.activePage);
        toast.success(res.message);
      }
      this.setState({
        loading: false,
      });
    });
  }
  setStateFromInput(e) {
    this.setState({ filter: e.target.value })
  }
  onChange = date => {
   
    this.setState({ date });
    console.log(moment(new Date(date), 'DDMMMYY').format('MM'));
    console.log()
    console.log(moment(date, "YYYY-MM").daysInMonth());
  //   var newdate1 = new Date(date[0]);
  //   var newdate2 = new Date(date[1]); 
  // this.getUsersCount(moment(newdate1, 'DDMMMYY').format('YYYY-MM-DD'),moment(newdate2, 'DDMMMYY').format('YYYY-MM-DD'));
    
  }
  render() {

    const options = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips
      },
      maintainAspectRatio: false
    }
      let {userCount,eventCount,challengeCount,rewardCount} =this.state
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Card className="bg-info">
              <CardBody>
                <div className="text-value" >
                  <i className="icon-people"></i>
                <span style={{fontSize: "16px", marginLeft: "13px" }} >Register Users ({userCount})</span>
                <Link to={`users`}><i className="fa fa-angle-double-right" style={{marginLeft:'10px','color':'white'}}></i> </Link>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="bg-primary">
              <CardBody className="">
                <div className="text-value" > <i class="nav-icon fa fa-calendar "></i>
                <span style={{fontSize: "16px" , marginLeft: "13px"}} >Total Games ({eventCount})</span></div>
             </CardBody>
            </Card>
          </Col>
       
          {/* <Col xs="12" sm="6" lg="3">
            <Card className="bg-info">            
              <CardBody>
                <div className="text-value" >
                  <i className="nav-icon fa fa-calendar"></i>
                <span style={{fontSize: "16px" , marginLeft: "13px"}} >Active Challenge ({challengeCount})</span></div>
              </CardBody>
             
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card className="bg-success">
              <CardBody className="">
                <div className="text-value" ><i class="nav-icon fa fa-vcard"></i> 
                <span style={{fontSize: "16px", marginLeft: "13px"}}>Claim Rewards ({rewardCount})</span>
                <Link to={`rewards`}><i className="fa fa-angle-double-right" style={{marginLeft:'10px','color':'white'}}></i> </Link>
                </div>
              </CardBody>
            </Card>
          </Col> */}
        </Row>
        <Row>
        {/* <Col xs="12" sm="12" lg="6">
        <Card>
            <CardHeader>
             User
              <div className="card-header-actions">
                  <small className="text-muted">
                  <select name="filter" value={this.state.filter} onChange={this.setStateFromInput.bind(this)} className="form-control">
                   <option>Select Any one</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                   
                   <span>
                     { this.state.filter==='month'? 
                  <Datetime dateFormat="YYYY-MM" timeFormat={false} onChange={this.handleChange.bind(this,'month')}/>:""}</span>
                  {this.state.filter==='year'?
                  <Datetime dateFormat="YYYY" timeFormat={false} onChange={this.handleChange.bind(this,'year')}/> : ""}
                  </small>
              </div>
            </CardHeader>
            <CardBody>
            {line.labels!==""? 
              <div className="chart-wrapper">
                <Bar data={line} options={options} />
              </div>
                :""}
            </CardBody>
          </Card>
          </Col> */}
          {/* <Col xs="12" sm="6" lg="6">
        <Card>
            <CardHeader>
              Event
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Line data={line} options={options} />
              </div>
            </CardBody>
          </Card>
          </Col>           */}
        </Row>
        <Row>
        {/* <Col xs="12" sm="6" lg="6">
        <Card>
            <CardHeader>
             Challenge
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Line data={line} options={options} />
              </div>
            </CardBody>
          </Card>
          </Col> */}
          {/* <Col xs="12" sm="6" lg="6">
        <Card>
            <CardHeader>
              Claim Rewards
              <div className="card-header-actions">
                <a href="http://www.chartjs.org" className="card-header-action">
                  <small className="text-muted">docs</small>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Line data={line} options={options} />
              </div>
            </CardBody>
          </Card>
          </Col>           */}
        </Row>
         <Row>
          <Col>
            <Card>
              <CardHeader>
               Latest User
              </CardHeader>
              <CardBody>
               <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
                  <thead className="thead-light">
                    <tr>
                        <th className="text-center">
                          Profile
                          {/* <i className="icon-people"></i> */}
                          </th>
                        <th>User</th>
                        <th>Phone</th>
                        <th className="text-center">Have App</th>
                        <th className="text-rigth">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.results && this.state.results.map((users)=>{
                    
                      return <tr>
                        <td className="text-center">
                            <div className="avatar">
                            
                              <img src={users.image !== null  ? `${UPLOAD_URL}`+users.image  :
                             Placeholder} className="img-avatar" alt="Users"/>
                                
                            </div>
                        </td>
                        <td>
                            <div>{users.name}</div>
                            <div className="small text-muted">
                                <span>New</span> | Registered: <Moment format="DD MMM, Y hh:mm A">{users.created_at}</Moment>
                            </div>
                        </td>
                        <td> <div>{users.phone_number}</div></td>
                        
                        <td>
                            <div className="float-center">
                                {/* <span className="badge badge-success">{users.status}</span> */}
                                {(users.have_app === 1) ?
                                    <Link to= "#" ><span className="badge badge-success">
                                    Yes</span></Link> :
                                    <Link to= "#" ><span className="badge badge-danger">
                                    No</span></Link>
                                }

                            </div>
                        </td>

                        <td>
                            <div className="float-center">
                                {/* <span className="badge badge-success">{users.status}</span> */}
                                {(users.status === 'Active') ?
                                    <Link to= "#" ><span className="badge badge-success" onClick={() => { this.updateStatus(users.id, 'Inactive') }}>
                                    Active</span></Link> :
                                  <Link to= "#" ><span className="badge badge-danger" onClick={() => { this.updateStatus(users.id, 'Active') }}>
                                    Inactive</span></Link>
                                }

                            </div>
                        </td>
                    </tr>})}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
