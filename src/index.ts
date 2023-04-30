import "source-map-support/register"
import type { NextApiRequest, NextApiResponse } from "next";
import { status, type Status } from "./status";

export class ApiError<Message extends string> extends Error {
  constructor(public status: Status, message: Message) {
    super(message);
  }
}

export const JsonHandler = <ResponseBody>(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<ResponseBody> | ResponseBody) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // tell the client we are sending json
    res.setHeader("Content-Type", "application/json");

    try {
      // run the handler
      const data = await handler(req, res);

      // send the response
      res.json(data);

      // returned for the type inference
      return undefined as unknown as typeof data; 
    } catch (error) {
      // if the error is an ApiError, send the error message
      if (error instanceof ApiError) {
        const statusCode = status[error.status];
        if (!statusCode) {
          throw new Error(`Invalid error status: ${error.status}`)
        }
        const response = {
          error: error.message,
          status: error.status,
          code: statusCode
        } as const
        res.status(statusCode).json(response);
        return response;
      } else {
        throw error;
      }
    }
  };
};

export type GetResponse<Handler extends ReturnType<typeof JsonHandler>> = Awaited<ReturnType<Handler>>