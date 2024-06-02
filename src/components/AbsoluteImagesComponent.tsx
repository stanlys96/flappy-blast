import Image from "next/image";
import { BlastSVG } from "./BlastSvg";
import { DiscordSvg } from "./DiscordSvg";
import { TwitterSvg } from "./TwitterSvg";
import { TelegramSvg } from "./TelegramSvg";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const AbsoluteImagesComponent = () => {
  const router = useRouter();
  const useScreenWidth = () => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);

      handleResize(); // Set initial width
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
  };
  const maxWidth = useScreenWidth();
  return (
    <div>
      <div
        style={{ zIndex: 100 }}
        className="flex justify-center items-center z-100 w-full"
      >
        <div
          style={{ zIndex: 100 }}
          className="bg-[#404833] md:p-0 p-[15px] md:px-[44px] md:py-[22px] mt-[30px] rounded-[71px] flex items-center gap-x-[20px]"
        >
          <a
            onClick={() => router.push("/")}
            className={`pixel-caps text-[12px] md:text-[16px] cursor-pointer ${
              router.pathname === "/" ? "text-[#FCFC03]" : "text-white"
            }`}
          >
            HOME
          </a>
          <a
            onClick={() => router.push("/airdrop")}
            className={`pixel-caps text-[12px] md:text-[16px] cursor-pointer ${
              router.pathname === "/airdrop" ? "text-[#FCFC03]" : "text-white"
            }`}
          >
            AIRDROP
          </a>
          <a
            onClick={() => router.push("/referral")}
            className={`pixel-caps text-[12px] md:text-[16px] cursor-pointer ${
              router.pathname === "/referral" ? "text-[#FCFC03]" : "text-white"
            }`}
          >
            REFERRAL
          </a>
        </div>
      </div>
      <Image
        className="absolute top-[13%] left-[5%]"
        src="/images/cloud.png"
        width={150}
        height={150}
        alt="cloud"
      />
      <Image
        className="absolute top-[15%] right-[8%]"
        src="/images/cloud.png"
        width={150}
        height={150}
        alt="cloud"
      />
      <Image
        className="absolute top-[1%] left-[45%]"
        src="/images/cloud.png"
        width={150}
        height={150}
        alt="cloud"
      />
      <div style={{ zIndex: 100 }} className="w-full absolute bottom-0 z-100">
        <Image
          style={{ zIndex: 100 }}
          className="z-100"
          src="/images/ground.png"
          width={maxWidth}
          height={100}
          alt="ground"
        />
      </div>
      <Image
        className="absolute top-0"
        src="/images/top-bottom.png"
        width={110}
        height={110}
        alt="greenbin"
      />
      <Image
        className="absolute bottom-0 md:top-1/2 z-50"
        src="/images/top-top.png"
        width={110}
        height={110}
        alt="greenbin"
      />
      <Image
        className="absolute top-0 right-0"
        src="/images/top-bottom-side.png"
        width={110}
        height={110}
        alt="greenbin"
      />
      <Image
        className="absolute bottom-0 md:top-1/2 z-50 right-0"
        src="/images/top-top-side.png"
        width={110}
        height={110}
        alt="greenbin"
      />
      <BlastSVG
        style={{ zIndex: 1000 }}
        onClick={() => {}}
        className="absolute bottom-0 z-1000 md:top-[5%] z-50 right-0 md:right-[2%] cursor-pointer"
      />
      <div
        style={{ zIndex: 1000 }}
        className="md:flex hidden rounded-[14px] flex-col gap-y-[30px] justify-center items-center py-[24px] px-[18px] bg-black z-100 absolute top-1/2 left-[4%] transform -translate-x-1/2 -translate-y-1/2"
      >
        <TwitterSvg className="cursor-pointer" />
        <DiscordSvg className="cursor-pointer" />
        <TelegramSvg className="cursor-pointer" />
      </div>
      <div
        style={{ zIndex: 1000 }}
        className="md:hidden flex rounded-[14px] flex-col gap-y-[30px] justify-center items-center py-[24px] px-[18px] bg-black z-100 absolute bottom-[-12%] left-[12%] transform -translate-x-1/2 -translate-y-1/2"
      >
        <TwitterSvg className="cursor-pointer" />
        <DiscordSvg className="cursor-pointer" />
        <TelegramSvg className="cursor-pointer" />
      </div>
    </div>
  );
};
