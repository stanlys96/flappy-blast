import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { axiosApi, fetcherStrapi } from "@/utils/axios";

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		TwitterProvider({
			clientId: process.env.TWITTER_CLIENT_ID,
			clientSecret: process.env.TWITTER_CLIENT_SECRET,
			version: "2.0", // opt-in to Twitter OAuth 2.0
			// authorization: {
			// 	params: {
			// 		scope: "users.read tweet.read tweet.write offline.access follows.read follows.write",
			// 	},
			// },
			profile({ data }) {
				return {
					id: data.id,
					name: data.name,
					// NOTE: E-mail is currently unsupported by OAuth 2 Twitter.
					email: null,
					username: data.username,
					image: data.profile_image_url,
				};
			},
		}),
		// ...add more providers here
	],
	callbacks: {
		async signIn({ user, account }) {
			if (account.provider === "twitter") {
				try {
					const response = await axiosApi.get(`/api/twitter-accounts?filters[twitter_id][$eq]=${user.id}`);

					if (response.data.data.length === 0) {
						await axiosApi.post("/api/twitter-accounts", {
							data: {
								twitter_id: user.id,
								twitter_name: user.name,
								twitter_username: user.username,
								twitter_pic: user.image,
								is_wallet: false,
								is_socialaction: false,
							},
						});
					}
				} catch (error) {
					console.error("Error inserting data on first login:", error);
					return false; // Return false to deny access if there's an error
				}
			}
			return true; // Return true to proceed with the login
		},
		async jwt({ token, user, account }) {
			// Persist the OAuth access token to the token right after signin
			if (account && account.access_token && account.refresh_token) {
				token.refresh_token = account.refresh_token;
				token.accessToken = account.access_token;
			}
			if (user?.id) {
				token.id = user.id;
			}
			if (user?.username) {
				token.username = user.username;
			}
			return token;
		},
		async session({ session, token }) {
			if (token.id) {
				session.user.id = token.id;
			}
			if (token?.username) {
				session.username = token.username;
			}
			// Add access token to the session object
			if (token.accessToken) {
				session.accessToken = token.accessToken;
			}
			if (token.refresh_token) {
				session.refresh_token = token.refresh_token;
			}
			return session;
		},
	},
};

export default NextAuth(authOptions);
