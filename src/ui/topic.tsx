import * as React from "react";

import "../css/topic.css";
import "../css/transitions.css";

interface ITopicProps {
  name: string;
  editable: boolean;
  onClick?: (topicName: string) => void;
  onRemove?: (topicName: string) => void;
}

interface ITopicState {
  showRemoveDialog: boolean;
}
export class Topic extends React.Component<ITopicProps, ITopicState> {
  constructor(props: ITopicProps) {
    super(props);
  }

  public render() {
    return (
      <div className="topic-container" onPointerUp={this.handleClick}>
        <div className="topic rounded center-contents topic-item">
          <div>{this.props.name}</div>
        </div>
      </div>
    );
  }

  private handleClick = (e: React.PointerEvent) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.name);
    }
  };
}
