import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

export class AboutPage extends React.Component<RouteComponentProps, {}> {
  public render() {
    return <div>About me!</div>;
  }
}

export const About = withRouter(AboutPage);
