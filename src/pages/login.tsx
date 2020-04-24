import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import "../css/login.css";
import { CSSTransition } from "react-transition-group";
import axios from "axios";

export type LoginType = "SIGN_IN" | "SIGN_UP";

interface ILoginProps extends RouteComponentProps {
  onCancel: () => void;
  onSuccess: () => void;
  initialLoginType: LoginType;
}
interface ILoginState {
  canSubmit: boolean;
  loginType: LoginType;
  email: string;
  userName: string;
  password: string;
  repeatPassword: string;
  submitting: boolean;
}

class Login extends React.Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      canSubmit: false,
      loginType: this.props.initialLoginType,
      userName: "",
      email: "",
      password: "",
      repeatPassword: "",
      submitting: false
    };
  }

  public componentDidMount() {
    this.reset();
  }

  public componentWillUnmount() {
    this.reset();
  }

  public render() {
    return (
      <div id="login-wrapper" className="login" onClick={this.handleClick}>
        <div
          id="login-panel"
          className="panel shadow rounded"
          onClick={this.handlePanelClick}
        >
          <div>
            <div className="header">Hi there!</div>
            <div className="input-fields">
              <CSSTransition
                in={this.state.loginType === "SIGN_UP"}
                className={"input-field vertical-squish"}
                timeout={500}
                unmountOnExit={true}
              >
                <div>
                  <label htmlFor="username-input">
                    What should we call you?
                  </label>
                  <input
                    type="text"
                    name="username-input"
                    placeholder={"This name will be shown to your matches"}
                    onChange={this.handleUsernameChange}
                  />
                </div>
              </CSSTransition>
              <div className="input-field">
                <label htmlFor="email-input">Email:</label>
                <input
                  type="text"
                  name="email-input"
                  pattern='@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,})+)$""'
                  onChange={this.handleEmailUpdate}
                />
              </div>
              <div className="input-field">
                <label htmlFor="password-input">Password:</label>
                <input
                  type="password"
                  name="password-input"
                  onChange={this.handlePasswordUpdate}
                />
              </div>
              <CSSTransition
                in={this.state.loginType === "SIGN_UP"}
                className={"input-field vertical-squish"}
                timeout={500}
                unmountOnExit={true}
              >
                <div>
                  <label htmlFor="password-verify-input">
                    Repeat password:
                  </label>
                  <input
                    type="password"
                    name="password-verify-input"
                    onChange={this.handleRepeatPasswordUpdate}
                  />
                </div>
              </CSSTransition>
            </div>
          </div>
          <div className="buttons">
            <div
              className={
                this.state.canSubmit
                  ? "submit button center-contents cta rounded"
                  : "submit button center-contents cta rounded disabled"
              }
              onClick={this.handleSubmit}
            >
              Submit
            </div>
            <div
              className={"cancel button center-contents rounded"}
              onClick={this.handleCancel}
            >
              Cancel
            </div>
          </div>
        </div>
      </div>
    );
  }

  private evaluateCanSubmit = () => [
    this.setState(prevState => {
      let submit = false;
      if (prevState.loginType === "SIGN_IN") {
        submit = prevState.email !== "" && prevState.password !== "";
      } else {
        submit =
          prevState.email !== "" &&
          prevState.password !== "" &&
          prevState.userName !== "" &&
          prevState.repeatPassword !== "" &&
          prevState.password === prevState.repeatPassword;
      }
      return {
        canSubmit: submit
      };
    })
  ];

  private handleCancel = () => {
    if (this.state.submitting) {
      return;
    }
    this.props.onCancel();
  };

  private handleClick = (e: React.MouseEvent) => {
    if (this.state.submitting) {
      return;
    }
    this.props.onCancel();
  };

  private handleEmailUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {
        email: e.currentTarget.value
      },
      this.evaluateCanSubmit
    );
  };
  private handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  private handlePasswordUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {
        password: e.currentTarget.value
      },
      this.evaluateCanSubmit
    );
  };

  private handleRepeatPasswordUpdate = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState(
      {
        repeatPassword: e.currentTarget.value
      },
      this.evaluateCanSubmit
    );
  };

  private handleSubmit = () => {
    if (this.state.submitting) {
      return;
    }
    this.setState({
      submitting: true
    });

    if (this.state.loginType === "SIGN_IN") {
      axios
        .post("http://localhost:8081/login", {
          email: this.state.email,
          password: this.state.password
        })
        .then(res => {
          console.log(res);
          window.localStorage["authToken"] = res.data.token;
          window.localStorage["username"] = res.data.user.username;
          console.log(window.localStorage["username"]);
          this.props.onSuccess();
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ submitting: false });
        });
    } else {
      axios
        .put("http://localhost:8081/user", {
          email: this.state.email,
          password: this.state.password,
          username: this.state.userName
        })
        .then(res => {
          window.localStorage["authToken"] = res.data.token;
          window.localStorage["id"] = res.data.user._id;
          window.localStorage["username"] = res.data.user.username;
          this.props.onSuccess();
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ submitting: false });
        });
    }
  };

  private handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {
        userName: e.currentTarget.value
      },
      () => {
        this.evaluateCanSubmit();
      }
    );
  };

  private reset = () => {
    this.setState({
      canSubmit: false,
      loginType: this.props.initialLoginType,
      userName: "",
      email: "",
      password: "",
      repeatPassword: ""
    });
  };
}

export const LoginPanel = withRouter(Login);
