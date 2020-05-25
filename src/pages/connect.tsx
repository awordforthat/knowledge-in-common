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
import { ITopic } from "../api/iTopic";
import { IMatch } from "../api/iMatch";
import classNames from "classnames";
import { MatchForm, IMatchFormResponse } from "../ui/matchForm";
import { RouteComponentProps } from "react-router";

interface IConnectState {
  appState: "EDITING" | "MATCHING" | "SEARCHING";
  canInteract: boolean;
  learnMatches?: IMatch[];
  teachMatches?: IMatch[];
  mode: "LEARN" | "TEACH";
  userData?: IUserData;
  selectedToLearn: string[];
  selectedToTeach: string[];
  selectedUser?: IMatch;
  randomMatches?: number[];
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

export class Connect extends React.Component<
  RouteComponentProps,
  IConnectState
> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      appState: "SEARCHING",
      canInteract: false,
      mode: "LEARN",
      selectedToLearn: [],
      selectedToTeach: []
    };
    CurrentUser.emitter.addListener("logout", this.reset);
  }

  public componentWillMount() {
    // retrieve user
    axios
      .get(serverUrl + "/user", {
        headers: {
          authorization: "bearer " + CurrentUser.getToken()
        },
        params: {
          id: CurrentUser.getId()
        }
      })
      .then(res => {
        this.setState({
          canInteract: true,
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
        let topics: ITopic[] = res.data.data;

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
          <div id="prompt" className="center-contents">
            {this.state.teachMatches || this.state.learnMatches
              ? this.state.mode === "TEACH"
                ? "choose your student"
                : " choose your teacher"
              : "what's on the syllabus today?"}
          </div>

          <div
            className="center-contents"
            style={{ marginTop: 20, width: "100%" }}
          >
            <div
              className="underline center-contents"
              style={{ width: "80%" }}
            />
          </div>

          <CSSTransition
            in={this.state.appState !== "MATCHING"}
            timeout={5000}
            classNames="fade"
          >
            <div id="mode-switch" className={"center-contents"}>
              <div id="mode-prompt">
                I want to
                <span
                  style={{ position: "absolute", right: "-80px", top: "-2px" }}
                >
                  :
                </span>
              </div>
              <div
                className={
                  this.state.mode === "LEARN"
                    ? "switcher top"
                    : "switcher bottom"
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
          </CSSTransition>

          <div id="request-panel">
            <CSSTransition
              in={this.state.appState === "SEARCHING"}
              classNames="fade"
              timeout={500}
              unmountOnExit={true}
            >
              <div
                className={
                  this.state.mode === "TEACH"
                    ? "request teach"
                    : "request learn"
                }
              >
                {this.renderSubsetTopics()}
                <div id="find-or-customize">
                  <div id="find-button" className="center-contents">
                    <button
                      className="center-contents rounded cta"
                      onPointerUp={this.findMatches}
                    >
                      FIND{" "}
                      {this.state.mode === "TEACH" ? "STUDENTS" : "TEACHERS"}
                    </button>
                    <span>or</span>
                    <button
                      onClick={this.toggleEditMode}
                      className="subtle-cta"
                    >
                      EDIT TOPICS
                    </button>
                  </div>
                </div>
              </div>
            </CSSTransition>
          </div>
          <div id="results">
            <CSSTransition
              in={this.state.appState === "MATCHING"}
              timeout={500}
              classNames="fade"
              unmountOnExit={true}
            >
              <div>
                <div className="center-contents">
                  <div id="matches-container">
                    <div id="matches-prompt">
                      <div
                        id="matches-prompt-header"
                        className="center-contents"
                      >
                        Select a user from the list below to connect with them
                      </div>
                      <div
                        id="matches-prompt-redirect"
                        className="center-contents"
                      >
                        (Not what you wanted?{" "}
                        <button
                          onPointerUp={this.handleClearMatches}
                          className="subtle-cta"
                        >
                          GO BACK
                        </button>{" "}
                        to search again.)
                      </div>
                    </div>
                    <div id="matches-content">{this.renderMatches()}</div>
                  </div>
                </div>
                <div id="communication-container">
                  <CSSTransition
                    in={dataExists(this.state.selectedUser)}
                    timeout={500}
                    classNames="fade"
                    unmountOnExit={true}
                  >
                    <div id="match-form-containter" className="center-contents">
                      <MatchForm
                        match={this.state.selectedUser!}
                        mode={this.state.mode}
                        onSubmit={this.handleSubmitMatch}
                        onCancel={this.handleCancelMatch}
                      />
                    </div>
                  </CSSTransition>
                </div>
              </div>
            </CSSTransition>
          </div>

          <div id="customize-panel">
            <CSSTransition
              in={
                dataExists(this.state.allTopics) &&
                this.state.appState === "EDITING"
              }
              classNames="fade"
              timeout={500}
              unmountOnExit={true}
            >
              <React.Fragment>
                <div
                  id="customize-prompt"
                  className={this.state.mode === "TEACH" ? "teach" : "learn"}
                >
                  Click topics to add them. When you're done,{" "}
                  <button className="cta rounded" onClick={this.toggleEditMode}>
                    GO BACK
                  </button>{" "}
                  to search with these topics
                </div>
                <div>
                  {this.state.allTopics &&
                    this.state.appState === "EDITING" &&
                    this.renderTopics()}
                </div>
                <div id="action-buttons">
                  <div
                    id="reset-button"
                    className="action-button center-contents"
                    onClick={this.handleReset}
                  >
                    <img src="./img/reset.png" width={50} />
                  </div>
                  <div
                    id="search-button"
                    className="action-button center-contents"
                  >
                    <img src="./img/search.png" width={50} />
                  </div>
                </div>
              </React.Fragment>
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

  public reset = () => {
    this.setState({
      appState: "SEARCHING",
      mode: "LEARN",
      selectedToLearn: [],
      selectedToTeach: []
    });
  };

  private findMatches = (e: React.PointerEvent) => {
    if (!this.state.canInteract) {
      return;
    }
    this.setState({
      canInteract: false
    });

    axios
      .post(serverUrl + "/connect", {
        mode: this.state.mode.toLowerCase(),
        id: CurrentUser.getId(),
        topics:
          this.state.mode === "LEARN"
            ? this.state.selectedToLearn
            : this.state.selectedToTeach
      })
      .then(result => {
        interface IMultiMatch {
          id: string;
          topics: string[];
          username: string;
        }
        const parsedMatches: IMultiMatch[] = [];
        result.data.users.forEach((obj: any) => {
          if (
            dataExists(obj.id) &&
            dataExists(obj.username) &&
            dataExists(obj.topics)
          ) {
            parsedMatches.push(Object.assign({}, obj));
          }
        });

        const matches: IMatch[] = [];
        // separate users into topics
        // TODO: combine if/else into one block so code isn't repeated
        if (this.state.mode === "TEACH") {
          this.state.selectedToTeach.forEach(topic => {
            // find all users that can teach this topic

            const topicMatches = parsedMatches.filter(match => {
              return match.topics.indexOf(topic) !== -1;
            });
            if (topicMatches.length > 0) {
              const randomTeacher =
                topicMatches[Math.floor(Math.random() * topicMatches.length)];

              matches.push({
                id: randomTeacher.id,
                username: randomTeacher.username,
                topic: topic
              });
            }
          });
        } else {
          this.state.selectedToLearn.forEach(topic => {
            const learnMatches = parsedMatches.filter(match => {
              return match.topics.indexOf(topic) !== -1;
            });

            if (learnMatches.length > 0) {
              const randomLearner =
                learnMatches[Math.floor(Math.random() * learnMatches.length)];

              matches.push({
                id: randomLearner.id,
                username: randomLearner.username,
                topic: topic
              });
            }
          });
        }

        this.setState(prevState => {
          if (prevState.mode === "LEARN") {
            return {
              appState: "MATCHING",
              learnMatches: matches,
              teachMatches: prevState.teachMatches
            };
          } else {
            return {
              appState: "MATCHING",
              learnMatches: prevState.learnMatches,
              teachMatches: matches
            };
          }
        });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({
          canInteract: true
        });
      });
  };

  private groupTopics(topics: ITopic[]): ITopic[] {
    // this method a good candidate for optimization
    let alphaTopics: any = {};
    letters.forEach(letter => {
      alphaTopics[letter] = topics.filter(topic => {
        return topic.name.substr(0, 1).toLowerCase() === letter;
      });
    });
    return alphaTopics;
  }

  private handleCancelMatch = () => {
    this.handleClearMatches();
  };

  private handleClearMatches = () => {
    this.setState({
      appState: "SEARCHING",
      learnMatches: undefined,
      teachMatches: undefined,
      selectedUser: undefined
    });
  };

  private handleReset = () => {
    if (this.state.mode === "TEACH" && this.state.userData) {
      if (this.state.userData.teach) {
        this.setState({
          selectedToTeach: JSON.parse(
            JSON.stringify(this.state.userData!.teach)
          )
        });
      }
    }

    if (this.state.mode === "LEARN" && this.state.userData) {
      if (this.state.userData.learn) {
        this.setState({
          selectedToLearn: JSON.parse(
            JSON.stringify(this.state.userData!.learn)
          )
        });
      }
    }
  };

  private handleSubmitMatch = (response: IMatchFormResponse) => {
    if (!this.state.selectedUser) {
      console.log(
        "You can't submit a match request without selecting a user first (actually not quite sure how you got here)"
      );
      return;
    }
    const messageObj = {
      mode: this.state.mode,
      requester: CurrentUser.getId(),
      matchId: this.state.selectedUser!.id,
      topic: this.state.selectedUser!.topic,
      skillLevel: response.knowledgeLevel,
      wantToKnow: response.background,
      anythingElse: response.otherNotes
    };
    axios
      .post(serverUrl + "/connect/request", messageObj)
      .then(result => {
        console.log("request complete");
        this.props.history.replace("/complete");
      })
      .catch(err => {
        //TODO: add toast message if request fails
        console.log(err);
      });
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

  private renderMatches = () => {
    if (this.state.mode === "TEACH" && !dataExists(this.state.teachMatches)) {
      return <div />;
    }

    if (this.state.mode === "LEARN" && !dataExists(this.state.learnMatches)) {
      return <div />;
    }

    let matches: any;
    let topicArray: string[];
    let matchPhrase: string;
    let matchesArray: IMatch[];
    if (this.state.mode === "LEARN") {
      topicArray = this.state.selectedToLearn;
      matchPhrase = " can teach you ";
      matchesArray = this.state.learnMatches!;
    } else {
      topicArray = this.state.selectedToTeach;
      matchPhrase = " wants to learn ";
      matchesArray = this.state.teachMatches!;
    }

    matches = topicArray.map(topic => {
      // find the user in matches that is associated with this topic
      const users = matchesArray.filter(match => {
        return match.topic === topic;
      });
      if (users.length === 0) {
        return <div>No matches found for {topic}</div>;
      }
      const user = users[0];
      const usernameClasses = classNames({
        username: true,
        selected: this.state.selectedUser === user
      });
      return (
        <div
          className={"match " + this.state.mode.toLowerCase()}
          onPointerUp={() => this.selectMatch(user)}
        >
          <span className="radio-dot center-contents">
            <div
              className={
                this.state.selectedUser === user
                  ? "radio-dot-fill selected"
                  : "radio-dot-fill"
              }
            />
          </span>
          <div className="radio-label">
            <span className={usernameClasses}>{user.username}</span>
            <div className="match-phrase">
              {matchPhrase}
              <span>{topic}</span>
            </div>
          </div>
        </div>
      );
    });

    return <div id="matches">{matches}</div>;
  };

  private renderSubsetTopics = () => {
    if (!this.state.userData) {
      return <div>Please sign in again</div>;
    }

    const topics: string[] | undefined =
      this.state.mode === "TEACH"
        ? this.state.selectedToTeach
        : this.state.selectedToLearn;

    if (!topics || topics.length === 0) {
      return (
        <div className="center-contents">
          Looks like you haven't chosen any topics to{" "}
          {this.state.mode === "TEACH" ? "teach" : "learn"} yet.{" "}
          <span
            onClick={this.toggleEditMode}
            className="rounded center-contents"
            style={{
              textTransform: "uppercase",
              textDecoration: "underline"
            }}
          >
            Add some?
          </span>
        </div>
      );
    } else {
      const topicClass =
        this.state.mode === "TEACH" ? "teach-mode" : "learn-mode";
      return (
        <div className={"subset-topic-bank topic-bank center-contents"}>
          {topics.map((topic, index) => {
            return (
              <div
                key={"subset-topic-" + topic + "-" + index}
                className={topicClass}
              >
                <Topic name={topic} editable={false} />
              </div>
            );
          })}
        </div>
      );
    }
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

    const topicContents = Object.keys(this.state.allTopics).map(letter => {
      if (!this.state.allTopics) {
        return <div />;
      }
      const letterContents: ITopic[] = this.state.allTopics[letter].filter(
        (topic: ITopic) => {
          let inMode;
          // future me: these are intentionally backwards.
          // if the user wants to learn a topic, it has to be teachable;
          // if they want to teach a topic, it has to be learnable
          if (this.state.mode === "TEACH") {
            inMode = topic.learnable;
          } else if (this.state.mode === "LEARN") {
            inMode = topic.teachable;
          }
          return topic.name.substr(0, 1) === letter && inMode;
        }
      );

      return (
        <div
          className="alpha-section center-contents"
          key={"alpha-section-" + letter}
        >
          <div className={"topic-alpha-header center-contents"}>
            {letter}
            <div className="underline" />
          </div>
          <div className="topics">
            {letterContents.map((topic: ITopic, letterIndex: number) => {
              const topicClasses = classnames({
                "bank-item": true,
                "selected-teach":
                  this.state.mode === "TEACH" &&
                  this.state.selectedToTeach.indexOf(topic.name) !== -1,
                "selected-learn":
                  this.state.mode === "LEARN" &&
                  this.state.selectedToLearn.indexOf(topic.name) !== -1
              });
              return (
                <div
                  key={"topic-" + letter + "-" + letterIndex}
                  className={topicClasses}
                >
                  <Topic
                    name={topic.name}
                    editable={true}
                    onClick={this.handleTopicSelection}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    });

    return <div className="topic-bank center-contents">{topicContents}</div>;
  };
  private selectMatch = (match: IMatch) => {
    this.setState({
      selectedUser: match
    });
  };

  private toggleEditMode = () => {
    this.setState(prevState => {
      return {
        appState: prevState.appState === "EDITING" ? "SEARCHING" : "EDITING"
      };
    });
  };

  private toggleLearningMode = () => {
    this.setState(prevState => {
      return {
        mode: prevState.mode === "LEARN" ? "TEACH" : "LEARN"
      };
    });
  };
}
