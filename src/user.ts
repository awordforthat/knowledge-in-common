import { EventEmitter } from "events";

export class CurrentUser {
  public static emitter: EventEmitter = new EventEmitter();
  public constructor() {
    console.log(CurrentUser.emitter);
  }
  public static getId(): string {
    return window.localStorage["id"];
  }

  public static getUsername(): string {
    return window.localStorage["username"];
  }

  public static getEmail(): string {
    return window.localStorage["email"];
  }

  public static getToken(): string {
    return window.localStorage["authToken"];
  }

  public static signIn(
    auth: string,
    id: string,
    username: string,
    email: string
  ) {
    window.localStorage["authToken"] = auth;
    window.localStorage["id"] = id;
    window.localStorage["username"] = username;
    window.localStorage["email"] = email;
  }

  public static signOut() {
    window.localStorage["authToken"] = null;
    window.localStorage["id"] = null;
    window.localStorage["username"] = null;
    window.localStorage["email"] = null;
    CurrentUser.emitter.emit("logout");
  }

  public static isLoggedIn(): boolean {
    return (
      window.localStorage["authToken"] !== "null" &&
      window.localStorage["authToken"] !== undefined
    );
  }
}
