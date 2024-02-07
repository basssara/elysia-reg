import { IUser } from "./user.interface";

export interface ResponseMessage {
  status: number;
  success: boolean;
  message: string;
  data?: IUser | any;
  access_token?: string;
  refresh_token?: string;
}
