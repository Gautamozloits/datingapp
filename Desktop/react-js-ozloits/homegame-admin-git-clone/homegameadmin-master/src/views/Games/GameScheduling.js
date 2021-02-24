import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import Moment from "react-moment";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import { postData } from "../../services/service";
import Placeholder from "../../assets/img/brand/defaultEvent.png";
import Global from "../../constants/Global";

class Events extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      loading: true,
      activePage: 1,
      events: "",
      event_type: "all",
      results: [],
      modal: false,
      totalBuyModal: false,
      totalSettings: false,
      game_playsers: [],
      game_settings: {}
    };
  }
  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }
  componentDidMount = async () => {
    this.getEvents();
  };
  deleteEvent(id) {
    let data = { id: id };
    postData("delete-game", data).then((res) => {
      if (res.status) {
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
    // const result = props.result
    const userLink = `/games/${result.id}`;
    const getBadge = (status) => {
      return status === "Pending" ? "success" : "secondary";
    };

    return (
      <tr key={result.id.toString()}>
        <td>
          {this.state.pageMeta.per_page * (this.state.activePage - 1) +
            index +
            1}
        </td>
        <td>
          {result.image ? (
            <img
              className="img-fluid"
              src={Global.UPLOAD_URL + result.image}
              alt=""
              height="50px"
              width="50px"
            />
          ) : (
            <img
              className="img-fluid"
              src={Placeholder}
              alt=""
              height="50px"
              width="50px"
            />
          )}
        </td>
        <td>
          <Link to={userLink}>{result.title}</Link>
        </td>
        <td>{result.owner_name}</td>
        {/* <td>hi..{result}</td> */}

        <td>
          <span
            className="pointer"
            // onClick={() => this.toggleModal(result.users)}
          >
            {result.user_count}
          </span>
        </td>
        <td>
         
        {(result.date_1 && result.date_1 !== "" && result.date_1 !== 'null') ? <Moment format="DD/MM/YYYY">{result.date_1}</Moment> :  ""}<br/>
        {(result.date_2 && result.date_2 !== "" && result.date_2 !== 'null') ? <Moment format="DD/MM/YYYY">{result.date_2}</Moment> :  ""}<br/>
        {(result.date_3 && result.date_3 !== "" && result.date_3 !== 'null') ? <Moment format="DD/MM/YYYY">{result.date_3}</Moment> :  ""}
        </td>
        <td>
          <span
            className="pointer"
            // onClick={() => this.toggleModalTotalBuy(result.users)}
          >
          
          {(result.date_1 && result.date_1 !== "" && result.date_1 !== 'null') ? 
          <span>{result.date_1_user_count}</span> : <span>{""}</span>}<br/>

          {(result.date_2 && result.date_2 !== "" && result.date_2 !== 'null') ? 
          <span>{result.date_2_user_count}</span> : <span>{""}</span>}<br/>

          {(result.date_3 && result.date_3 !== "" && result.date_3 !== 'null') ? 
          <span>{result.date_3_user_count}</span> : <span>{""}</span>}<br/>

          {/* {result.date_3_user_count} */}
                 
          </span>
        </td>
        <td>
          <Moment format="DD/MM/YYYY">{result.date}</Moment>
        </td>
        <td>
          <Link to={userLink}>
            <Badge color={getBadge(result.status)}>{result.status}</Badge>
          </Link>
        </td>
        <td>
          <Moment format="DD/MM/YYYY">{result.created_at}</Moment>
        </td>
        <td>
          <Dropdown
            isOpen={this.state.dropdownOpen[index]}
            toggle={() => {
              this.toggle(index);
            }}
          >
            <DropdownToggle caret>Action</DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <i className="fa fa-info"></i>
                <Link to={userLink}>Detail</Link>
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  this.deleteEvent(result.id);
                }}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </td>
        <td>
        <span
            className="pointer"
            onClick={() => this.toggleModalSettings(result)}
          >Settings</span>
               
        </td>
      </tr>
    );
  }

  updateStatus(id, status) {
    this.setState({ loading: true });
    let data = { id: id, status: status };

    postData("update-status-event", data).then((res) => {
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
    this.setState({ event_type: e.target.value }, () => {
      this.getEvents();
    });
  }
  getEvents = (page = 1) => {
    page = page && page.target ? (page = 1) : page;
    this.setState({ loading: true });
    let data = {
      page: page,
      limit: 10,
    };
    if (this.state.events) {
      data.keywords = this.state.events;
    }
    if (this.state.event_type !== "") {
      data.event_type = this.state.event_type;
    }
    postData("schedule-games", data).then((res) => {
      if (res.success) {
        this.setState({
          notfound: false,
          loading: false,
          results: res.data,
          pageMeta: res.meta,
          activePage: res.meta.current_page,
          dropdownOpen: new Array(res.meta.total_count + 1).fill(false),
        });
      } else {
        //toast.error(res.message);
        this.setState({ loading: false, notfound: true });
      }
    });
  };

  handlePageChange(pageNumber = "2") {
    //console.log(`active page is ${pageNumber}`)
    this.getEvents(pageNumber);
    //this.setState({activePage: pageNumber});
  }
  setEvents(e) {
    this.setState({ events: e.target.value });
  }



  toggleModalSettings = (user = {}) => {
    console.log("user is prointing", user)
    this.setState({
      totalSettings: !this.state.totalSettings,
      game_settings: user,
    });
  };

  

  userModalTotalSettings(result, index) {
    const { game_settings, totalSettings } = this.state;
    //  var result = result; {result.hidden_pols}
    // console.log("this is result = ", result.date_1)
    return (
      <Modal isOpen={totalSettings}>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody style={{ maxHeight: "300px", overflow: "auto" }}>
          

              <div>
              <ul class="list-group">
              <li class="list-group-item">Hidden Poll:  <b>{(game_settings.open_invitation == 1 ) ? "YES" : "NO"}</b></li>
              <li class="list-group-item">Open Invitation: <b>{(game_settings.open_invitation == 1 ) ? "YES" : "NO"}</b></li>
              <li class="list-group-item">Limit One Date Selection: <b>{(game_settings.date_selection == "multiple" ) ? "NO" : "YES"}</b></li>
              <li class="list-group-item">Automatically Confirm Game: <b>{(game_settings.auto_confirm == 1 ) ? "YES" : "NO"}</b></li>
              <li class="list-group-item">No Players For Full Quorum: <b> {game_settings.quorum_user_count}</b> </li>
            </ul>

          </div>
          
          {/* })} */}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.toggleModalSettings()}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    );
  }


  render() {
    let { loading, results, notfound } = this.state;
    //const userList = usersData.filter((user) => user.id < 10)
    if (loading) {
      return (
        <div className="text-center mt-5">
          <h3>Loading...</h3>
        </div>
      );
    } else {
      return (
        <div className="animated fadeIn">
          {/* {this.userModal()}
          {this.userModalTotalBuy()} */}
          {this.userModalTotalSettings()}
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-filter"></i> Filter
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <InputGroup>
                        <Input
                          type="text"
                          id="input2-group2"
                          name="events"
                          value={this.state.events}
                          placeholder="Title / Category"
                          onChange={(e) => this.setEvents(e)}
                        />
                        <InputGroupAddon addonType="append">
                          <Button
                            type="button"
                            color="primary"
                            onClick={this.getEvents.bind(this)}
                          >
                            <i className="fa fa-search"></i> Search
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                    <Col md="3">
                      <InputGroup>
                        <select
                          name="event_type"
                          value={this.state.event_type}
                          onChange={this.setStateFromInput.bind(this)}
                          className="form-control"
                          id="event_type"
                        >
                          <option value="all">All</option>
                          <option value="event">Active Event</option>
                          <option value="challenge">Active Challenge </option>
                        </select>
                      </InputGroup>
                    </Col>
                    <Col md="6">
                      {/* <Link className="btn btn-primary" style={{ 'float': 'right' }} to={{ pathname: '/add-event' }} > Add Event </Link> */}
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
                  <i className="fa fa-align-justify"></i> Events{" "}
                  <small className="text-muted">List</small>
                </CardHeader>
                <CardBody>
                  <Table responsive hover bordered>
                    <thead>
                      <tr>
                        <th scope="col">Sr.No</th>
                        <th scope="col">Image</th>
                        <th scope="col">Title</th>
                        <th scope="col">Created By</th>
                        <th scope="col">Players</th>
                        <th scope="col">Invitation Dates</th>
                        <th scope="col">Response On Dates</th>
                        <th scope="col">Game Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created date</th>
                        <th scope="col">Action</th>
                        <th scope="col" width="600">Settings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notfound === false && results
                        ? results.map((result, index) =>
                            this.EventRow(result, index)
                          )
                        : ""}
                    </tbody>
                  </Table>
                  {notfound === true ? (
                    <p style={{ textAlign: "center", color: "#bf5d5d" }}>
                      <b>Related data is not available</b>
                    </p>
                  ) : (
                    ""
                  )}
                </CardBody>
                <CardBody>
                  <div>
                    {notfound === false && results ? (
                      <Pagination
                        firnstPageText={"First"}
                        lastPageText={"Last"}
                        prevPageText={"Prev"}
                        nextPageText={"Next"}
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.pageMeta.per_page}
                        totalItemsCount={this.state.pageMeta.total_count}
                        pageRangeDisplayed={5}
                        onChange={(pageNumber) => {
                          this.handlePageChange(pageNumber);
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
  }
}

export default Events;
