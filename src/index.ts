import "source-map-support/register"
import type { NextApiRequest, NextApiResponse } from "next";

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
      const response = { ...data, error: null } as const
      res.json(response);
      return response; // returned for the type inference (nextjs will ignore it)
    } catch (error) {
      // if the error is an ApiError, send the error message
      if (error instanceof ApiError) {
        const response = { error: error.message } as const
        res.status(error.status).json(response);
        return response;
      } else {
        throw error;
      }
    }
  };
};