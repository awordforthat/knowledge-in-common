import * as React from "react";
import { dataExists } from "../helpers";
import { Footer } from "../ui/footer";
import "../css/transitions.css";

interface ITopicMenuState {
  something: boolean;
}

export class TopicMenu extends React.Component<{}, ITopicMenuState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      something: true
    };
  }

  public render() {
    console.log(window.localStorage["username"]);
    if (dataExists(window.localStorage["authToken"])) {
      return (
        <div>
          hey there
          {window.localStorage["username"] !== "undefined" &&
          window.localStorage["username"] !== "null"
            ? ", " + window.localStorage["username"] + "!"
            : "!"}
        </div>
      );
    } else {
      return (
        <div>
          <div>You've been signed out. Please sign in again.</div>
          <Footer />
        </div>
      );
    }
  }
}
