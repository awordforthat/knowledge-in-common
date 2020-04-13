import * as React from "react";
import axios from "axios";
import auth0Client from "../auth";
import { IUserData } from "../api/iUserData";

interface IRequestPageProps {
  isAuthenticated: boolean;
  userId: string;
}

interface IRequestPageState {
  enableSubmit: boolean;
  userData: IUserData | undefined;
}

export class RequestPage extends React.Component<
  IRequestPageProps,
  IRequestPageState
> {
  constructor(props: IRequestPageProps) {
    super(props);
    this.state = {
      enableSubmit: true,
      userData: undefined
    };
  }

  async componentDidMount() {
    const userData = await axios
      .get("http://localhost:8081/" + auth0Client.getIdToken())
      .catch(reason => {
        console.log(
          "There has been a server error. please try again. " + reason
        );
      })
      .then(value => {
        console.log(value);
      });
  }

  public render() {
    if (this.props.isAuthenticated) {
      if (this.state.userData) {
        return <div>Render user's data here</div>;
      } else {
        return <div>Please wait, gathering data....</div>;
      }
    } else {
      return <div>There has been an error. Please sign in again.</div>;
    }
  }
}
