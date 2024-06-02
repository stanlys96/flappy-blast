import { MarioHole } from "@/src/components/MarioHoleSvg";
import { HeroLayout } from "@/src/layouts/HeroLayout";
import { useState, useEffect } from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function ReferralPage() {
  const { address } = useAccount();
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
        className="flex justify-center items-center w-[80%] md:w-[60%] z-150 mx-auto relative"
      >
        <div className="bg-white px-[30px] md:px-[60px] py-[30px] rounded-[22px] mt-[30px] w-full flex flex-col gap-y-[15px]">
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
          <div className="md:flex-row flex-col bg-[#B7CC5B] rounded-[8px] p-[24px] w-full flex gap-x-[20px] items-center">
            <MarioHole className="md:w-[151px] md:h-[164px] w-[100px] h-[100px]" />
            <div className="flex flex-col gap-y-[10px]">
              <p className="pixel-caps md:text-[16px] text-[10px] md:text-left text-center md:mt-0 mt-[10px]">
                Referral Sale Link
              </p>
              <div className="border border-[3px] border-black px-[13px] py-[11px] rounded-[11px] bg-white flex justify-between items-center gap-x-[20px] md:gap-x-[100px]">
                <p className="md:text-[16px] text-[12px]">LoremIpsumLink</p>
                <div className="cursor-pointer bg-black rounded-[7px] py-[8px] px-[12px]">
                  <p className="text-[10px] md:text-[14px] text-white">
                    copy&nbsp;link
                  </p>
                </div>
              </div>
              <p className="md:text-[16px] text-[12px] md:text-left text-center">
                You referred: 0 friends
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-[20px]">
            <p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
              1. connect wallet to view your referral sale code
            </p>
            <p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
              2. each successful sale referral will earn 1 FLAPPYPIPE
            </p>
            <p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
              3. referral campaign will end after sale ends
            </p>
          </div>
        </div>
      </div>
    </HeroLayout>
  );
}
