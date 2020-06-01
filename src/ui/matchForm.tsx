import * as React from "react";
import { IMatch } from "../api/iMatch";

import "../css/matchForm.css";
import "../css/global.css";

export interface IMatchFormResponse {
  background: string;
  knowledgeLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  otherNotes: string;
}
interface IMatchFormProps {
  match: IMatch;
  mode: "TEACH" | "LEARN";
  onCancel: () => void;
  onSubmit: (response: IMatchFormResponse) => void;
}

interface IMatchFormState {
  canSubmit: boolean;
  knowledgeLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  q1text: string;
  q3text: string;
}
export class MatchForm extends React.Component<
  IMatchFormProps,
  IMatchFormState
> {
  private q1CharLimit: number = 250;
  private q3CharLimit: number = 250;
  constructor(props: IMatchFormProps) {
    super(props);
    this.state = {
      canSubmit: false,
      knowledgeLevel: "BEGINNER",
      q1text: "",
      q3text: ""
    };
  }
  public render() {
    if (!this.props.match) {
      return <div />;
    }
    return (
      <div id="match-form" className={this.props.mode.toLowerCase()}>
        <div className="underline" />
        <div id="q1" className="question">
          <div className="label">
            <label htmlFor="text-q1">
              {this.props.mode === "TEACH"
                ? "What's your background in " + this.props.match.topic + "?"
                : "What do you want to know about " +
                  this.props.match.topic +
                  "?"}
            </label>
          </div>

          <div className="response-container">
            <div className="text-field-container">
              <textarea
                autoFocus={true}
                id="text-q1"
                maxLength={this.q1CharLimit}
                value={this.state.q1text}
                onChange={this.setTextQ1}
              />
            </div>

            <div className="char-limit-counter">
              <div className="numerator">{this.state.q1text.length}</div>
              <div className="vinculum">/</div>
              <div className="denominator">{this.q1CharLimit}</div>
            </div>
          </div>
        </div>
        <div id="q2" className="question">
          <div>
            <div className="label">
              <label htmlFor="text-q2">
                What's your skill level in {this.props.match.topic}?
              </label>
            </div>
          </div>

          <div id="q2-radio-options" className="radio-option">
            <input
              type="radio"
              id="radio-beginner"
              onClick={() => {
                this.setKnowledge("BEGINNER");
              }}
              checked={this.state.knowledgeLevel === "BEGINNER"}
            />
            <label htmlFor="radio-beginner">Beginner</label>
          </div>

          <div className="radio-option">
            <input
              type="radio"
              id="radio-intermediate"
              checked={this.state.knowledgeLevel === "INTERMEDIATE"}
              onClick={() => {
                this.setKnowledge("INTERMEDIATE");
              }}
            />
            <label htmlFor="radio-beginner">Intermediate</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="radio-advanced"
              onClick={() => {
                this.setKnowledge("ADVANCED");
              }}
              checked={this.state.knowledgeLevel === "ADVANCED"}
            />
            <label htmlFor="radio-beginner">Advanced</label>
          </div>
        </div>
        <div id="q3" className="question">
          <div className="label">
            <label htmlFor="text-q3">
              Anything else you want{" "}
              <span
                className={"username" + " " + this.props.mode.toLowerCase()}
              >
                {this.props.match.username}
              </span>{" "}
              to know?
            </label>
          </div>
          <div className="response-container">
            <div className="text-field-container">
              <textarea
                id="text-q3"
                maxLength={this.q3CharLimit}
                value={this.state.q3text}
                onChange={this.setTextQ3}
              />
            </div>

            <div className="char-limit-counter">
              <div className="numerator">{this.state.q3text.length}</div>
              <div className="vinculum">/</div>
              <div className="denominator">{this.q3CharLimit}</div>
            </div>
          </div>
        </div>
        <div id="button-bank">
          <button
            disabled={!this.canSubmit()}
            className={
              this.canSubmit() ? "cta rounded" : "cta rounded disabled"
            }
            onClick={this.handleSubmit}
          >
            Submit
          </button>
          <button className={"cta rounded cancel"} onClick={this.handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  private canSubmit = (): boolean => {
    return this.state.q1text.length > 0 && this.state.q3text.length > 0;
  };

  private setKnowledge = (level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED") => {
    this.setState({
      knowledgeLevel: level
    });
  };

  private handleCancel = () => {
    this.setState(
      {
        q1text: "",
        q3text: "",
        knowledgeLevel: "BEGINNER"
      },
      () => {
        this.props.onCancel();
      }
    );
  };

  private handleSubmit = () => {
    this.props.onSubmit({
      background: this.state.q1text,
      knowledgeLevel: this.state.knowledgeLevel,
      otherNotes: this.state.q3text
    });
  };

  private setTextQ1 = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      q1text: e.currentTarget.value
    });
  };

  private setTextQ3 = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      q3text: e.currentTarget.value
    });
  };
}
