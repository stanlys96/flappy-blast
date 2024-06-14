import "../styles/globals.css";
import { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import { mainnet, arbitrum, optimism, polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi";

import { SessionProvider } from "next-auth/react";
import { Button, ConfigProvider } from "antd";

const queryClient = new QueryClient();
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";

const metadata = {
	name: "Hyfen",
	description: "Hyfen",
	url: "https://hyfen.gg", // origin must match your domain & subdomain
	icons: ["/favicon.ico"],
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
						<ConfigProvider
							theme={{
								token: {
									colorPrimary: "#000",
									colorPrimaryHover: "#343434",
									borderRadius: 0,
								},
								components: {
									Button: {
										defaultHoverColor: "#343434",
										defaultHoverBorderColor: "#343434",
										defaultBorderColor: "#000",
									},
								},
							}}
						>
							<Component {...pageProps} />
						</ConfigProvider>
					</QueryClientProvider>
				</WagmiProvider>
			</SessionProvider>
		</>
	);
}

export default MyApp;
