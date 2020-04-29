import * as React from "react";
import axios from "axios";

import { RouteComponentProps, withRouter } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { CurrentUser } from "../css/user";

import "../css/login.css";
import "../css/transitions.css";
import { dataExists } from "../helpers";
import { serverUrl } from "..";

export type LoginType = "LOG_IN" | "SIGN_UP";

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
  error: string | undefined;
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
      submitting: false,
      error: undefined
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
      <div
        id="login-wrapper"
        className="login"
        onClick={this.handleClick}
        onKeyDown={this.handleEnter}
      >
        <div
          id="login-panel"
          className="panel shadow rounded"
          onClick={this.handlePanelClick}
        >
          <div>
            <div className="header">Hi there!</div>
            <div className="login-type-container">
              <div
                onClick={this.setLoginTypeLogIn}
                className={
                  this.state.loginType === "LOG_IN"
                    ? "login-type active  center-contents"
                    : "login-type  center-contents"
                }
              >
                LOG IN
              </div>
              <div
                onClick={this.setLoginTypeSignUp}
                className={
                  this.state.loginType === "SIGN_UP"
                    ? "login-type active  center-contents"
                    : "login-type  center-contents"
                }
              >
                SIGN UP
              </div>
            </div>
            <div>
              <CSSTransition
                in={dataExists(this.state.error)}
                classNames={"vertical-squish"}
                timeout={500}
              >
                <div className="error-field center-contents">
                  {this.state.error ? this.state.error : ""}
                </div>
              </CSSTransition>
            </div>
            <div className="input-fields">
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
                classNames={"vertical-squish"}
                timeout={500}
                unmountOnExit={true}
              >
                <div className="input-field">
                  <label htmlFor="password-verify-input">
                    Verify password:
                  </label>
                  <input
                    type="password"
                    name="password-verify-input"
                    onChange={this.handleRepeatPasswordUpdate}
                  />
                </div>
              </CSSTransition>

              <CSSTransition
                in={this.state.loginType === "SIGN_UP"}
                classNames={"vertical-squish"}
                timeout={500}
                unmountOnExit={true}
              >
                <div className="input-field">
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
      if (prevState.submitting) {
        submit = false;
      } else if (prevState.loginType === "LOG_IN") {
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

  private handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && this.state.canSubmit) {
      this.handleSubmit();
    }
  };

  private handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  private handlePasswordUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {
        password: e.currentTarget.value
      },
      () => {
        if (this.state.loginType === "SIGN_UP") {
          if (
            this.state.repeatPassword !== "" &&
            this.state.password !== this.state.repeatPassword
          ) {
            this.setState({
              error: "Passwords do not match"
            });
          } else {
            this.setState({
              error: undefined
            });
          }
        }
        this.evaluateCanSubmit();
      }
    );
  };

  private handleRepeatPasswordUpdate = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState(
      {
        repeatPassword: e.currentTarget.value
      },
      () => {
        if (this.state.loginType === "SIGN_UP") {
          if (
            this.state.repeatPassword !== "" &&
            this.state.password !== this.state.repeatPassword
          ) {
            this.setState({
              error: "Passwords do not match"
            });
          } else {
            this.setState({
              error: undefined
            });
          }
        }
        this.evaluateCanSubmit();
      }
    );
  };

  private handleSubmit = () => {
    if (this.state.submitting) {
      return;
    }
    this.setState({
      submitting: true
    });
    axios.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";

    if (this.state.loginType === "LOG_IN") {
      axios
        .post(serverUrl + "/login", {
          email: this.state.email.replace(/\s/g, ""),
          password: this.state.password
        })
        .then(res => {
          CurrentUser.signIn(
            res.data.token,
            res.data.id,
            res.data.username,
            res.data.email
          );

          this.props.onSuccess();
          this.setState({
            error: undefined
          });
        })
        .catch(err => {
          console.log(err.message);
          this.setState({
            error:
              err && err.response
                ? err.response.status === 401
                  ? "Unrecognized email or password"
                  : err.message
                : "" + err
          });
        })
        .finally(() => {
          this.setState({ submitting: false });
        });
    } else {
      axios
        .put(serverUrl + "/user", {
          email: this.state.email.replace(/\s/g, ""),
          password: this.state.password,
          username: this.state.userName
        })
        .then(res => {
          CurrentUser.signIn(
            res.data.token,
            res.data.id,
            res.data.username,
            res.data.email
          );
          this.setState({
            error: undefined
          });
          this.props.onSuccess();
        })
        .catch(err => {
          console.log(err.message);
          this.setState({
            error:
              err & err.response
                ? err.response.status === 401
                  ? "User already exists"
                  : err.message
                : "" + err
          });
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
      this.evaluateCanSubmit
    );
  };

  private reset = () => {
    this.setState({
      canSubmit: false,
      loginType: this.props.initialLoginType,
      userName: "",
      email: "",
      password: "",
      repeatPassword: "",
      error: undefined
    });
  };

  private setLoginTypeLogIn = () => {
    this.setState({
      loginType: "LOG_IN",
      error: undefined
    });
  };

  private setLoginTypeSignUp = () => {
    this.setState({
      loginType: "SIGN_UP",
      error: undefined
    });
  };
}

export const LoginPanel = withRouter(Login);
