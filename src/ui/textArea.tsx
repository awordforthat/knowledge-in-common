import * as React from "react";

import "../css/ui/textArea.css";

interface ITextAreaProps {
  id: string;
  charLimit: number;
  onChange: (text: string) => void;
}

interface ITextAreaState {
  text: string;
}
export class TextArea extends React.Component<ITextAreaProps, ITextAreaState> {
  constructor(props: ITextAreaProps) {
    super(props);
    this.state = {
      text: ""
    };
  }

  public render() {
    return (
      <div className="char-limited-text-field">
        <div className="text-field-container">
          <textarea
            id={this.props.id}
            autoFocus={true}
            maxLength={this.props.charLimit}
            value={this.state.text}
            onChange={this.setText}
          />
        </div>

        <div className="char-limit-counter">
          <div className="numerator">{this.state.text.length}</div>
          <div className="vinculum">/</div>
          <div className="denominator">{this.props.charLimit}</div>
        </div>
      </div>
    );
  }

  private setText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState(
      {
        text: e.currentTarget.value
      },
      () => {
        this.props.onChange(this.state.text);
      }
    );
  };
}
