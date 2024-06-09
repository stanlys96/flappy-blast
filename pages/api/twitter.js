import { TwitterApi } from "twitter-api-v2";

export default async function handler(req, res) {
	const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
	const readOnlyClient = twitterClient.readOnly;

	try {
		const user = await readOnlyClient.v2.userByUsername("SDolitol365");
		res.status(200).json({ user }); // Add media if used
	} catch (error) {
		console.error("Error interacting with Twitter API:", error);
		res.status(500).json({ error: error.message });
	}
}
