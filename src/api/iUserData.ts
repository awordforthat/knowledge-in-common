import { ITopic } from "./iTopic";

export interface IUserData {
  email: string;
  userName?: string;
  learn?: ITopic[];
  teach?: ITopic[];
}
