import * as React from "react";
import auth0Client from "./auth";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";

class NavBar extends React.Component<RouteComponentProps, {}> {
  public render() {
    return (
      <div className="nav-bar">
        <Link className="brand" to="/">
          Home
        </Link>
        {auth0Client.isAuthenticated() ? (
          <div>
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
