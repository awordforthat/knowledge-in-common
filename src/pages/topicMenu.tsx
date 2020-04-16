import * as React from "react";
import axios from "axios";
import auth0Client from "../auth";
import { IUserData } from "../api/iUserData";
import { RouteComponentProps, withRouter } from "react-router";
import { CSSTransition } from "react-transition-group";

interface ITopicMenuState {
  enableSubmit: boolean;
  userData: IUserData | undefined;
  showUsernamePopup: boolean;
}

export class TopicMenu extends React.Component<{}, ITopicMenuState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      enableSubmit: true,
      userData: undefined,
      showUsernamePopup: false
    };
  }

  async componentDidMount() {
    const userData = await axios
      .get("http://localhost:8081/user/" + auth0Client.getIdToken())
      .catch(reason => {
        // if we don't recognize this user, try to set a username for them and then create them

        this.setState({ showUsernamePopup: true });
      })
      .then(value => {
        console.log(value);
      });
  }

  public render() {
    console.log(this.state.showUsernamePopup);
    if (auth0Client.isAuthenticated) {
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

              <input type="text" id="name" name="name" />
              <button onClick={this.handleSubmitUsername}>Submit</button>
              <button onClick={this.handleDeclineUsername}>
                Skip Username
              </button>
            </div>
          </CSSTransition>
        </div>
      );
    } else {
      return <div>You've been signed out. Please sign in again.</div>;
    }
  }

  private handleSubmitUsername = () => {
    const userData = axios
      .post("http://localhost:8081/addUser", {
        id: auth0Client.getIdToken,
        userName: "awordforthat",
        email: "someone@something.com"
      })
      .catch(err => {
        console.log("Failed to create user");
      })
      .then(value => {
        console.log("User successfully created");
        this.setState(
          {
            showUsernamePopup: false
          },
          () => {
            console.log("Promise was rejected");
          }
        );
      });
  };

  private handleDeclineUsername = () => {
    axios
      .post("http://localhost:8081/addUser", {
        id: auth0Client.getIdToken,
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
}
