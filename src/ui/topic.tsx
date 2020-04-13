import * as React from "react";
import { ITopic } from "../api/iTopic";

interface ITopicProps {
  data: ITopic;
  enabled: boolean;
  selected: boolean;
}
export class TopicField extends React.Component<ITopicProps, {}> {
  constructor(props: ITopicProps) {
    super(props);
  }

  public render() {
    return (
      <div>
        <div>{this.props.data.name}</div>
        <div>{this.props.data.category}</div>
      </div>
    );
  }
}
