import * as React from "react";
import axios from "axios";

import { RouteComponentProps } from "react-router";

import { serverUrl } from "..";
import { CurrentUser } from "../user";
import "../css/global.css";
import "../css/account.css";
import { IUserData } from "../api/iUserData";
import { Topic } from "../ui/topic";
import { CSSTransition } from "react-transition-group";
import { AlphaTopicList } from "../ui/alphaTopicList";
import { ModeSwitcher } from "../ui/modeSwitcher";

interface IAccountState {
  appState: "VIEW" | "EDIT";
  editMode: "TEACH" | "LEARN";
  canInteract: boolean;
  enteredUsername: string;
  userData?: IUserData;
  selectedToTeach: string[];
  selectedToLearn: string[];
}

export class Account extends React.Component<
  RouteComponentProps,
  IAccountState
> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      appState: "VIEW",
      editMode: "LEARN",
      enteredUsername: "",
      canInteract: true,
      selectedToTeach: [],
      selectedToLearn: []
    };
  }

  public componentWillMount() {
    this.setState(
      {
        canInteract: false
      },
      () => {
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
              enteredUsername: res.data.data.username
                ? res.data.data.username
                : "",
              userData: {
                username: res.data.data.username,
                email: res.data.data.email,
                learn: res.data.data.learn,
                teach: res.data.data.teach
              },
              selectedToTeach: res.data.data.teach,
              selectedToLearn: res.data.data.learn
            });
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            this.setState({ canInteract: true });
          });
      }
    );
  }
  public render() {
    if (CurrentUser.isLoggedIn()) {
      return (
        <div id="account" className="center-contents">
          <CSSTransition
            in={this.state.appState === "VIEW"}
            classNames="fade"
            timeout={1000}
            unmountOnExit={true}
          >
            <div>
              <div className="title">My Account</div>
              <div>
                Hi there
                {this.state.userData && this.state.userData.username
                  ? " " + this.state.userData.username
                  : ""}
                !
              </div>

              <div id="profile-info">
                <div id="edit-username">
                  <label htmlFor="username-field">Edit your username:</label>
                  <input
                    value={this.state.enteredUsername}
                    id="username-field"
                    type="text"
                    maxLength={32}
                    pattern={"[a-z0-9]"}
                    onInput={this.handleUsernameChange}
                  />
                  <button
                    onClick={() => {
                      this.updateUser({ username: this.state.enteredUsername });
                    }}
                  >
                    Change
                  </button>
                </div>
                <div>
                  <div>What I know</div>
                  <div>{this.renderTeachableTopics()}</div>
                </div>
                <div>
                  <div>What I want to know</div>
                  <div>{this.renderLearnableTopics()}</div>
                </div>
                <button onClick={this.goToEditState}>Edit topics</button>
                <div>
                  Stats: total requests made, total matches made, user since
                </div>
              </div>
              <button onClick={this.handleLogOut}>Log out</button>
            </div>
          </CSSTransition>

          <CSSTransition
            in={this.state.appState === "EDIT"}
            classNames="fade"
            timeout={1000}
            unmountOnExit={true}
          >
            <div>
              <ModeSwitcher
                mode={this.state.editMode}
                onClick={this.toggleEditMode}
              />
              <div>Select topics below to add them</div>
              <button onClick={this.goToViewState}>Go back</button>
              <AlphaTopicList
                mode={this.state.editMode}
                onTopicClick={this.handleTopicSelection}
                onReset={this.handleReset}
                selectedTopics={
                  this.state.editMode === "TEACH"
                    ? this.state.selectedToTeach
                    : this.state.selectedToLearn
                }
              />
            </div>
          </CSSTransition>
        </div>
      );
    } else {
      return <div>You've been logged out, please sign in again!</div>;
    }
  }

  private goToEditState = () => {
    this.setState({
      appState: "EDIT"
    });
  };

  private goToViewState = () => {
    this.setState({
      appState: "VIEW"
    });
  };

  private handleLogOut = () => {
    CurrentUser.signOut();

    this.props.history.push("/");
  };

  private handleReset = () => {
    console.log("Reset");
  };

  private handleTopicSelection = (topic: string) => {
    // add this topic if it wasn't already there; remove it if it was
    this.setState(
      prevState => {
        if (prevState.editMode === "TEACH") {
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
      },
      () => {
        this.updateUser({
          learn: this.state.selectedToLearn,
          teach: this.state.selectedToTeach
        });
      }
    );
  };

  private handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      enteredUsername: e.currentTarget.value.trim().replace(/[^a-z0-9]/gi, "")
    });
  };

  private toggleEditMode = () => {
    this.setState(prevState => {
      return {
        editMode: prevState.editMode === "TEACH" ? "LEARN" : "TEACH"
      };
    });
  };

  private updateUser = (data: any) => {
    this.setState({ canInteract: false }, () => {
      axios
        .patch(
          new URL("/user/" + CurrentUser.getId() + "/", serverUrl).toString(),
          data,
          {
            headers: {
              authorization: "bearer " + CurrentUser.getToken()
            }
          }
        )
        .then(response => {
          this.setState({
            userData: response.data
          });
        })
        .catch(err => {
          console.log("Unable to update user for some reason");
        })
        .finally(() => {
          this.setState({
            canInteract: true
          });
          this.forceUpdate();
        });
    });
  };

  private renderLearnableTopics = () => {
    if (!this.state.userData || !this.state.userData.learn) {
      return <div />;
    }

    return this.state.selectedToLearn.map(topic => {
      return (
        <div key={"topic-learn-" + topic}>
          <Topic name={topic} editable={false} />
        </div>
      );
    });
  };

  private renderTeachableTopics = () => {
    if (!this.state.userData || !this.state.userData.teach) {
      return <div />;
    }

    return this.state.selectedToTeach.map(topic => {
      return (
        <div key={"topic-teach-" + topic}>
          <Topic name={topic} editable={true} />
        </div>
      );
    });
  };
}
