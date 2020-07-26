import * as React from "react";
import axios from "axios";

import { RouteComponentProps } from "react-router";
import { CSSTransition } from "react-transition-group";

import { CurrentUser } from "../user";
import { isValidEmail } from "../utils";
import { TextArea } from "../ui/textArea";
import { serverUrl } from "..";

import "../css/global.css";
import "../css/contact.css";

interface IContactFormState {
  email: string;
  error: string | null;
  subject: string;
  message: string;
  processing: boolean;
  submitted: boolean;
}

const subjects: string[] = [
  "Suggest a topic",
  "Reset password",
  "Report a bug",
  "Request tech support",
  "Say hello!",
  "Other",
];
export class Contact extends React.Component<
  RouteComponentProps,
  IContactFormState
> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      email: CurrentUser.isLoggedIn() ? CurrentUser.getEmail() : "",
      error: null,
      message: "",
      processing: false,
      subject: subjects[0],
      submitted: false,
    };
  }

  public render() {
    return (
      <div id="contact-page">
        <CSSTransition
          in={!this.state.submitted}
          classNames="fade"
          timeout={500}
          unmountOnExit={true}
        >
          <React.Fragment>
            <div className="header">Say hello</div>
            <div id="form-container">
              <form onSubmit={this.handleSubmit}>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input
                    id="email"
                    value={this.state.email}
                    onChange={this.handleEmailUpdate}
                  />
                </div>
                <div>
                  <label htmlFor="category">Category:</label>
                  <select id="category" onChange={this.handleSubjectChange}>
                    {subjects.map((subject) => {
                      return <option value={subject}>{subject}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label htmlFor="notes">How can we help?</label>
                  <TextArea
                    id="notes"
                    charLimit={750}
                    onChange={this.handleMessageChange}
                  />
                </div>

                <CSSTransition
                  in={this.state.error !== null}
                  classNames="fade"
                  timeout={500}
                >
                  <div>{this.state.error}</div>
                </CSSTransition>
                <div onClick={this.handleSubmitNotification}>
                  <label htmlFor="submit" />
                  <input
                    id="submit-button"
                    className={
                      this.canSubmit() ? "cta rounded" : "cta rounded disabled"
                    }
                    disabled={!this.canSubmit() || this.state.submitted}
                    type="submit"
                    value="submit"
                  />
                </div>
              </form>
            </div>
          </React.Fragment>
        </CSSTransition>
        <CSSTransition
          in={this.state.submitted}
          classNames="fade"
          timeout={500}
          unmountOnExit={true}
        >
          <div id="submission-success" className="center-contents">
            <div id="submission-text">
              Thanks for your note! Someone will be in touch shortly.
            </div>
          </div>
        </CSSTransition>
      </div>
    );
  }

  private canSubmit = (): boolean => {
    return isValidEmail(this.state.email) && this.state.message.length > 0;
  };

  private handleEmailUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {
        email: e.currentTarget.value,
      },
      () => {
        if (this.state.error !== null) {
          if (isValidEmail(this.state.email)) {
            this.setState({
              error: null,
            });
          }
        }
      }
    );
  };

  private handleMessageChange = (text: string) => {
    this.setState(
      {
        message: text,
      },
      () => {
        if (this.state.error !== null) {
          if (this.canSubmit()) {
            this.setState({
              error: null,
            });
          }
        }
      }
    );
  };

  private handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      subject: e.currentTarget.value,
    });
  };

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (this.state.processing) {
      return;
    }

    this.setState(
      {
        processing: true,
      },
      () => {
        axios
          .post(serverUrl + "/contactX", {
            id: CurrentUser.getId(),
            userEmail: CurrentUser.getEmail(),
            responseEmail: this.state.email,
            subject: this.state.subject,
            body: this.state.message,
          })
          .then((result) => {
            this.setState({
              submitted: true,
              processing: false,
            });
          })
          .catch((err) => {
            this.setState({
              error: "Email failed to send. Please try again.",
              processing: false,
            });
          });
      }
    );
  };

  private handleSubmitNotification = (e: React.MouseEvent) => {
    if (this.canSubmit()) {
      return;
    }
    if (!isValidEmail(this.state.email)) {
      this.setState({ error: "Please enter a valid email address" });
    } else if (this.state.message.length === 0) {
      this.setState({ error: "You haven't said anything yet!" });
    }
  };
}
