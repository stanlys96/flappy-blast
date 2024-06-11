import "../styles/globals.css";
import { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import { mainnet, arbitrum, optimism, polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi";

import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID ?? "asdasd";

const metadata = {
	name: "Hyfen",
	description: "Hyfen",
	url: "https://hyfen.gg", // origin must match your domain & subdomain
	icons: [process.env.NEXT_PUBLIC_ICON_URL ?? ""],
};

const config = defaultWagmiConfig({
	chains: [mainnet, arbitrum, optimism, polygon],
	projectId: PROJECT_ID ?? "",
	metadata,
	enableWalletConnect: true, // Optional - true by default
	enableInjected: true, // Optional - true by default
	enableEIP6963: true, // Optional - true by default
	enableCoinbase: true, // Optional - true by default
});

createWeb3Modal({
	wagmiConfig: config,
	projectId: PROJECT_ID ?? "",
	enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<SessionProvider session={pageProps.session}>
				<WagmiProvider config={config}>
					<QueryClientProvider client={queryClient}>
						<Component {...pageProps} />
					</QueryClientProvider>
				</WagmiProvider>
			</SessionProvider>
		</>
	);
}

export default MyApp;
