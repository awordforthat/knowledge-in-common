import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import auth0Client from "./auth";

class Callback extends Component<RouteComponentProps> {
  async componentDidMount() {
    await auth0Client.handleAuthentication().then(() => {
      console.log("user was authenticated");
      this.props.history.replace("/choose")
    }).catch(err =>{
      console.log("Sorry, authentication failed.")
      this.props.history.replace("/");
    });
    
    
  }

  render() {
    return <p>Loading profile...</p>;
  }
}

export const CallbackFunc = withRouter(Callback);
