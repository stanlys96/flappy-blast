import { HeroLayout } from "@/src/layouts/HeroLayout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import FlappyBird from "@/src/components/FlappyBird";

export default function AirdropPage() {
  const { address } = useAccount();
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
  }, []);
  if (!domLoaded) return <div></div>;
  return (
    <HeroLayout>
      <div
        style={{ zIndex: 150 }}
        className="flex justify-center items-center w-[60%] z-150 mx-auto relative pb-[100px]"
      >
        <div className="bg-white px-[60px] py-[30px] rounded-[22px] mt-[30px] w-full flex flex-col gap-y-[15px] pb-[100px]">
          {currentState === "index" && (
            <div>
              <div className="flex flex-col gap-y-[20px]">
                <div className="flex gap-x-[10px] items-center">
                  <p className="font-bold text-black">
                    1. <span className="underline">complete zealy quests</span>
                  </p>
                  <div className="p-[5px] rounded-[6px] bg-[#FF6666]">
                    <p className="text-[#560000] text-[12px]">REQUIRED</p>
                  </div>
                </div>
                <div className="flex gap-x-[10px] items-center">
                  <p className="font-bold">
                    2. connect wallet and play flappyblast
                  </p>
                  <div className="p-[5px] rounded-[6px] bg-[#FF6666]">
                    <p className="text-[#560000] text-[12px]">REQUIRED</p>
                  </div>
                </div>
                <p className="font-bold">
                  3. top 100 players will get extra allocation
                </p>
                <p className="font-bold">4. good luck and $FLAP up ;)</p>
              </div>
              <div className="flex gap-x-[40px] justify-center items-center">
                <div
                  onClick={() => setCurrentState("flap")}
                  className="relative mt-[25px] cursor-pointer"
                >
                  <Image
                    width={300}
                    height={100}
                    alt="button"
                    src="/images/flap_button.png"
                  />
                </div>
                <div
                  // onClick={() => setCurrentState("leaderboard")}
                  className="relative mt-[25px] cursor-pointer"
                >
                  <Image
                    width={300}
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
                    <p className="font-bold">Connect Wallet</p>
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
                    <p className="font-bold">
                      {address.slice(0, 5) +
                        "..." +
                        address.slice(address.length - 4)}
                    </p>
                    {ensName && <p className="font-bold">{ensName}</p>}
                  </div>
                )}
              </div>
              <div
                className={`rounded-[8px] bg-[#F1F1F1] w-full ${
                  !address ? "h-[400px]" : "h-[600px] pb-[500px]"
                } relative flex justify-center items-center`}
              >
                {!address ? <p>Connect Wallet</p> : <FlappyBird />}
              </div>
            </div>
          )}
        </div>
      </div>
    </HeroLayout>
  );
}
