import { HeroLayout } from "@/src/layouts/HeroLayout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import FlappyBird from "@/src/components/FlappyBird";

export default function AirdropPage() {
  const { address } = useAccount();
  const [isClientMobile, setIsClientMobile] = useState(false);

  const [currentState, setCurrentState] = useState<
    "index" | "flap" | "leaderboard"
  >("index");
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({
    address,
  });
  const [domLoaded, setDomLoaded] = useState(false);
  const ensAvatar = useEnsAvatar({
    name: ensName ?? "",
  });
  const { open } = useWeb3Modal();
  useEffect(() => {
    setDomLoaded(true);
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /mobile|android|iphone|ipad|tablet/.test(
        userAgent
      );
      setIsClientMobile(isMobileDevice);
    }
  }, []);
  if (!domLoaded) return <div></div>;
  return (
    <HeroLayout>
      <div
        style={{ zIndex: 119 }}
        className="flex justify-center items-center w-[80%] md:w-[60%] z-150 mx-auto relative h-[100vh]"
      >
        <div className="bg-white px-[30px] md:px-[60px] py-[30px] rounded-[22px] mt-[30px] w-full flex flex-col gap-y-[15px] md:pb-[100px]">
          {currentState === "index" && (
            <div>
              <div className="flex flex-col gap-y-[20px]">
                <div className="flex gap-x-[10px] items-center">
                  <p className="font-bold text-black md:text-[16px] text-[12px]">
                    1. <span className="underline">complete zealy quests</span>
                  </p>
                  <div className="p-[5px] rounded-[6px] bg-[#FF6666]">
                    <p className="text-[#560000] md:text-[12px] text-[10px]">
                      REQUIRED
                    </p>
                  </div>
                </div>
                <div className="flex gap-x-[10px] items-center">
                  <p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
                    2. connect wallet and play flappyblast
                  </p>
                  <div className="p-[5px] rounded-[6px] bg-[#FF6666]">
                    <p className="text-[#560000] md:text-[12px] text-[10px]">
                      REQUIRED
                    </p>
                  </div>
                </div>
                <p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
                  3. top 100 players will get extra allocation
                </p>
                <p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
                  4. good luck and $FLAP up ;)
                </p>
              </div>
              <div className="flex md:flex-row flex-col gap-x-[40px] justify-center items-center">
                <div
                  onClick={() => setCurrentState("flap")}
                  className="md:block hidden relative mt-[25px] cursor-pointer"
                >
                  <Image
                    width={300}
                    height={100}
                    alt="button"
                    src="/images/flap_button.png"
                  />
                </div>
                <div
                  onClick={() => setCurrentState("flap")}
                  className="block md:hidden relative mt-[25px] cursor-pointer"
                >
                  <Image
                    width={150}
                    height={100}
                    alt="button"
                    src="/images/flap_button.png"
                  />
                </div>
                <div
                  // onClick={() => setCurrentState("leaderboard")}
                  className="md:block hidden relative mt-[25px] cursor-pointer"
                >
                  <Image
                    width={300}
                    height={100}
                    alt="button"
                    src="/images/leaderbord_button.png"
                  />
                </div>
                <div
                  // onClick={() => setCurrentState("leaderboard")}
                  className="block md:hidden relative mt-[25px] cursor-pointer"
                >
                  <Image
                    width={150}
                    height={100}
                    alt="button"
                    src="/images/leaderbord_button.png"
                  />
                </div>
              </div>
            </div>
          )}
          {currentState === "flap" && (
            <div className="flex flex-col gap-y-[20px]">
              <div className="flex justify-start">
                {!address ? (
                  <div
                    onClick={() => open()}
                    className="border border-[#BDBDBD] py-[11px] px-[19px] rounded-[10px] flex gap-x-[10px] cursor-pointer items-center"
                  >
                    <p className="font-bold md:text-[16px] text-[12px]">
                      Connect Wallet
                    </p>
                  </div>
                ) : (
                  <div
                    onClick={() => disconnect()}
                    className="border border-[#BDBDBD] py-[11px] px-[19px] rounded-[10px] flex gap-x-[10px] cursor-pointer items-center"
                  >
                    {ensAvatar?.data && (
                      <img
                        className="w-[30px] h-[30px] hidden md:block rounded-full"
                        src={ensAvatar?.data ?? ""}
                      />
                    )}
                    <p className="font-bold md:text-[16px] text-[12px]">
                      {address.slice(0, 5) +
                        "..." +
                        address.slice(address.length - 4)}
                    </p>
                    {ensName && (
                      <p className="font-bold md:text-[16px] text-[12px]">
                        {ensName}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div
                className={`rounded-[8px] bg-[#F1F1F1] w-full ${
                  !address
                    ? "h-[400px]"
                    : "h-[400px] md:h-[600px] md:pb-[500px] p-[30px]"
                } relative flex justify-center items-center`}
              >
                {!address ? (
                  <p>Connect Wallet</p>
                ) : isClientMobile ? (
                  <p>Please use desktop to play the game.</p>
                ) : (
                  <FlappyBird />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </HeroLayout>
  );
}
