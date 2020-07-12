import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import "../css/navBar.css";
import "../css/global.css";
import { CurrentUser } from "../user";

class NavBar extends React.Component<RouteComponentProps, {}> {
  public render() {
    return (
      <div className="nav-bar">
        <Link className="brand" to="/">
          <div className="logo-container center-contents">
            <div className="logo center-contents">KIC</div>
          </div>
        </Link>
        <div className="button-bar">
          <div className={this.getTabClasses("/about")}>
            <Link to="/about">About</Link>
          </div>
          <div className={this.getTabClasses("/faqs")}>
            <Link to="/faqs">FAQs</Link>
          </div>
          <div className={this.getTabClasses("/contact")}>
            <Link to="/contact">Contact</Link>
          </div>
          {window.localStorage["authToken"] !== "null" &&
          window.localStorage["authToken"] !== undefined ? (
            <React.Fragment>
              <div className={this.getTabClasses("/connect")}>
                <Link to="/connect">Connect</Link>
              </div>
              <div className={this.getTabClasses("/account")}>
                <Link to="/account">Account</Link>
              </div>
            </React.Fragment>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }

  private getTabClasses(route: string): string {
    return this.props.location.pathname === route ? "tab selected" : "tab";
  }

  private signOut = () => {
    CurrentUser.signOut();
    this.props.history.replace("/");
  };
}

export const NavigationBar = withRouter(NavBar);
