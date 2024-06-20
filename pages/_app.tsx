import "../styles/globals.css";
import { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import { arbitrum, blast, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi";

import { SessionProvider } from "next-auth/react";
import { Button, ConfigProvider } from "antd";
import { useEffect } from "react";

const queryClient = new QueryClient();
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID ?? "";

const metadata = {
    name: "Flappy Blast",
    description: "Flappy Blast",
    url: "https://www.flappyblast.com", // origin must match your domain & subdomain
    icons: [
        "https://firebasestorage.googleapis.com/v0/b/good-food-app-1498c.appspot.com/o/flappy.png?alt=media&token=a0cbc06d-bb88-48f5-b3d3-53d5d851e96e",
    ],
};

const config = defaultWagmiConfig({
    chains: [blast, arbitrum, sepolia],
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
    useEffect(() => {
        const handleContextMenu = (event: any) => {
            event.preventDefault();
        };

        document.addEventListener("contextmenu", handleContextMenu);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);
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
                                        defaultHoverColor: "#8c8c8c",
                                        defaultHoverBorderColor: "#8c8c8c",
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
