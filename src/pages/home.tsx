import * as React from "react";
import axios from "axios";
import { ITopic } from "../api/iTopic";
import auth0Client from "../auth";
import { TopicMenu } from "./topicMenu";

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
    const topics = (await axios.get("http://localhost:8081/topic")).data;
    this.setState({
      topics
    });
  }
  public render() {
  

    return (
      <div>
        Home page
        <section>
          Hero
          <button onClick={this.handleSignIn}>Sign in</button>
          <button onClick={this.handleSignUp}>Sign up</button>
        </section>
        <section>About</section>
        <section>
          <div>Explore</div>
          {this.renderTopics()}
        </section>
      </div>
    );
  }

  private handleSignIn = () => {
    //
  };
  private handleSignUp = () => {
    //
  };

  private renderTopics = () => {
    return this.state.topics.map(topic => {
      return (
        <div>
          Name: {topic.name} Category: {topic.category}
        </div>
      );
    });
  };
}
