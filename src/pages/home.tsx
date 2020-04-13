import * as React from "react";
import axios from "axios";
import { ITopic } from "../api/iTopic";
import auth0Client from "../auth";
import { RequestPage } from "./request";

interface IHomeState {
  topics: ITopic[];
}

export class Home extends React.Component<{}, IHomeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      topics: []
    };
  }

  async componentDidMount() {
    const topics = (await axios.get("http://localhost:8081/")).data;
    this.setState({
      topics
    });
  }
  public render() {
    if (auth0Client.isAuthenticated()) {
      return (
        <RequestPage
          isAuthenticated={auth0Client.isAuthenticated()}
          userId={"temp-string"}
        />
      );
    }

    return (
      <div>
        Home page
        <section>Hero</section>
        <section>About</section>
        <section>Explore</section>
      </div>
    );
  }
}
