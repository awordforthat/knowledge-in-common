import * as React from "react";
import { RouteComponentProps } from "react-router";

export class Contact extends React.Component<RouteComponentProps, {}> {
  constructor(props: RouteComponentProps) {
    super(props);
  }

  public render() {
    return <div>Contact</div>;
  }
}
