import * as React from "react";

import "../css/topic.css";

interface ITopicProps {
  name: string;
  editable: boolean;
}
export class Topic extends React.Component<ITopicProps, {}> {
  constructor(props: ITopicProps) {
    super(props);
  }

  public render() {
    return (
      <div className="topic rounded center-contents">
        <div>{this.props.name}</div>
      </div>
    );
  }
}
