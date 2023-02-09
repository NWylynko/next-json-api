import "source-map-support/register"
import { NextApiRequest, NextApiResponse } from "next";

export class ApiError<Message extends string> extends Error {
  constructor(public status: number, message: Message) {
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
      return data;
    } catch (error) {
      // if the error is an ApiError, send the error message
      if (error instanceof ApiError) {
        res.status(error.status).json({ error: error.message });
        return { error: error.message };
      } else {
        throw error;
      }
    }
  };
};