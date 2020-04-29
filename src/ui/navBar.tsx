import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import "../css/navBar.css";
import "../css/global.css";

class NavBar extends React.Component<RouteComponentProps, {}> {
  public render() {
    return (
      <div className="nav-bar">
        <Link className="brand" to="/">
          <div className="logo-container center-contents">
            <div className="logo center-contents">KiC</div>
          </div>
        </Link>

        <div className="button-bar">
          <div className="tab">
            <Link to="/about">About</Link>
          </div>
          <div className="tab">
            <Link to="/faq">FAQs</Link>
          </div>

          {window.localStorage["authToken"] !== "null" &&
          window.localStorage["authToken"] !== undefined ? (
            <React.Fragment>
              <div className="tab">
                <Link to="/account">Account</Link>
              </div>

              <div className="tab" onClick={this.signOut}>
                Sign out
              </div>
            </React.Fragment>
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
