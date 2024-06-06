import Image from "next/image";
import { BlastSVG } from "./BlastSvg";
import { DiscordSvg } from "./DiscordSvg";
import { TwitterSvg } from "./TwitterSvg";
import { TelegramSvg } from "./TelegramSvg";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GroundSvg } from "./GroundSvg";
import { GroundLargeSvg } from "./GroundLargeSvg";
import { GroundMobileSvg } from "./GroundMobileSvg";

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
    <div className="overflow-hidden">
      <div
        style={{ zIndex: 100 }}
        className="flex justify-center items-center z-100 w-full overflow-hidden"
      >
        <div
          style={{ zIndex: 120 }}
          className="bg-[#404833] fixed top-[2%] md:p-0 p-[15px] desktop:p-[30px] large-desktop:p-[40px] md:px-[44px] md:py-[22px] mt-[30px] rounded-[71px] flex items-center justify-center gap-x-[20px] large-desktop:gap-x-[40px]"
        >
          <a
            onClick={() => router.push("/")}
            className={`pixel-caps text-[12px] flex items-center justify-center transition duration-500 hover:text-[#B0CD80] md:text-[16px] desktop:text-[20px] large-desktop:text-[28px] cursor-pointer ${
              router.pathname === "/"
                ? "text-[#FCFC03] hover:text-[#FCFC03]"
                : "text-white"
            }`}
          >
            HOME
          </a>
          <a
            onClick={() => router.push("/airdrop")}
            className={`pixel-caps text-[12px] flex items-center justify-center transition duration-500 hover:text-[#B0CD80] md:text-[16px] desktop:text-[20px] large-desktop:text-[28px] cursor-pointer ${
              router.pathname === "/airdrop"
                ? "text-[#FCFC03] hover:text-[#FCFC03]"
                : "text-white"
            }`}
          >
            AIRDROP
          </a>
          <a
            onClick={() => router.push("/referral")}
            className={`pixel-caps text-[12px] flex items-center justify-center transition duration-500 hover:text-[#B0CD80] md:text-[16px] desktop:text-[20px] large-desktop:text-[28px] cursor-pointer ${
              router.pathname === "/referral"
                ? "text-[#FCFC03] hover:text-[#FCFC03]"
                : "text-white"
            }`}
          >
            REFERRAL
          </a>
        </div>
      </div>
      <Image
        className="absolute top-[13%] left-[5%]"
        src="/images/cloud.png"
        width={
          maxWidth < 500
            ? 100
            : maxWidth > 1500
            ? 200
            : maxWidth > 2000
            ? 300
            : 150
        }
        height={122}
        alt="cloud"
      />
      <Image
        className="absolute top-[15%] right-[8%]"
        src="/images/cloud.png"
        width={
          maxWidth < 500
            ? 100
            : maxWidth > 1500
            ? 200
            : maxWidth > 2000
            ? 300
            : 150
        }
        height={122}
        alt="cloud"
      />
      <Image
        className="absolute top-[1%] left-[45%]"
        src="/images/cloud.png"
        width={
          maxWidth < 500
            ? 100
            : maxWidth > 1500
            ? 200
            : maxWidth > 2000
            ? 300
            : 150
        }
        height={122}
        alt="cloud"
      />
      <div style={{ zIndex: 100 }} className="w-full absolute bottom-0 z-100">
        {maxWidth <= 430 ? (
          <GroundMobileSvg className="z-100" />
        ) : maxWidth > 1728 ? (
          <GroundLargeSvg className="z-100" />
        ) : (
          <GroundSvg className="z-100" />
        )}
      </div>
      <Image
        className="absolute top-0 desktop:top-0 large-desktop:top-[-5%] w-[30%] md:w-[10%] left-[-15%] md:left-[-2%]"
        src="/images/top-bottom.png"
        width={391}
        height={248}
        alt="greenbin"
      />
      <Image
        className="absolute bottom-[20%] md:bottom-[12%] w-[30%] z-50 md:w-[10%] left-[-15%] md:left-[-2%]"
        src="/images/top-top.png"
        width={391}
        height={248}
        alt="greenbin"
      />
      <Image
        className="absolute top-0 desktop:top-0 large-desktop:top-[-5%] w-[30%] right-[-15%] md:right-[-2%] md:w-[10%]"
        src="/images/top-bottom-side.png"
        width={391}
        height={248}
        alt="greenbin"
      />
      <Image
        className="absolute bottom-[20%] w-[30%] md:bottom-[12%] md:w-[10%] z-50 right-[-15%] md:right-[-2%]"
        src="/images/top-top-side.png"
        width={391}
        height={248}
        alt="greenbin"
      />
      <BlastSVG
        style={{ zIndex: 119 }}
        className="md:w-[250px] w-[150px] large-desktop:w-[300px] fixed bottom-[3%] z-100 md:top-[5%] z-50  right-[2%] cursor-pointer"
      />
      <div
        style={{ zIndex: 200 }}
        className="fixed md:flex hidden rounded-[14px] large-desktop:rounded-[40px] large-desktop:gap-y-[45px] flex-col gap-y-[30px] justify-center items-center py-[24px] px-[18px] large-desktop:px-[36px] large-desktop:py-[48px] bg-black z-100 top-1/2 left-[4%] transform -translate-x-1/2 -translate-y-1/2"
      >
        <TwitterSvg className="cursor-pointer large-desktop:h-[60px] large-desktop:w-[60px]" />
        <DiscordSvg className="cursor-pointer large-desktop:h-[60px] large-desktop:w-[60px]" />
        <TelegramSvg className="cursor-pointer large-desktop:h-[60px] large-desktop:w-[60px]" />
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
