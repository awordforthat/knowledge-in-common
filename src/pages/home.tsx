import * as React from "react";
import axios from "axios";
import { CSSTransition } from "react-transition-group";
import { LoginPanel, LoginType } from "./login";
import { RouteComponentProps } from "react-router-dom";

import "../css/home.css";
import "../css/global.css";
import "../css/transitions.css";
import { Topic } from "../ui/topic";
import { CurrentUser } from "../user";
import { serverUrl } from "..";

interface IHomeState {
  topics: string[];
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
      .get(serverUrl + "/topic")
      .then(result => {
        let topics: string[] = [];
        result.data.data.forEach((topicObj: any) => {
          topics = topics.concat(topicObj.name);
        });
        this.setState({
          topics: topics
        });
      })
      .catch(err => {
        console.log("Failed to get topics");
      });
  }
  public render() {
    return (
      <div id="home">
        <div className="background" />
        <section id="hero">
          <div id="hero-text" className="fit-parent center-contents">
            Learn. Teach. Connect.
          </div>
          {!CurrentUser.isLoggedIn() && (
            <div className="button-container">
              <button className="emphasis" onClick={this.handleSignUp}>
                Sign up
              </button>
              <button onClick={this.handleSignIn}>Log in</button>
            </div>
          )}
          {CurrentUser.isLoggedIn() && (
            <div className="button-container">
              <button className="cta" onClick={this.goToConnect}>
                Find matches
              </button>
            </div>
          )}
        </section>
        <section id="About">
          <div className="section-title">About</div>
          This is some new text
        </section>
        <section>
          <div className="section-title">Explore</div>
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

  private goToConnect = () => {
    this.props.history.push("/connect");
  };

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
        this.props.history.replace("/connect");
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
        <div key={"homepage-topic-" + topic}>
          <Topic editable={false} name={topic} />
        </div>
      );
    });
  };
}
