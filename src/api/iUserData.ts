import { IPendingMatch } from "./iMatch";

export interface IUserData {
  email: string;
  username?: string;
  learn?: string[];
  teach?: string[];
  pending: IPendingMatch[];
}
