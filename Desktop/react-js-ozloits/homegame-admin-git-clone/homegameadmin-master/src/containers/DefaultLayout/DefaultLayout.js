import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
//import Cookies from 'universal-cookie';
import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';

// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import { isLoggedIn, logout } from '../../services/authService';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));


class DefaultLayout extends Component {
  state = {
    user_role: localStorage.getItem('user_role'),
    menuArray: [],
    permission: '',
    demo: ''
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  componentDidMount = async () => {
    this.routeRendering();
    if (!isLoggedIn()) {
      this.props.history.push('/login')
      console.log('***************user not logged in');
    }

  }

  // route rendering  function 
  routeRendering() {
    var menuArray = [];
    navigation.items.map((route_value, index) => {
      //console.log("userpermission : :", route_value.permission)

      if (route_value.permission == 'both') {
        menuArray.push(route_value);
      } else if (this.state.user_role == 'admin' && route_value.permission == 'admin') {
        menuArray.push(route_value);
      }
    })
    let menuItems = {
      items: menuArray
    }

    this.setState({ menuItems: menuItems })
  }

  signOut(e) {
    e.preventDefault()
    logout();
    this.props.history.push('/login')
  }

  render() {
    return (
      <div className="app">

        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={this.state.menuItems} {...this.props} router={router} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>

          {/* {this.state.menuItems ? */}
          <main className="main">
            {/* <span>hi.............</span> */}
            <AppBreadcrumb appRoutes={routes} router={router} />
            {/* <span>hi....{this.props}</span> */}
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch >
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route key={idx} path={route.path} name={route.name} render=
                        {props =>
                          (<route.component {...props} />)
                        }
                      />
                    )
                      : (null)
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>

          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
