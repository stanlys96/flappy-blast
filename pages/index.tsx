import { AbsoluteImagesComponent } from "@/src/components/AbsoluteImagesComponent";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FlappyCoinSvg } from "@/src/components/FlappyCoinSvg";
import { BladeSvg } from "@/src/components/BladeSvg";
import { HeroLayout } from "@/src/layouts/HeroLayout";

export default function HomePage() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const [text, setText] = useState("Guaranteed Floor Price");
  const [text2, setText2] = useState("Fairlaunch");
  const [text3, setText3] = useState("Infinity and beyond");
  const [text4, setText4] = useState("Optimized for jackpot");
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);
  const [isHovered4, setIsHovered4] = useState(false);

  const handleMouseEnter = () => {
    setText("The price can only go up, starting at the initial sale price.");
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setText("Guaranteed Floor Price");
    setIsHovered(false);
  };

  const handleMouseEnter2 = () => {
    setText2(
      "All ETH raised goes to the liquidity pool—no tokens are held by the devs."
    );
    setIsHovered2(true);
  };

  const handleMouseLeave2 = () => {
    setText2("Fairlaunch");
    setIsHovered2(false);
  };

  const handleMouseEnter3 = () => {
    setText3("Trading fees and native yield keep boosting the floor price.");
    setIsHovered3(true);
  };

  const handleMouseLeave3 = () => {
    setText3("Infinity and beyond");
    setIsHovered3(false);
  };

  const handleMouseEnter4 = () => {
    setText4("All criteria filled for jackpot, all is to hype it up !");
    setIsHovered4(true);
  };

  const handleMouseLeave4 = () => {
    setText4("Optimized for jackpot");
    setIsHovered4(false);
  };

  useEffect(() => {
    const countdownDate: any = new Date(); // Use current date/time as the countdown starting point
    countdownDate.setHours(countdownDate.getHours() + 13); // Example: Countdown for 1 hour from now

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTime({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTime({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <HeroLayout>
        <div className="flex flex-col justify-center items-center">
          <p className="text-[30px] mt-[30px] mb-[20px] text-white">
            unruggable meme & infinite
          </p>
          <div className="flex items-center">
            <Image
              width={600}
              height={180}
              alt="flappy-blast"
              src="/flappy-blast.png"
            />
          </div>
          <div className="relative mt-[25px] cursor-pointer">
            <Image width={300} height={100} alt="button" src="/button.png" />
          </div>
          <div className="bg-[#FFFFFF] flex justify-center items-center mt-[30px] px-[20px] py-[12px]">
            <p className="text-black">
              airdrop campaign ends in: {time.hours.toString().padStart(2, "0")}
              :{time.minutes.toString().padStart(2, "0")}:
              {time.seconds.toString().padStart(2, "0")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 py-[150px] px-[150px] h-[100vh] bg-black">
          <div className="flex flex-col gap-y-[20px]">
            <p className="flappy-birdy text-[#FCFC03] text-[100px] leading-[75px]">
              homage to the legendary game
            </p>
            <p className="inter text-white py-[10px] px-[21px] border border-[6px] text-[28px] w-fit">
              how it&apos;s unruggable, are you sure?
            </p>
            <p className="inter text-[18px] font-normal">
              The protocol keeps all its tokens on the blockchain to always
              protect their value. This creates a baseline value that never goes
              down. Over time, protocol fees are used to boost this baseline
              value, making it{" "}
              <span className="font-semibold text-[#FCFC03]">
                impossible to &quot;rug&quot; and ensuring it keeps growing
                forever
              </span>
              . It&apos;s like having a magic money tree that only grows bigger!
            </p>
          </div>
          <div className="flex w-full justify-center items-center">
            <img
              src="/flappy-gif.gif"
              className="w-[300px]"
              alt="Example GIF"
            />
          </div>
        </div>
      </HeroLayout>
      <div className="h-[100vh] bg-[#262626] relative">
        <div className="grid grid-cols-4 gap-x-[50px] justify-center items-center h-full px-[100px]">
          <div className="flex flex-col gap-y-[25px] items-center">
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`w-[240px] ${
                isHovered
                  ? "text-[14px] text-black bg-white border-white"
                  : "text-[28px] text-[#FCFC03] border-[#FCFC03]"
              } cursor-pointer h-[150px] p-[14px] border border-[9px] flex items-center justify-center`}
            >
              <p className="text-center">{text}</p>
            </div>
            <Image
              src="/standing-capa.png"
              width={200}
              height={200}
              alt="capa"
            />
          </div>
          <div className="flex flex-col gap-y-[25px] items-center">
            <div
              onMouseEnter={handleMouseEnter2}
              onMouseLeave={handleMouseLeave2}
              className={`w-[240px] ${
                isHovered2
                  ? "text-[14px] text-black bg-white border-white"
                  : "text-[28px] text-[#FCFC03] border-[#FCFC03]"
              } cursor-pointer h-[150px] p-[14px] border border-[9px] flex items-center justify-center`}
            >
              <p className="text-center">{text2}</p>
            </div>
            <Image
              src="/standing-capa.png"
              width={200}
              height={200}
              alt="capa"
            />
          </div>
          <div className="flex flex-col gap-y-[25px] items-center">
            <div
              onMouseEnter={handleMouseEnter3}
              onMouseLeave={handleMouseLeave3}
              className={`w-[240px] ${
                isHovered3
                  ? "text-[14px] text-black bg-white border-white"
                  : "text-[28px] text-[#FCFC03] border-[#FCFC03]"
              } cursor-pointer h-[150px] p-[14px] border border-[9px] flex items-center justify-center`}
            >
              <p className="text-center">{text3}</p>
            </div>
            <Image
              src="/standing-capa.png"
              width={200}
              height={200}
              alt="capa"
            />
          </div>
          <div className="flex flex-col gap-y-[25px] items-center">
            <div
              onMouseEnter={handleMouseEnter4}
              onMouseLeave={handleMouseLeave4}
              className={`w-[240px] ${
                isHovered4
                  ? "text-[14px] text-black bg-white border-white"
                  : "text-[28px] text-[#FCFC03] border-[#FCFC03]"
              } cursor-pointer h-[150px] p-[14px] border border-[9px] flex items-center justify-center`}
            >
              <p className="text-center">{text4}</p>
            </div>
            <Image
              src="/standing-capa.png"
              width={200}
              height={200}
              alt="capa"
            />
          </div>
        </div>
        <div style={{ zIndex: 100 }} className="w-full absolute bottom-0 z-100">
          <Image
            style={{ zIndex: 100 }}
            className="z-100"
            src="/ground.png"
            width={2232}
            height={100}
            alt="ground"
          />
        </div>
      </div>
      <div className="h-[100vh] flex flex-col justify-center items-center px-[150px] py-[150px] bg-black">
        <div>
          <p className="pixel-caps text-[#FCFC03] text-[48px] text-center">
            $FLAP TOKENOMICS
          </p>
          <div className="flex justify-center items-center gap-x-[40px] my-[50px]">
            <div className="flex flex-col items-end gap-y-[40px]">
              <div className="flex items-center gap-x-[30px]">
                <p className="pixel-caps text-[#FCFC03]">95 % Liquidity</p>
                <div className="w-[50px] h-[50px] bg-[#FCFC03] rounded-full" />
              </div>
              <div className="flex items-center gap-x-[30px]">
                <p className="pixel-caps text-[#838383]">0 % Team</p>
                <div className="w-[50px] h-[50px] bg-[#838383] rounded-full" />
              </div>
            </div>
            <FlappyCoinSvg className="h-[250px] w-[250px]" />
            <div className="flex flex-col gap-y-[40px]">
              <div className="flex items-center gap-x-[30px]">
                <div className="w-[50px] h-[50px] bg-[#FF00C7] rounded-full" />
                <p className="pixel-caps text-[#FF00C7]">2.5 % REFERRAL</p>
              </div>
              <div className="flex items-center gap-x-[30px]">
                <div className="w-[50px] h-[50px] bg-[#22A2FF] rounded-full" />
                <p className="pixel-caps text-[#22A2FF]">2.5 % AIRDROP</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-[20px] border border-[12px] border-[#404833] w-fit mx-auto border-dashed justify-center items-center py-[36px]">
            <p className="text-white">in collaboration with</p>
            <BladeSvg className="w-[500px] h-[50px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
