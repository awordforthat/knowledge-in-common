import * as React from "react";

import "../css/topic.css";

interface ITopicProps {
  name: string;
  editable: boolean;
  onClick?: (topicName: string) => void;
}
export class Topic extends React.Component<ITopicProps, {}> {
  constructor(props: ITopicProps) {
    super(props);
  }

  public render() {
    return (
      <div
        className="topic rounded center-contents"
        onPointerUp={this.handleClick}
      >
        <div>{this.props.name}</div>
      </div>
    );
  }

  private handleClick = (e: React.PointerEvent) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.name);
    }
  };
}
