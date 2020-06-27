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
import { IMatch, IPendingMatch } from "../api/iMatch";
import classNames from "classnames";
import { MatchForm, IMatchFormResponse } from "../ui/matchForm";
import { RouteComponentProps } from "react-router";
import { ModeSwitcher } from "../ui/modeSwitcher";
import { AlphaTopicList } from "../ui/alphaTopicList";


interface IConnectState {
  appState: "EDITING" | "MATCHING" | "SEARCHING";
  canInteract: boolean;
  errorText: string;
  learnMatches?: IMatch[];
  teachMatches?: IMatch[];
  mode: "LEARN" | "TEACH";
  userData?: IUserData;
  selectedToLearn: string[];
  selectedToTeach: string[];
  selectedUser?: IMatch;
  randomMatches?: number[];
}

export class Connect extends React.Component<
  RouteComponentProps,
  IConnectState
> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      appState: "SEARCHING",
      errorText: "",
      canInteract: false,
      mode: "LEARN",
      selectedToLearn: [],
      selectedToTeach: []
    };
    CurrentUser.emitter.addListener("logout", this.reset);
    
  }

  public componentWillMount() {
    // retrieve user
    if (!CurrentUser.isLoggedIn()) {
      return;
    }
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
            username: res.data.data.username,
            email: res.data.data.email,
            learn: res.data.data.learn,
            teach: res.data.data.teach,
            pending: res.data.data.pending
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
  }

 

  public render() {
    if (dataExists(window.localStorage["authToken"])) {
      return (
        <div id="connect">
         
          {!this.state.userData ? <div>"Loading..."</div> : <div />}
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
            <ModeSwitcher
              onClick={this.toggleLearningMode}
              mode={this.state.mode}
            />
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
              in={this.state.appState === "EDITING"}
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

                <AlphaTopicList
                  mode={this.state.mode}
                  onTopicClick={this.handleTopicSelection}
                  onReset={this.handleReset}
                  selectedTopics={
                    this.state.mode === "TEACH"
                      ? this.state.selectedToTeach
                      : this.state.selectedToLearn
                  }
                />
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
      errorText: "",
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
    /**
 * {
        data: {
          mode: this.state.mode.toLowerCase(),
          id: CurrentUser.getId(),
          topics:
            this.state.mode === "LEARN"
              ? this.state.selectedToLearn
              : this.state.selectedToTeach
        }
      }
 */
    axios
      .post(
        serverUrl + "/connect",
        {
          mode: this.state.mode.toLowerCase(),
          id: CurrentUser.getId(),
          topics:
            this.state.mode === "LEARN"
              ? this.state.selectedToLearn
              : this.state.selectedToTeach
        },
        {
          headers: { authorization: "bearer " + CurrentUser.getToken() }
        }
      )
      .then(result => {
        interface IMultiMatch {
          id: string;
          topics: string[];
          username: string;
        }
        const parsedMatches: IMultiMatch[] = [];
        result.data.forEach((obj: any) => {
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
                userId: randomTeacher.id,
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
                userId: randomLearner.id,
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
      matchId: this.state.selectedUser!.userId,
      topic: this.state.selectedUser!.topic,
      skillLevel: response.knowledgeLevel,
      wantToKnow: response.background,
      anythingElse: response.otherNotes
    };
    axios
      .post(serverUrl + "/connect/request", messageObj, {
        headers: {
          authorization: "bearer " + CurrentUser.getToken()
        }
      })
      .then(result => {
        this.props.history.replace("/complete");
      })
      .catch(err => {
        //TODO: add toast message if request fails
        console.log(err);
        console.log(err.message);
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
    if (!this.state.userData) {
      return <div />;
    }
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
    let pendingMatches: IPendingMatch[] = this.state.userData.pending;
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
      // find the users in matches that are associated with this topic
      let users = matchesArray.filter(match => {
        return match.topic === topic;
      });
      if (users.length === 0) {
        return (
          <div key={"topic-match-" + topic + "-not-found"}>
            No matches found for {topic}.
          </div>
        );
      }

      users = users.filter((matchingUser, index) => {
        let matchingPending = [];
        if (this.state.mode == "LEARN") {
          // look for existing matches where topic and teacher are the same
          matchingPending = pendingMatches.filter(pendingMatch => {
            return (
              pendingMatch.teacher === matchingUser.userId &&
              pendingMatch.topic === matchingUser.topic
            );
          });
        } else {
          matchingPending = pendingMatches.filter(pendingMatch => {
            return (
              pendingMatch.learner === matchingUser.userId &&
              pendingMatch.topic === matchingUser.topic
            );
          });
        }
        return matchingPending.length === 0;
      });

      if (users.length === 0) {
        return (
          <div key={"topic-match-" + topic + "-not-found"}>
            You have pending matches with all of the available{" "}
            {this.state.mode === "TEACH" ? "learners" : "teachers"} for {topic}.
          </div>
        );
      }

      // if there are valid matches left, choose a random user among them

      let user = users[Math.floor(Math.random() * users.length)];

      const usernameClasses = classNames({
        username: true,
        selected: this.state.selectedUser === user
      });
      return (
        <div
          className={"match " + this.state.mode.toLowerCase()}
          onPointerUp={() => this.selectMatch(user)}
          key={"match-" + user.userId.toString()}
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
