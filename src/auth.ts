import auth0 from "auth0-js";

interface IUserProfile {
  name: string;
  id: number;
}

class Auth {
  private auth0: auth0.WebAuth;
  private idToken: string | null | undefined;
  private expiresAt: number | null | undefined;
  private profile: IUserProfile | null | undefined;

  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: "dev-1owvbktc.auth0.com",
      audience: "https://dev-1owvbktc.auth0.com/userinfo",
      clientID: "s7IeBAB7VpE6Dp8Ja1NO1rmUEcfAA7pT",
      redirectUri: "http://localhost:3000/callback",
      responseType: "id_token",
      scope: "openid profile"
    });

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  isAuthenticated() {
    return (
      this.expiresAt !== undefined &&
      this.expiresAt !== null &&
      new Date().getTime() < this.expiresAt
    );
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload as IUserProfile;
        console.log(authResult);
        // set the time that the id token will expire at
        this.expiresAt = authResult.idTokenPayload.exp * 1000;
        resolve();
      });
    });
  }
  signOut() {
    // clear id token, profile, and expiration
    this.idToken = null;
    this.profile = null;
    this.expiresAt = null;
  }
}

const auth0Client = new Auth();

export default auth0Client;
