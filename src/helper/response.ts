import { Context } from "elysia";
import { ResponseMessage } from "../interfaces";

export class ApiResponse {
  private set: Context["set"];

  constructor(set: Context["set"]) {
    this.set = set;
  }

  public response(response: ResponseMessage): ResponseMessage {
    this.set.status = response.status;

    return {
      status: response.status,
      success: response.success,
      message: response.message,
      data: response?.data,
      access_token: response?.access_token,
      refresh_token: response?.refresh_token,
    };
  }
}
