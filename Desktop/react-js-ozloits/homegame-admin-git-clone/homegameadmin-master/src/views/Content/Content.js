import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Moment from 'react-moment';
import {Link} from 'react-router-dom';
import { postData } from '../../services/service';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results : null,
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

    postData('content-detail', userdetail).then((res) => {
      if(res.success){
        this.setState({
          loading: false,
          results: res.data,
          // pageMeta: res.meta,
          // activePage: res.meta.current_page,
         // dropdownOpen: new Array(res.meta.total_count+1).fill(false),
        });
      }else{
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
                <strong ><i className="icon-info pr-1"></i>Content id: {this.props.match.params.id}</strong>
                <Link className="btn btn-primary" style={{'float':'right'}}  to={{pathname: '/contents' }} >Go Back</Link>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>                 
                    {this.state.results  ? <tbody>
                      <div className="col-md-12">
                        <div className="row">
                          <th className="col-md-6" style={{'border':'none'}}>Title</th>
                          <td className="col-md-6" style={{'border':'none'}}>{result.title ? result.title : 'NULL'}</td>
                          <th className="col-md-6" style={{'border':'none'}}>Type</th>
                          <td className="col-md-6" style={{'border':'none'}}>{result.type ? result.type : 'NULL'}</td>
                          <th className="col-md-6" style={{'border':'none'}}>Content</th>
                          <td className="col-md-6" style={{'border':'none'}}>{result.content ? result.content : 'NULL'}</td>
                          
                          <th className="col-md-6" style={{'border':'none'}}>Status</th>
                          <td className="col-md-6" style={{'border':'none'}}><mark>{result.status ? result.status : 'NULL'}</mark></td>
                         
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

export default Content;
