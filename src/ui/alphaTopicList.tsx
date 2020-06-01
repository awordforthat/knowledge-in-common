import * as React from "react";
import classnames from "classnames";
import axios from "axios";

import { ITopic } from "../api/iTopic";
import { Topic } from "./topic";
import { serverUrl } from "..";

import "../css/ui/alphaTopicList.css";

interface IAlphaTopicListProps {
  mode: "TEACH" | "LEARN";
  onTopicClick: (topic: string) => void;
  onReset: () => void;
  selectedTopics: string[];
}

interface IAlphaTopicListState {
  alphaTopics?: any;
}

const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

export class AlphaTopicList extends React.Component<
  IAlphaTopicListProps,
  IAlphaTopicListState
> {
  constructor(props: IAlphaTopicListProps) {
    super(props);
    this.state = {};
  }

  public componentWillMount() {
    // retrieve topics
    axios
      .get(serverUrl + "/topic")
      .then(res => {
        let topics: ITopic[] = res.data.data;

        this.setState({
          alphaTopics: this.groupTopics(topics)
        });
      })
      .catch(err => {
        console.log(err);
        console.log("Failed to get topics");
      });
  }

  public render() {
    return (
      <div>
        <div>{this.renderTopics()}</div>
        <div id="action-buttons">
          <div
            id="reset-button"
            className="action-button center-contents"
            onClick={this.props.onReset}
          >
            <img src="./img/reset.png" width={50} />
          </div>
          <div id="search-button" className="action-button center-contents">
            <img src="./img/search.png" width={50} />
          </div>
        </div>
      </div>
    );
  }

  private renderTopics = () => {
    if (!this.state.alphaTopics) {
      return <div />;
    }

    const topicContents = Object.keys(this.state.alphaTopics).map(letter => {
      const letterContents: ITopic[] = this.state.alphaTopics[letter].filter(
        (topic: ITopic) => {
          let inMode;
          // future me: these are intentionally backwards.
          // if the user wants to learn a topic, it has to be teachable;
          // if they want to teach a topic, it has to be learnable
          if (this.props.mode === "TEACH") {
            inMode = topic.learnable;
          } else if (this.props.mode === "LEARN") {
            inMode = topic.teachable;
          }
          return topic.name.substr(0, 1) === letter && inMode;
        }
      );

      return (
        <div
          className="alpha-section center-contents"
          key={"alpha-section-" + letter}
        >
          <div className={"topic-alpha-header center-contents"}>
            {letter}
            <div className="underline" />
          </div>
          <div className="topics">
            {letterContents.map((topic: ITopic, letterIndex: number) => {
              const topicClasses = classnames({
                "bank-item": true,
                "selected-teach":
                  this.props.mode === "TEACH" &&
                  this.props.selectedTopics.indexOf(topic.name) !== -1,
                "selected-learn":
                  this.props.mode === "LEARN" &&
                  this.props.selectedTopics.indexOf(topic.name) !== -1
              });
              return (
                <div
                  key={"topic-" + letter + "-" + letterIndex}
                  className={topicClasses}
                >
                  <Topic
                    name={topic.name}
                    editable={false}
                    onClick={this.handleTopicSelection}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    });

    return <div className="topic-bank center-contents">{topicContents}</div>;
  };

  private groupTopics(topics: ITopic[]): ITopic[] {
    // this method a good candidate for optimization

    let alphaTopics: any = {};
    letters.forEach(letter => {
      alphaTopics[letter] = topics.filter(topic => {
        return topic.name.substr(0, 1).toLowerCase() === letter;
      });
    });
    return alphaTopics;
  }

  private handleTopicSelection = (topic: string) => {
    this.props.onTopicClick(topic);
  };
}
