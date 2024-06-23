import { AbsoluteImagesComponent } from "@/src/components/AbsoluteImagesComponent";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

interface Props {
  children: ReactNode;
}

export const HeroLayout = ({ children }: Props) => {
  const router = useRouter();
  useEffect(() => {
    if (router.pathname === "/referral") {
      router.push("/");
    }
  }, []);
  return (
    <div
      className={`${
        router.pathname === "/presale" ? "min-h-[140vh]" : "min-h-[110vh]"
      } hero-section overflow-hidden w-[100vw] relative`}
    >
      <Head>
        <title>Flappy Blast</title>
      </Head>
      <AbsoluteImagesComponent />
      {children}
    </div>
  );
};
