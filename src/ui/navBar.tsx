import * as React from "react";
import auth0Client from "../auth";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import "../css/navBar.css";

class NavBar extends React.Component<RouteComponentProps, {}> {
  public render() {
    return (
      <div className="nav-bar">
        <Link className="brand" to="/">
          Home
        </Link>
        <div className="button-bar">
          <div className="tab">
            <Link to="/about">About</Link>
          </div>

          {auth0Client.isAuthenticated() ? (
            <div>
              <div className="tab">
                <Link to="/account">Account</Link>
              </div>

              <div className="button" onClick={this.signOut}>
                Sign out
              </div>
            </div>
          ) : (
            <div>
              <div className="button" onClick={auth0Client.signIn}>
                Sign in
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  private signOut = () => {
    auth0Client.signOut();
    this.props.history.replace("/");
  };
}

export const NavigationBar = withRouter(NavBar);
