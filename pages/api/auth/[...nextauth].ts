import NextAuth from "next-auth";
import TwitterProvider, { TwitterProfile } from "next-auth/providers/twitter";
import { axiosApi } from "@/utils/axios";

interface SignInProps {
    user: any;
    account: any;
}

interface JwtProps {
    user: any;
    token: any;
    account: any;
}

interface SessionProps {
    session: any;
    token: any;
}

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID ?? "",
            clientSecret: process.env.TWITTER_CLIENT_SECRET ?? "",
            version: "2.0", // opt-in to Twitter OAuth 2.0
            // authorization: {
            // 	params: {
            // 		scope: "users.read tweet.read tweet.write offline.access follows.read follows.write",
            // 	},
            // },
            profile(profile: TwitterProfile) {
                return {
                    id: profile.data.id,
                    name: profile.data.name,
                    // NOTE: E-mail is currently unsupported by OAuth 2 Twitter.
                    email: null,
                    username: profile.data.username,
                    image: profile.data.profile_image_url,
                };
            },
        }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account }: SignInProps) {
            try {
                if (account.provider === "twitter") {
                    try {
                        const response = await axiosApi.get(
                            `/api/twitter-accounts?filters[twitter_id][$eq]=${user.id}`
                        );

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
                        console.error(
                            "Error inserting data on first login:",
                            error
                        );
                        return false; // Return false to deny access if there's an error
                    }
                }
                return true; // Return true to proceed with the login
            } catch (e) {
                console.log(e, "<<< ERROR");
                return false;
            }
        },
        async jwt({ token, user, account }: JwtProps) {
            // Persist the OAuth access token to the token right after signin
            // if (account && account.access_token && account.refresh_token) {
            // 	token.refresh_token = account.refresh_token;
            // 	token.accessToken = account.access_token;
            // }
            if (user?.id) {
                token.id = user.id;
            }
            if (user?.username) {
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }: SessionProps) {
            try {
                console.log("Token received:", token); // Debug log to check token structure

                // Ensure token contains id before assigning it
                if (token?.id) {
                    session.user.id = token.id;
                } else {
                    console.warn("Token id is missing");
                }

                // Ensure token contains username before assigning it
                if (token?.username) {
                    session.username = token.username;
                } else {
                    console.warn("Token username is missing");
                }

                // Example of adding additional tokens, ensure to uncomment and use if necessary
                // if (token.accessToken) {
                //     session.accessToken = token.accessToken;
                // }
                // if (token.refresh_token) {
                //     session.refresh_token = token.refresh_token;
                // }

                console.log("Session object after processing:", session); // Debug log to check session structure
                return session;
            } catch (e) {
                console.error("Error in session handler:", e);
                // Return a valid session object in case of an error
                return {
                    ...session,
                    error: "Session error",
                };
            }
        },
    },
};

export default NextAuth(authOptions);
