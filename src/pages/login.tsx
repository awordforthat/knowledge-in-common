import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import "../css/login.css";
import { CSSTransition } from "react-transition-group";

export type LoginType = "SIGN_IN" | "SIGN_UP";

interface ILoginProps extends RouteComponentProps {
  onCancel: () => void;
  onSuccess: () => void;
  initialLoginType: LoginType;
}
interface ILoginState {
  loginType: LoginType;
  userName: string;
}

class Login extends React.Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      loginType: this.props.initialLoginType,
      userName: ""
    };
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
            <div className="header">Hi there</div>
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
                />
              </div>
              <div className="input-field">
                <label htmlFor="password-input">Password:</label>
                <input type="password" name="password-input" />
              </div>
              <CSSTransition
                in={this.state.loginType === "SIGN_UP"}
                className={"input-field vertical-squish"}
                timeout={500}
                unmountOnExit={true}
              >
                <div>
                  <label htmlFor="password-verify-input">Password:</label>
                  <input type="password" name="password-verify-input" />
                </div>
              </CSSTransition>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleClick = (e: React.MouseEvent) => {
    this.props.onCancel();
  };

  private handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Click on child");
  };

  private handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
}

export const LoginPanel = withRouter(Login);
