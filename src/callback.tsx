import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import auth0Client from "./auth";

class Callback extends Component<RouteComponentProps> {
  async componentDidMount() {
    await auth0Client.handleAuthentication().then(() => {});
    this.props.history.replace("/");
  }

  render() {
    return <p>Loading profile...</p>;
  }
}

export const CallbackFunc = withRouter(Callback);
