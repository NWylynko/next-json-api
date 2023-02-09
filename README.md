# next-json-api
small function to simplify nextjs api routes

```ts
import { JsonHandler, ApiError } from "next-json-api";

const handler = JsonHandler(async (req, res) => {
  if (Math.random() > 0.5) {
    throw new ApiError(500, "Something went wrong");
  }

  return {
    hello: "world",
  };
});

export default handler;
```