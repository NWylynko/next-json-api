# next-json-api
small function to simplify nextjs api routes

```ts
import { JsonHandler, ApiError } from "next-json-api";

// wrap your handler in JsonHandler
const handler = JsonHandler(async (req, res) => {
  if (Math.random() > 0.5) {

    // throw ApiError with the status code and message
    throw new ApiError(500, "Something went wrong");
  }

  // return the response
  return {
    hello: "world",
  };
});

export default handler;

// import this client side to get the same type
export type Response = Awaited<ReturnType<typeof handler>>;
```