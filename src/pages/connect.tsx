import * as React from "react";
import { dataExists } from "../helpers";
import { Footer } from "../ui/footer";
import "../css/transitions.css";
import axios from "axios";
import { serverUrl } from "..";
import { CurrentUser } from "../css/user";
import { IUserData } from "../api/iUserData";
import { CSSTransition } from "react-transition-group";

interface IConnectState {
  mode: "LEARN" | "TEACH";
  userData?: IUserData;
  topics?: string[];
}

export class Connect extends React.Component<{}, IConnectState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      mode: "LEARN"
    };

    // retrieve user
    axios
      .get(serverUrl + "/user", {
        headers: {
          authorization: "bearer " + CurrentUser.getToken()
        },
        data: {
          id: CurrentUser.getId()
        }
      })
      .then(res => {
        this.setState({
          userData: {
            userName: res.data.data.username,
            email: res.data.data.email,
            learn: res.data.data.learn,
            teach: res.data.data.teach
          }
        });
      })
      .catch(err => {
        console.log(err);
      });

    // retrieve topics
    axios
      .get(serverUrl + "/topic")
      .then(res => {
        console.log(res);
        let topics: string[] = [];
        res.data.data.forEach((topicObj: any) => {
          topics = topics.concat(topicObj.name);
        });
        this.setState({
          topics: topics
        });
      })
      .catch(err => {
        console.log(err);
        console.log("Failed to get topics");
      });
  }

  public render() {
    if (dataExists(window.localStorage["authToken"])) {
      return (
        <div>
          {!this.state.userData && !this.state.topics ? (
            <div>"Loading..."</div>
          ) : (
            <div />
          )}
          hey there
          {window.localStorage["username"] !== "undefined" &&
          window.localStorage["username"] !== "null"
            ? ", " + window.localStorage["username"] + "!"
            : "!"}
          <div>
            Today I want to
            <div onClick={this.setModeLearn}>LEARN</div>
            <div onClick={this.setModeTeach}>TEACH</div>
          </div>
          <div id="topic-bank">
            <CSSTransition
              in={dataExists(this.state.topics)}
              classNames="fade"
              timeout={500}
              unmountOnExit={true}
            >
              <div>
                {this.state.topics && this.renderTopics(this.state.topics)}
              </div>
            </CSSTransition>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div>You've been signed out. Please sign in again.</div>
          <Footer />
        </div>
      );
    }
  }

  private renderTopics = (topics: string[] | undefined) => {
    if (topics === undefined || topics.length === 0) {
      return <div>Looks like you don't have any topics yet. Add some?</div>;
    }

    return topics.map((topic, index) => {
      return <div key={"topic-" + index}>{topic}</div>;
    });
  };

  private setModeLearn = () => {
    this.setState({
      mode: "LEARN"
    });
  };

  private setModeTeach = () => {
    this.setState({
      mode: "TEACH"
    });
  };
}
