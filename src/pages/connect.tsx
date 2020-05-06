import * as React from "react";
import axios from "axios";
import classnames from "classnames";

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
  selectedToLearn: string[];
  selectedToTeach: string[];
  allTopics?: string[];
}

export class Connect extends React.Component<{}, IConnectState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      mode: "LEARN",
      selectedToLearn: [],
      selectedToTeach: []
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
          },
          selectedToLearn: res.data.data.learn ? res.data.data.learn : [],
          selectedToTeach: res.data.data.teach ? res.data.data.teach : []
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
          allTopics: topics
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
          {!this.state.userData && !this.state.allTopics ? (
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
              in={dataExists(this.state.allTopics)}
              classNames="fade"
              timeout={500}
              unmountOnExit={true}
            >
              <div>
                {this.state.allTopics &&
                  this.renderTopics(this.state.allTopics)}
              </div>
            </CSSTransition>
          </div>

          <div>
            Look for {this.state.mode === "LEARN" ? "teachers" : "students"}
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

  private handleTopicSelection = (topic: string) => {
    // add this topic if it wasn't already there; remove it if it was
    this.setState(prevState => {
      if (prevState.mode === "TEACH") {
        const topicIndex = prevState.selectedToTeach.indexOf(topic);
        if (topicIndex === -1) {
          prevState.selectedToTeach.push(topic);
        } else {
          prevState.selectedToTeach.splice(topicIndex, 1);
        }
        return {
          selectedToLearn: prevState.selectedToLearn,
          selectedToTeach: prevState.selectedToTeach
        };
      } else {
        const topicIndex = prevState.selectedToLearn.indexOf(topic);
        if (topicIndex === -1) {
          prevState.selectedToLearn.push(topic);
        } else {
          prevState.selectedToLearn.splice(topicIndex, 1);
        }
        return {
          selectedToLearn: prevState.selectedToLearn,
          selectedToTeach: prevState.selectedToTeach
        };
      }
    });
  };

  private renderTopics = (topics: string[] | undefined) => {
    if (!this.state.userData) {
      return <div>Please sign in again</div>;
    }
    if (topics === undefined || topics.length === 0) {
      return <div>Looks like you don't have any topics yet. Add some?</div>;
    }

    let userTopics: string[] | undefined =
      this.state.mode === "TEACH"
        ? this.state.userData!.teach
        : this.state.userData!.learn;

    if (userTopics === undefined) {
      userTopics = [];
    }

    const topicContents = topics.map((topic, index) => {
      const topicClasses = classnames({
        "bank-item": true,
        "selected-teach":
          this.state.mode === "TEACH" &&
          this.state.selectedToTeach.indexOf(topic) !== -1,
        "selected-learn":
          this.state.mode === "LEARN" &&
          this.state.selectedToLearn.indexOf(topic) !== -1
      });
      return (
        <div key={"topic-" + index} className={topicClasses}>
          <Topic
            name={topic}
            editable={true}
            onClick={this.handleTopicSelection}
          />
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
