import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

export class RequestComplete extends React.Component<RouteComponentProps, {}> {
  constructor(props: RouteComponentProps) {
    super(props);
  }

  public render() {
    return (
      <div>
        <div>Thanks for submitting your request!</div>
        <div>What happens next:</div>
        <div>
          An email was sent to the match you selected. They'll review the
          details you provided and decide whether this is a good fit or not. If
          they say yes, then you'll get an email with their contact information,
          and you can initiate the conversation! If they say no, you'll get a
          message informing you of that as well.
        </div>
        <div>
          If you don't hear from your match within 2 days, please let us know
          <Link to="/contact">here</Link>
        </div>
      </div>
    );
  }
}
