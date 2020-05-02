import * as React from "react";
import axios from "axios";

import { CSSTransition } from "react-transition-group";

import { dataExists } from "../helpers";
import { Footer } from "../ui/footer";
import { serverUrl } from "..";
import { CurrentUser } from "../user";
import { IUserData } from "../api/iUserData";

import "../css/transitions.css";
import "../css/connect.css";
import { Topic } from "../ui/topic";

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
        <div id="connect">
          {!this.state.userData && !this.state.topics ? (
            <div>"Loading..."</div>
          ) : (
            <div />
          )}
          <div id="greeting" className={"center-contents"}>
            hey there
            {window.localStorage["username"] !== "undefined" &&
            window.localStorage["username"] !== "null"
              ? ", " + window.localStorage["username"] + "!"
              : "!"}
          </div>
          <div id="mode-switch" className={"center-contents"}>
            Today I want to
            <div
              className={
                this.state.mode === "LEARN" ? "switcher top" : "switcher bottom"
              }
            >
              <div
                onClick={this.toggleLearningMode}
                className={
                  this.state.mode === "LEARN" ? "option" : "option deselected"
                }
              >
                LEARN
              </div>
              <div
                onClick={this.toggleLearningMode}
                className={
                  this.state.mode === "TEACH" ? "option" : "option deselected"
                }
              >
                TEACH
              </div>
            </div>
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
        <div id="connect">
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

    const topicContents = topics.map((topic, index) => {
      return (
        <div key={"topic-" + index}>
          <Topic name={topic} editable={true} />
        </div>
      );
    });

    return <div className="topic-bank">{topicContents}</div>;
  };

  private toggleLearningMode = () => {
    this.setState(prevState => {
      return {
        mode: prevState.mode === "LEARN" ? "TEACH" : "LEARN"
      };
    });
  };
}
