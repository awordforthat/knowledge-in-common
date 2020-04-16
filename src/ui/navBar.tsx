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
        <Link className="tab" to="/about">
          About
        </Link>
        {auth0Client.isAuthenticated() ? (
          <div>
            <Link className="tab" to="/account">
              Account
            </Link>
            <button onClick={this.signOut}>Sign out</button>
          </div>
        ) : (
          <div>
            <button onClick={auth0Client.signIn}>Sign in</button>
          </div>
        )}
      </div>
    );
  }

  private signOut = () => {
    auth0Client.signOut();
    this.props.history.replace("/");
  };
}

export const NavigationBar = withRouter(NavBar);
