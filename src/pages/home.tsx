import * as React from "react";
import axios from "axios";
import { ITopic } from "../api/iTopic";
import { CSSTransition } from "react-transition-group";
import { LoginPanel, LoginType } from "./login";
import { RouteComponentProps } from "react-router-dom";

import "../css/home.css";
import "../css/global.css";
import "../css/transitions.css";

interface IHomeState {
  topics: ITopic[];
  login: boolean;
  loginType: LoginType;
}

export class Home extends React.Component<RouteComponentProps, IHomeState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      topics: [],
      login: false,
      loginType: "LOG_IN"
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8081/topic")
      .then(result => {
        console.log(result);
        this.setState({
          topics: result.data["data"]
        });
      })
      .catch(err => {
        console.log("Failed to get topics");
      });
  }
  public render() {
    return (
      <div className="home">
        <div className="background" />
        <section id="hero">
          <div id="hero-text" className="fit-parent center-contents">
            Learn. Teach. Connect.
          </div>
          <div className="button-container">
            <button onClick={this.handleSignUp}>Sign up</button>
            <button onClick={this.handleSignIn}>Log in</button>
          </div>
        </section>
        <section id="About">
          <div className="title">About</div>
        </section>
        <section>
          <div className="title">Explore</div>
          {this.renderTopics()}
        </section>
        <CSSTransition
          in={this.state.login}
          classNames={"fade"}
          timeout={500}
          unmountOnExit={true}
        >
          <LoginPanel
            initialLoginType={this.state.loginType}
            onCancel={this.handleLoginCancel}
            onSuccess={this.handleLoginSuccess}
          />
        </CSSTransition>
      </div>
    );
  }

  private handleLoginCancel = () => {
    this.setState({
      login: false
    });
  };

  private handleLoginSuccess = () => {
    this.setState(
      {
        login: false
      },
      () => {
        this.props.history.replace("/choose");
      }
    );
  };

  private handleSignIn = () => {
    this.setState({
      login: true,
      loginType: "LOG_IN"
    });
  };

  private handleSignUp = () => {
    this.setState({
      login: true,
      loginType: "SIGN_UP"
    });
  };

  private renderTopics = () => {
    return this.state.topics.map(topic => {
      return (
        <div>
          Name: {topic.name} Category: {topic.category}
        </div>
      );
    });
  };
}
