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
        className="flex justify-center items-center w-[60%] z-150 mx-auto relative"
      >
        <div className="bg-white px-[60px] py-[30px] rounded-[22px] mt-[30px] w-full flex flex-col gap-y-[15px]">
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
          <div className="bg-[#B7CC5B] rounded-[8px] p-[24px] w-full flex gap-x-[20px] items-center">
            <MarioHole />
            <div className="flex flex-col gap-y-[10px]">
              <p className="pixel-caps">Referral Sale Link</p>
              <div className="border border-[3px] border-black px-[13px] py-[11px] rounded-[11px] bg-white flex justify-between items-center gap-x-[100px]">
                <p>LoremIpsumLink</p>
                <div className="cursor-pointer bg-black rounded-[7px] py-[8px] px-[12px]">
                  <p className="text-[14px] text-white">copy link</p>
                </div>
              </div>
              <p>You referred: 0 friends</p>
            </div>
          </div>
          <div className="flex flex-col gap-y-[20px]">
            <p className="font-bold">
              1. connect wallet to view your referral sale code
            </p>
            <p className="font-bold">
              2. each successful sale referral will earn 1 FLAPPYPIPE
            </p>
            <p className="font-bold">
              3. referral campaign will end after sale ends
            </p>
          </div>
        </div>
      </div>
    </HeroLayout>
  );
}
