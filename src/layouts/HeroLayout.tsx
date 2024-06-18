import { AbsoluteImagesComponent } from "@/src/components/AbsoluteImagesComponent";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";

interface Props {
	children: ReactNode;
}

export const HeroLayout = ({ children }: Props) => {
	const router = useRouter();
	// useEffect(() => {
	//     if (router.pathname === "/airdrop") {
	//         router.push("/");
	//     }
	// }, []);
	return (
		<div className="h-[110vh] hero-section overflow-hidden w-[100vw] relative">
			<AbsoluteImagesComponent />
			{children}
		</div>
	);
};
