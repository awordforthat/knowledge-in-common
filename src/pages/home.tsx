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
      <div id="home">
        <div className="background" />
        <section id="hero">
          <div id="hero-text" className="fit-parent center-contents">
            Learn. Teach. Connect.
          </div>
          <div className="button-container">
            <button className="emphasis" onClick={this.handleSignUp}>
              Sign up
            </button>
            <button onClick={this.handleSignIn}>Log in</button>
          </div>
        </section>
        <section id="About">
          <div className="section-title">About</div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu felis
          rhoncus, suscipit odio eu, aliquet justo. Nulla eget hendrerit magna.
          Nulla sollicitudin turpis in odio tincidunt, sed cursus dui aliquet.
          Ut ex est, maximus in massa nec, scelerisque condimentum turpis. Nunc
          quam magna, commodo eget neque eget, volutpat maximus velit. Integer
          interdum vestibulum vulputate. Ut id orci sollicitudin, sollicitudin
          ex eget, ultrices dui. Vestibulum consequat, erat non fermentum
          accumsan, eros leo fringilla odio, ut vehicula urna erat commodo
          libero. Aliquam eu interdum leo.
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
      return <div>{topic.name}</div>;
    });
  };
}
