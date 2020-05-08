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
  allTopics?: any;
}

const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

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
          selectedToLearn: res.data.data.learn
            ? JSON.parse(JSON.stringify(res.data.data.learn))
            : [],
          selectedToTeach: res.data.data.teach
            ? JSON.parse(JSON.stringify(res.data.data.teach))
            : []
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
          allTopics: this.groupTopics(topics)
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
                {this.state.allTopics && this.renderTopics()}
                <div id="reset-button" onClick={this.handleReset}>
                  <img src="./img/reset.png" width={50} />
                </div>
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

  private groupTopics(topics: string[]): object {
    // this method a good candidate for optimization
    let alphaTopics: any = {};
    letters.forEach(letter => {
      alphaTopics[letter] = topics.filter(topic => {
        return topic.substr(0, 1).toLowerCase() === letter;
      });
    });
    return alphaTopics;
  }

  private handleReset = () => {
    if (this.state.mode === "TEACH" && this.state.userData) {
      if (this.state.userData.teach) {
        console.log("resetting");
        this.setState({
          selectedToTeach: JSON.parse(
            JSON.stringify(this.state.userData!.teach)
          )
        });
      }
    }

    if (this.state.mode === "LEARN" && this.state.userData) {
      if (this.state.userData.learn) {
        console.log("resetting");
        this.setState({
          selectedToLearn: JSON.parse(
            JSON.stringify(this.state.userData!.learn)
          )
        });
      }
    }
  };

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

  private renderTopics = () => {
    if (!this.state.userData) {
      return <div>Please sign in again</div>;
    }
    if (this.state.allTopics === undefined) {
      return <div>No topics found. Reload the page to try again.</div>;
    }

    let userTopics: string[] | undefined =
      this.state.mode === "TEACH"
        ? this.state.userData!.teach
        : this.state.userData!.learn;

    if (userTopics === undefined) {
      userTopics = [];
    }

    const topicContents = Object.keys(this.state.allTopics).map(
      (letter, index) => {
        if (!this.state.allTopics) {
          return <div />;
        }
        const letterContents: any = this.state.allTopics[letter].filter(
          (topic: string) => {
            return topic.substr(0, 1) === letter;
          }
        );

        return (
          <div className="alpha-section center-contents">
            <div className={"topic-alpha-header center-contents"}>
              {letter}
              <div className="underline" />
            </div>
            {letterContents.map((topic: string) => {
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
            })}
          </div>
        );
      }
    );

    return <div className="topic-bank center-contents">{topicContents}</div>;
  };

  private toggleLearningMode = () => {
    this.setState(prevState => {
      return {
        mode: prevState.mode === "LEARN" ? "TEACH" : "LEARN"
      };
    });
  };
}
