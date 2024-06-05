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
  console.log(maxWidth);
  return (
    <div className="overflow-hidden">
      <div
        style={{ zIndex: 100 }}
        className="flex justify-center items-center z-100 w-full overflow-hidden"
      >
        <div
          style={{ zIndex: 120 }}
          className="bg-[#404833] fixed top-[2%] md:p-0 p-[15px] md:px-[44px] md:py-[22px] mt-[30px] rounded-[71px] flex items-center justify-center gap-x-[20px]"
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
        width={maxWidth < 500 ? 100 : maxWidth > 1500 ? 300 : 150}
        height={122}
        alt="cloud"
      />
      <Image
        className="absolute top-[15%] right-[8%]"
        src="/images/cloud.png"
        width={maxWidth < 500 ? 100 : maxWidth > 1500 ? 300 : 150}
        height={122}
        alt="cloud"
      />
      <Image
        className="absolute top-[1%] left-[45%]"
        src="/images/cloud.png"
        width={maxWidth < 500 ? 100 : maxWidth > 1500 ? 300 : 150}
        height={122}
        alt="cloud"
      />
      <div style={{ zIndex: 100 }} className="w-full absolute bottom-0 z-100">
        <Image
          style={{ zIndex: 100 }}
          className="z-100 w-[100vw]"
          src="/images/ground.png"
          width={1730}
          height={223}
          alt="ground"
        />
      </div>
      <Image
        className="absolute top-[-5%] w-[30%] md:w-[10%] left-[-15%] md:left-[-2%]"
        src="/images/top-bottom.png"
        width={391}
        height={248}
        alt="greenbin"
      />
      <Image
        className="absolute bottom-0 w-[30%] md:top-1/2 z-50 md:w-[10%] left-[-15%] md:left-[-2%]"
        src="/images/top-top.png"
        width={391}
        height={248}
        alt="greenbin"
      />
      <Image
        className="absolute top-[-5%] w-[30%] right-[-15%] md:right-[-2%] md:w-[10%]"
        src="/images/top-bottom-side.png"
        width={391}
        height={248}
        alt="greenbin"
      />
      <Image
        className="absolute bottom-0 w-[30%] md:top-1/2 md:w-[10%] z-50 right-[-15%] md:right-[-2%]"
        src="/images/top-top-side.png"
        width={391}
        height={248}
        alt="greenbin"
      />
      <Image
        style={{ zIndex: 100 }}
        className="md:w-[250px] w-[150px] fixed bottom-[3%] z-100 md:top-[5%] z-50  right-[2%] cursor-pointer"
        src="/images/blast.png"
        width={300}
        height={74}
        alt="greenbin"
      />
      <div
        style={{ zIndex: 200 }}
        className="fixed md:flex hidden rounded-[14px] flex-col gap-y-[30px] justify-center items-center py-[24px] px-[18px] bg-black z-100 top-1/2 left-[4%] transform -translate-x-1/2 -translate-y-1/2"
      >
        <TwitterSvg className="cursor-pointer" />
        <DiscordSvg className="cursor-pointer" />
        <TelegramSvg className="cursor-pointer" />
      </div>
      <div
        style={{ zIndex: 200 }}
        className="fixed md:hidden flex rounded-[14px] flex-col gap-y-[30px] justify-center items-center px-[10px] py-[16px] bg-black z-100 bottom-[-6%] left-[8%] transform -translate-x-1/2 -translate-y-1/2"
      >
        <TwitterSvg className="cursor-pointer h-[20px] w-[20px]" />
        <DiscordSvg className="cursor-pointer h-[20px] w-[20px]" />
        <TelegramSvg className="cursor-pointer h-[20px] w-[20px]" />
      </div>
    </div>
  );
};
