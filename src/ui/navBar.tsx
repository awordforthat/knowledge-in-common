import * as React from "react";
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

          {window.localStorage["authToken"] !== "null" ? (
            <div>
              <div className="tab">
                <Link to="/account">Account</Link>
              </div>

              <div className="button" onClick={this.signOut}>
                Sign out
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }

  private signOut = () => {
    window.localStorage["authToken"] = null;
    this.props.history.replace("/");
  };
}

export const NavigationBar = withRouter(NavBar);
