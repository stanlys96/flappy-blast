// Stashed for future use

import { TwitterApi } from "twitter-api-v2";

const twitterClient = new TwitterApi("");

const v1client = new TwitterApi({
  appKey: "",
  appSecret: "",
  accessToken: "",
  accessSecret: "",
});

export default async function handler(req: any, res: any) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        const mediaId = await v1client.v1.uploadMedia("D:\\screencap.png", {
          additionalOwners: "12313123",
        });
        const tweet = await twitterClient.v2.tweet({
          text: "Check out this screenshot!",
          media: {
            media_ids: [mediaId], // Array of media IDs to include in the tweet
          },
        });
        res.status(200).json({ message: "Tweet posted successfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to post tweet" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
