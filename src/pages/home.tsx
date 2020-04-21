import * as React from "react";
import axios from "axios";
import { ITopic } from "../api/iTopic";
import { CSSTransition } from "react-transition-group";
import { LoginPanel, LoginType } from "./login";

interface IHomeState {
  topics: ITopic[];
  login: boolean;
  loginType: LoginType;
}

export class Home extends React.Component<{}, IHomeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      topics: [],
      login: false,
      loginType: "SIGN_IN"
    };
  }

  async componentDidMount() {
    const topics = (await axios.get("http://localhost:8081/topic")).data;
    this.setState({
      topics
    });
  }
  public render() {
    return (
      <div>
        Home page
        <section>
          Hero
          <button onClick={this.handleSignUp}>Sign up</button>
          <button onClick={this.handleSignIn}>Sign in</button>
        </section>
        <section>About</section>
        <section>
          <div>Explore</div>
          {this.renderTopics()}
        </section>
        <CSSTransition
          in={this.state.login}
          className={"fade"}
          timeout={1000}
          unmountOnExit={true}
        >
          <LoginPanel
            initialLoginType={this.state.loginType}
            onCancel={this.handleLoginCancel}
            onSuccess={this.handleLoginCancel}
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

  private handleSignIn = () => {
    this.setState({
      login: true,
      loginType: "SIGN_IN"
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
