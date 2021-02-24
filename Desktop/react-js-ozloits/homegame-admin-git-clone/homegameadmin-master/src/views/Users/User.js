import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import usersData from './UsersData';
import Moment from 'react-moment';
import { Link, Redirect } from 'react-router-dom';
import { postData } from '../../services/service';
import Placeholder from '../../assets/img/brand/default.png';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
    }
  }

  componentDidMount = async () => {

    this.getUser();
  }

  getUser() {
    let userdetail = {};
    userdetail.id = this.props.match.params.id;
    this.setState({ loading: true });
    // let data = {limit: 10 };

    postData('user-detail', userdetail).then((res) => {
      if (res.success) {
        this.setState({
          loading: false,
          results: res.data,
          // pageMeta: res.meta,
          // activePage: res.meta.current_page,
          // dropdownOpen: new Array(res.meta.total_count+1).fill(false),
        });
      } else {
        toast.error(res.message);
      }
    });
  }

  render() {
    const result = this.state.results;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong ><i className="icon-user pr-1"></i>User id: {this.props.match.params.id}</strong>
                <Link className="btn btn-primary" style={{ 'float': 'right' }} to={{ pathname: '/users' }} >Go Back</Link>
              </CardHeader>
              <CardBody>
                <Table responsive striped hover>
                  {this.state.results ? <tbody>
                    <div className="col-md-12">
                      {result.image ?
                        <td className="col-md-12" style={{ 'border': 'none' }}>
                          <img className="img-fluid" src={'http://157.175.58.190:3001/events/' + result.image} alt="" height="100px" width="100px" />
                        </td> : <img className="img-fluid" src={Placeholder} alt="" height="px" width="100px" />
                      }
                      <br />
                      <div className="row">
                        <th className="col-md-6" style={{ 'border': 'none' }}>Name</th>
                        <td className="col-md-6" style={{ 'border': 'none' }}>{result.name ? result.name : 'NULL'}</td>
                        <th className="col-md-6">Phone No.</th>
                        <td className="col-md-6">{result.phone_number ? result.phone_number : 'NULL'}</td>
                        <th className="col-md-6">status</th>
                        <td className="col-md-6">{result.status ? result.status : 'NULL'}</td>
                        <th className="col-md-6">Created Date</th>
                        <td className="col-md-6"><Moment format="YYYY/MM/DD">
                          {result.created_at}
                        </Moment>
                        </td>
                      </div>

                    </div></tbody>
                    : <span><i className="text-muted icon-ban"></i> Not found</span>}


                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default User;
