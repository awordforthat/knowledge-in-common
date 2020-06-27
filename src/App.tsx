import React from "react";
import { Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Account } from "./pages/account";
import { NavigationBar } from "./ui/navBar";
import "./index.css";
import "./reset.css";
import { About } from "./pages/about";
import { Connect } from "./pages/connect";
import { RequestComplete } from "./pages/requestComplete";
import { Contact } from "./pages/contact";
import { Footer } from "./ui/footer";

function App() {
  return (
    <div className="main">
      <NavigationBar />
      <Route exact path="/" component={Home} />
      <Route exact path="/connect" component={Connect} />
      <Route exact path="/complete" component={RequestComplete} />
      <Route exact path="/account" component={Account} />
      <Route exact path="/about" component={About} />
      <Route exact path="/contact" component={Contact} />
      <Footer/>
    </div>
  );
}

export default App;

/**
 *  <div id="body">
        <section id="service-info">
          <div className="title center-contents">Knowledge in Common</div>
          <div className="subtitle center-contents">
            Connecting people who know things
          </div>
          <div className="action-button">Start sharing knowledge</div>
        </section>
        <section id="user-info">000011111
          <div>I want to learn:</div>
          <div>I want to teach:</div>
        </section>
        <section id="learn-more">
          Knowledge in Common is a service that matches learners and teachers.
          Tell us what you know and what you want to know, and we'll connect you
          with people who can learn from you, and that you can learn from.
        </section>
      </div>
 */
//
