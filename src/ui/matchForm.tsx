import * as React from "react";
import { IMatch } from "../api/iMatch";

import "../css/matchForm.css";

interface IMatchFormProps {
  match: IMatch;
  mode: "TEACH" | "LEARN";
  onSubmit: (noteText: string) => void;
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
      <div id="match-form">
        <div className="underline" />
        <div id="q1" className="question">
          <label htmlFor="text-q1">
            {this.props.mode === "TEACH"
              ? "What's your background in " + this.props.match.topic + "?"
              : "What do you want to know about " +
                this.props.match.topic +
                "?"}
          </label>

          <div className="response-container">
            <div className="text-field-container">
              <textarea
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
            <label htmlFor="text-q2">
              What's your skill level in {this.props.match.topic}?
            </label>
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
          <label htmlFor="text-q3">
            Anything else you want {this.props.match.username} to know?
          </label>
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
        <button className="cta rounded">Submit</button>
      </div>
    );
  }

  private setKnowledge = (level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED") => {
    this.setState({
      knowledgeLevel: level,
      q3text: ""
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
