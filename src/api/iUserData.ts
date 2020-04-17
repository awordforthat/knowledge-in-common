import { ITopic } from "./iTopic";

export interface IUserData {
  authToken: string;
  userName?: string;
  email: string;
  learn?: ITopic[];
  teach?: ITopic[];
}
