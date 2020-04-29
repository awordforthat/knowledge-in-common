import * as React from "react";
import { dataExists } from "../helpers";
import { Footer } from "../ui/footer";
import "../css/transitions.css";
import axios from "axios";
import { serverUrl } from "..";
import { CurrentUser } from "../css/user";

interface ITopicMenuState {
  loading: boolean;
}

export class TopicMenu extends React.Component<{}, ITopicMenuState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loading: true
    };
  }

  public componentDidMount() {
    axios
      .get(serverUrl + "/user", {
        headers: {
          authorization: "bearer " + CurrentUser.getToken()
        },
        data: {
          id: CurrentUser.getId()
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        console.log("Done?");
        this.setState({
          loading: false
        });
      });
  }

  public render() {
    if (dataExists(window.localStorage["authToken"])) {
      return (
        <div>
          {this.state.loading ? <div>"Loading..."</div> : <div />}
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
