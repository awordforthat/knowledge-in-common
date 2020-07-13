import * as React from "react";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import "../css/global.scss";
import "../css/faqs.css";
import "../css/transitions.css";

interface IQuestionAnswer {
  question: string;
  answer: string;
}

interface IFaqObject {
  id: string;
  qaPair: IQuestionAnswer;
}

interface IFaqState {
  expanded: number[];
}

export class Faqs extends React.Component<{}, IFaqState> {
  private questionObjects: IFaqObject[] = [];

  constructor(props: {}) {
    super(props);
    this.state = {
      expanded: []
    };

    this.questionList.forEach((question: IQuestionAnswer, index: number) => {
      this.questionObjects.push({
        id: index.toString(),
        qaPair: question
      });
    });
  }

  questionList: IQuestionAnswer[] = [
    {
      question: "What is Knowledge in Common?",
      answer:
        "Knowledge in Common is a free service that connects people who want to learn things to people who want to teach things. " +
        "It operates on the principle that sharing knowledge is a Good Thing (tm). Creating an account helps you find people who " +
        " want to teach what you want to learn, and who want to learn what you can teach."
    },
    {
      question: "How does the process work?",
      answer:
        "First, you'll create an account to track your topics. Choose any number of topics that you want to teach and/or learn. " +
        " Then to request a match, visit the Connect page and select the topic or topics you want to search for. In the list of results, " +
        " choose one match to connect with. Add a few details about your experience with the topic in question, and submit your request. " +
        " An email will be sent to your match with the details you provide. If they decide it's a good match, they can accept it, at which point " +
        " both people get an email with the relevant contact details. After that, all that's left is to start sharing knowledge!"
    },
    {
      question: "How do I communicate with the people I find?",
      answer:
        "That's up to you! Once a match is made, an email will be sent to each of you with the other person's email address." +
        " Between the two of you, you'll figure out how you want to talk to each other and set up a time to chat. That could be over " +
        " email, over a messaging service like WhatsApp, over snail mail...whatever the two of you are comfortable with.  The goal is for future " +
        " versions of this site to offer chat functionality, but that's a little ways off."
    },
    {
      question: "Do I have to provide my personal email address?",
      answer:
        "You have to provide *an* email address. You should provide one that you're comfortable sharing with strangers. "
    },
    {
      question: "What if don't know enough teach anything?",
      answer:
        "That's fine! You're welcome to remain a perpetual student. However, you don't have to be an expert at something to share knowledge. " +
        " Be up-front with your matches about your skill level, but recognize that sometimes just sharing your experience can be helpful to someone " +
        " who is truly just starting out."
    },
    {
      question: "What if I can't find any matches for the topic I want?",
      answer:
        "That is definitely a limitation of the concept. The topic can remain in your account for as long as you want, but ultimately Knowledge in Common " +
        " is only as strong as its user base. You can help spread the word by telling your friends about us! Keep checking back, it's possible " +
        " that another interested person will appear in time."
    }
  ];

  public render() {
    return (
      <div id="faqs">
        <h1 className="header">Frequently Asked Questions</h1>
        <div className="underline-container center-contents">
          <div className="underline" />
        </div>
        <div id="question-bank">{this.renderQuestions()}</div>
        <div id="confused-container">
          Still confused? <Link to="/contact"> Send us a note </Link> and we'll
          try to help!
        </div>
      </div>
    );
  }

  private renderQuestions = () => {
    return (
      <ul>
        {this.questionObjects.map((question: IFaqObject, index: number) => {
          const expanded = this.state.expanded.indexOf(index) !== -1;
          return (
            <li className="fa-question" key={"qaPair-" + index}>
              <div
                id={question.id}
                className="question-container"
                onClick={this.toggleExpanded}
              >
                <div className={expanded ? "arrow down" : "arrow right"} />
                <div className="question">{question.qaPair.question}</div>
              </div>
              <div
                id={"answer-" + question.id}
                className={expanded ? "answer expanded" : "answer"}
              >
                {question.qaPair.answer}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  private collapseSection = (elem: HTMLDivElement) => {
    const sectionHeight = elem.scrollHeight;
    const transition = elem.style.transition;
    elem.style.transition = "";

    requestAnimationFrame(function() {
      elem.style.height = sectionHeight + "px";
      elem.style.transition = transition;

      requestAnimationFrame(function() {
        elem.style.height = 0 + "px";
      });
    });
  };

  private expandSection = (elem: HTMLDivElement) => {
    var sectionHeight = elem.scrollHeight;

    elem.style.height = sectionHeight + "px";

    const onTransitionEnd: (e: TransitionEvent) => void = (
      e: TransitionEvent
    ) => {
      elem.removeEventListener("transitionend", onTransitionEnd);

      elem.style.height = "null";
    };

    elem.addEventListener("transitionend", onTransitionEnd);
  };

  private toggleExpanded = (e: React.MouseEvent) => {
    const index = parseInt((e.currentTarget as HTMLDivElement).id, 10);

    if (isNaN(index)) {
      return;
    }

    const elem: HTMLElement | null = document.getElementById("answer-" + index);

    if (!elem) {
      return;
    }

    this.setState(prevState => {
      if (prevState.expanded.indexOf(index) === -1) {
        // currently hidden, expand
        prevState.expanded.push(index);
        this.expandSection(elem as HTMLDivElement);
        return {
          expanded: prevState.expanded
        };
      } else {
        // currently expanded, hide
        this.collapseSection(elem as HTMLDivElement);
        return {
          expanded: prevState.expanded.filter(value => {
            return value != index;
          })
        };
      }
    });
  };
}
