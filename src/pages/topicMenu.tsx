import * as React from "react";
import axios from "axios";
import auth0Client from "../auth";
import { IUserData } from "../api/iUserData";
import { CSSTransition } from "react-transition-group";
import { dataExists } from "../helpers";
import { Footer } from "../ui/footer";
import "../css/transitions.css";

interface ITopicMenuState {
  enableSubmit: boolean;
  userData: IUserData | undefined;
  showUsernamePopup: boolean;
  typedName: string;
}

export class TopicMenu extends React.Component<{}, ITopicMenuState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      enableSubmit: true,
      userData: undefined,
      showUsernamePopup: false,
      typedName: ""
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8081/user/" + auth0Client.getIdToken()) //auth0Client.getIdToken()
      .catch(reason => {
        // if we don't recognize this user, try to set a username for them and then create them
        this.setState({ showUsernamePopup: true });
      })
      .then(value => {
        if (value) {
          this.setState({
            userData: this.parseUserData(value.data)
          });
        }
      });
  }

  public render() {
    if (auth0Client.isAuthenticated()) {
      return (
        <div>
          <CSSTransition
            in={this.state.showUsernamePopup}
            timeout={1000}
            classNames="fade"
            unmountOnExit={true}
          >
            <div>
              <div>Hey there stranger! What's your name?</div>
              <div>This is the name that will be shown to your matches.</div>

              <input
                type="text"
                id="name"
                name="name"
                onChange={this.handleNicknameUpdate}
              />
              <button onClick={this.handleSubmitUsername}>Submit</button>
              <button onClick={this.handleDeclineUsername}>
                Skip Username
              </button>
            </div>
          </CSSTransition>
          <CSSTransition
            in={dataExists(this.state.userData)}
            classNames="fade"
            timeout={100}
          >
            <div>
              {this.state.userData && this.state.userData.userName
                ? "Hey there, " + this.state.userData.userName + "!"
                : "Hey there!"}
            </div>
          </CSSTransition>
          <Footer />
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

  private handleSubmitUsername = () => {
    if (!auth0Client.isAuthenticated) {
      return;
    }

    axios
      .post("http://localhost:8081/user", {
        authToken: auth0Client.getIdToken(),
        userName: this.state.typedName,
        email: auth0Client.getProfile()!.name
      })
      .catch(err => {
        console.log("Failed to create user");
      })
      .then(res => {
        this.setState({
          showUsernamePopup: false,
          userData: {
            authToken: (res as any).data!.user.authToken,
            email: (res as any).data.user.email,
            userName: (res as any).data.user.userName
              ? (res as any).data.user.userName
              : undefined
          }
        });
      });
  };

  private handleDeclineUsername = () => {
    axios
      .post("http://localhost:8081/user", {
        authToken: auth0Client.getIdToken(),
        email: "someone@something.com"
      })
      .catch(err => {
        console.log("Failed to create user");
      })
      .then(value => {
        this.setState({
          showUsernamePopup: false
        });
      });
  };

  private handleNicknameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      typedName: e.currentTarget.value
    });
  };

  private parseUserData(data: any): IUserData {
    return {
      authToken: data.authToken,
      email: data.email,
      userName: data.userName ? data.userName : undefined
    };
  }
}
