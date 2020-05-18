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
      q3text: ""
    };
  }
  public render() {
    if (!this.props.match) {
      return <div />;
    }
    return (
      <div id="match-form">
        <div id="q1">
          <label htmlFor="text-q1">
            {this.props.mode === "TEACH"
              ? "What's your background in " + this.props.match.topic + "?"
              : "What do you want to know about " +
                this.props.match.topic +
                "?"}
          </label>
          <div>
            <textarea id="text-q1" />
          </div>
        </div>
        <div id="q2">
          <label htmlFor="text-q2">
            What's your skill level in {this.props.match.topic}?
          </label>
          <input
            type="radio"
            id="radio-beginner"
            onClick={() => {
              this.setKnowledge("BEGINNER");
            }}
            checked={this.state.knowledgeLevel === "BEGINNER"}
          />
          <label htmlFor="radio-beginner">Beginner</label>
          <input
            type="radio"
            id="radio-intermediate"
            checked={this.state.knowledgeLevel === "INTERMEDIATE"}
            onClick={() => {
              this.setKnowledge("INTERMEDIATE");
            }}
          />
          <label htmlFor="radio-beginner">Intermediate</label>
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
        <div id="q3">
          <label htmlFor="text-q3">
            Anything else you want {this.props.match.username} to know?
          </label>
          <textarea
            id="text-q3"
            onChange={this.setTextQ3}
            value={this.state.q3text}
          />
          <div>
            {this.state.q3text.length} / {this.q3CharLimit}
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

  private setTextQ3 = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      q3text: e.currentTarget.value.substr(0, this.q3CharLimit)
    });
  };
}
