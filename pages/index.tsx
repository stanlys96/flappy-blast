import { useState, useEffect } from "react";
import Image from "next/image";
import { FlappyCoinSvg } from "@/src/components/FlappyCoinSvg";
import { BladeSvg } from "@/src/components/BladeSvg";
import { HeroLayout } from "@/src/layouts/HeroLayout";
import { Carousel } from "antd";
import { CarouselData } from "@/src/helper/helper";
import { GroundLargeSvg } from "@/src/components/GroundLargeSvg";
import { GroundSvg } from "@/src/components/GroundSvg";
import { GroundMobileSvg } from "@/src/components/GroundMobileSvg";
import { GroundCarouselSvg } from "@/src/components/GroundCarouselSvg";
import { useRouter } from "next/router";
import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";

export default function HomePage() {
    const router = useRouter();
    const [text, setText] = useState("Guaranteed Floor Price");
    const [text2, setText2] = useState(
        <div className="flex flex-col gap-1">
            <div>Fairlaunch</div>
            <div className="text-sm">HC: 150ETH</div>
            <div className="text-sm">IC: 0,03-3 ETH</div>
        </div>
    );
    const [text3, setText3] = useState("Infinity and beyond");
    const [text4, setText4] = useState("Optimized for jackpot");
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isHovered3, setIsHovered3] = useState(false);
    const [isHovered4, setIsHovered4] = useState(false);
    const [totalCarouselData, setTotalCarouselData] = useState(CarouselData);
    const [totalCarousel, setTotalCarousel] = useState([0, 1, 2, 3]);
    const [domLoaded, setDomLoaded] = useState(false);

    const handleMouseEnter = () => {
        setText(
            "The price can only go up, starting at the initial sale price."
        );
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setText("Guaranteed Floor Price");
        setIsHovered(false);
    };

    const handleMouseEnter2 = () => {
        setText2(
            <div>
                All ETH raised goes to the liquidity pool—no tokens are held by
                the devs.
            </div>
        );
        setIsHovered2(true);
    };

    const handleMouseLeave2 = () => {
        setText2(
            <div className="flex flex-col gap-1">
                <div>Fairlaunch</div>
                <div className="text-sm">HC: 150ETH</div>
                <div className="text-sm">IC: 0,03-3 ETH</div>
            </div>
        );
        setIsHovered2(false);
    };

    const handleMouseEnter3 = () => {
        setText3(
            "Trading fees and native yield keep boosting the floor price."
        );
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

    const endTime = new Date("2024-06-21T13:00:00Z"); // Set your fixed end time here

    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = (endTime as any) - (now as any);

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor(difference / (1000 * 60 * 60)), // Total hours
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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

    useEffect(() => {
        setDomLoaded(true);
    }, []);
    if (!domLoaded) return <div></div>;
    return (
        <div className="w-full overflow-hidden">
            <HeroLayout>
                <div className="flex flex-col h-[100vh] md:h-[95vh] desktop:h-[100vh] large-desktop:h-[80vh] justify-center items-center">
                    <p className="text-[24px] md:text-left text-center md:text-[2rem] desktop:text-[4rem] large-desktop:text-[5rem] mb-[20px]  text-white">
                        unruggable meme & infinite
                    </p>
                    <div className="md:block hidden flex items-center justify-center">
                        <Image
                            className="w-full desktop:w-[750px] large-desktop:w-[954px] md:w-[600px]"
                            width={954}
                            height={180}
                            alt="flappy-blast"
                            src="/images/flappy-blast.png"
                        />
                    </div>
                    <div className="block md:hidden flex items-center">
                        <Image
                            width={400}
                            height={70}
                            alt="flappy-blast"
                            src="/images/flappy-blast.png"
                        />
                    </div>
                    <div
                        onClick={() => router.push("/airdrop")}
                        className="md:block hidden relative mt-[25px] cursor-pointer"
                    >
                        <Image
                            width={300}
                            height={100}
                            alt="button"
                            src="/images/button.png"
                        />
                    </div>
                    <div
                        onClick={() => router.push("/airdrop")}
                        className="block md:hidden relative mt-[25px] cursor-pointer"
                    >
                        <Image
                            width={150}
                            height={100}
                            alt="button"
                            src="/images/button.png"
                        />
                    </div>
                    <div className="bg-[#FFFFFF] flex justify-center items-center mt-[30px] px-[20px] py-[12px]">
                        <p className="text-black md:text-[16px] text-[12px]">
                            airdrop campaign ends in:{" "}
                            {timeLeft?.hours?.toString().padStart(2, "0")}:
                            {timeLeft?.minutes?.toString().padStart(2, "0")}:
                            {timeLeft?.seconds?.toString().padStart(2, "0")}
                        </p>
                    </div>
                </div>
            </HeroLayout>
            <div className="flex md:flex-row gap-y-[40px] flex-col py-[25px] justify-center items-center h-[140vh] desktop:h-[100vh] large-desktop:h-[100vh] bg-black md:pt-[50px] md:pt-0">
                <div className="flex md:flex-1 md:pl-[150px] justify-center items-center md:items-start flex-col gap-y-[20px] desktop:gap-y-[40px] large-desktop:pl-[250px]">
                    <p className="flappy-birdy text-[#FCFC03] md:text-left text-center md:px-0 px-[20px] text-[80px] md:text-[80px] desktop:text-[120px] large-desktop:text-[140px] md:text-[100px] leading-[75px]">
                        homage to the legendary game
                    </p>
                    <p className="inter md:text-left text-center text-white py-[10px] font-bold px-[21px] border border-[6px] desktop:text-[2rem] large-desktop:my-[30px] large-desktop:text-[4rem] text-[1rem] md:text-[28px] w-fit">
                        how it&apos;s unruggable, are you sure?
                    </p>
                    <p className="inter md:text-left text-center md:px-0 px-[20px] text-[14px] md:text-[18px] desktop:text-[1.5rem] large-desktop:text-[2rem] font-normal text-white">
                        The protocol keeps all its tokens on the blockchain to
                        always protect their value. This creates a baseline
                        value that never goes down. Over time, protocol fees are
                        used to boost this baseline value, making it{" "}
                        <span className="font-semibold text-[#FCFC03]">
                            impossible to &quot;rug&quot; and ensuring it keeps
                            growing forever
                        </span>
                        . It&apos;s like having a magic money tree that only
                        grows bigger!
                    </p>
                </div>
                <div className="flex md:flex-1 w-full justify-center items-center md:mt-0">
                    <Image
                        className="w-2/3 md:w-1/2 rounded-[12px]"
                        width={510}
                        height={686}
                        unoptimized
                        src="/images/flappy-gif.gif"
                        alt="Example GIF"
                    />
                </div>
            </div>
            <div className="md:hidden block h-full bg-[#262626] relative w-full pt-[50px] md:pt-0">
                <Carousel
                    className="h-full w-full flex justify-center items-center mx-auto"
                    arrows
                >
                    {totalCarouselData.map((data) => (
                        <div
                            key={data.id}
                            className="flex h-full w-full flex-col items-center justify-end relative"
                        >
                            <div
                                onClick={() => {
                                    let currentCarouselData =
                                        totalCarouselData.find(
                                            (theData) => theData.id === data.id
                                        );
                                    let currentCarouselDataIndex =
                                        totalCarouselData.findIndex(
                                            (theData) => theData.id === data.id
                                        );
                                    if (currentCarouselData) {
                                        currentCarouselData.isHovered =
                                            !currentCarouselData?.isHovered;
                                        let tempData = totalCarouselData;
                                        tempData[currentCarouselDataIndex] =
                                            currentCarouselData;
                                        console.log(tempData);
                                        setTotalCarouselData(tempData);
                                    }
                                }}
                                className="p-[30px] h-[30vh] w-[80vw] mx-auto"
                            >
                                <div className="flex justify-center items-center w-full h-full">
                                    <div
                                        className={`w-[240px] ${
                                            data.isHovered
                                                ? "text-[24px] text-black bg-white border-white"
                                                : "text-[28px] text-[#FCFC03] border-[#FCFC03]"
                                        } cursor-pointer h-full m-auto p-[14px] border border-[9px] flex items-center justify-center`}
                                    >
                                        <p className={`text-center font-bold`}>
                                            {data.isHovered
                                                ? data.textHovered
                                                : data.currentText}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center h-full w-full items-end">
                                <Image
                                    src="/images/standing-capa.png"
                                    className="w-[55%] h-[55%]"
                                    width={222}
                                    height={333}
                                    alt="capa"
                                />
                            </div>
                            <div className="absolute bg-[#FFFFFF60] w-2/3 left-1/2 transform -translate-x-1/2  top-2/3 h-fit p-[16px] ">
                                <p className="text-black text-center font-bold text-[12px] md:text-[18px] opacity-100">
                                    click the box to view details
                                </p>
                            </div>
                        </div>
                    ))}
                </Carousel>
                <div
                    style={{ zIndex: 100 }}
                    className="w-full absolute bottom-0 z-100"
                >
                    {maxWidth <= 430 ? (
                        <GroundCarouselSvg className="z-100 absolute bottom-[-3px]" />
                    ) : maxWidth > 1728 ? (
                        <GroundLargeSvg className="z-100" />
                    ) : (
                        <GroundSvg className="z-100" />
                    )}
                </div>
            </div>
            <div className="md:block hidden h-[100vh] desktop:h-[120vh] large-desktop:h-[80vh] bg-[#262626] relative">
                <div className="grid grid-cols-4 gap-x-[50px] justify-center items-end h-full px-[100px]">
                    <div className="flex flex-col gap-y-[25px] items-center">
                        <div
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className={`w-[240px] ${
                                isHovered
                                    ? "text-[18px] text-black bg-white border-white"
                                    : "text-[28px] text-[#FCFC03] border-[#FCFC03]"
                            } cursor-pointer large-desktop:w-[12vw] transition duration-500 large-desktop:h-[15vh] h-[150px] p-[14px] border border-[9px] flex items-center justify-center`}
                        >
                            <p className="text-center font-bold">{text}</p>
                        </div>
                        <Image
                            className="md:mb-[150px] desktop:mb-[150px]"
                            src="/images/standing-capa.png"
                            width={maxWidth > 1500 ? 350 : 200}
                            height={500}
                            alt="capa"
                        />
                    </div>
                    <div className="flex flex-col gap-y-[25px] items-center">
                        <div
                            onMouseEnter={handleMouseEnter2}
                            onMouseLeave={handleMouseLeave2}
                            className={`w-[240px] ${
                                isHovered2
                                    ? "text-[20px] text-black bg-white border-white"
                                    : "text-[28px] text-[#FCFC03] border-[#FCFC03]"
                            } cursor-pointer transition duration-500 large-desktop:w-[12vw] large-desktop:h-[15vh] h-[150px] p-[14px] border border-[9px] flex items-center justify-center`}
                        >
                            <p className="text-center font-bold">{text2}</p>
                        </div>
                        <Image
                            className="md:mb-[150px] desktop:mb-[150px]"
                            src="/images/standing-capa.png"
                            width={maxWidth > 1500 ? 350 : 200}
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
                                    ? "text-[20px] text-black bg-white border-white"
                                    : "text-[28px] text-[#FCFC03] border-[#FCFC03]"
                            } cursor-pointer transition duration-500 large-desktop:w-[12vw] large-desktop:h-[15vh] h-[150px] p-[14px] border border-[9px] flex items-center justify-center`}
                        >
                            <p className="text-center font-bold">{text3}</p>
                        </div>
                        <Image
                            className="md:mb-[150px] desktop:mb-[150px]"
                            src="/images/standing-capa.png"
                            width={maxWidth > 1500 ? 350 : 200}
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
                                    ? "text-[20px] text-black bg-white border-white"
                                    : "text-[28px] text-[#FCFC03] border-[#FCFC03]"
                            } cursor-pointer transition duration-500 large-desktop:w-[12vw] large-desktop:h-[15vh] h-[150px] p-[14px] border border-[9px] flex items-center justify-center`}
                        >
                            <p className="text-center font-bold">{text4}</p>
                        </div>
                        <Image
                            className="md:mb-[150px] desktop:mb-[150px]"
                            src="/images/standing-capa.png"
                            width={maxWidth > 1500 ? 350 : 200}
                            height={200}
                            alt="capa"
                        />
                    </div>
                </div>
                <div
                    style={{ zIndex: 100 }}
                    className="w-full absolute bottom-0 z-100"
                >
                    {maxWidth <= 430 ? (
                        <GroundMobileSvg className="z-100 " />
                    ) : maxWidth > 1728 ? (
                        <GroundLargeSvg className="z-100" />
                    ) : (
                        <GroundSvg className="z-100" />
                    )}
                </div>
            </div>
            <div className="h-[140vh] md:h-[120vh] desktop:h-[120vh] large-desktop:h-[115vh] flex flex-col justify-center items-center px-[150px] bg-black">
                <div className="flex flex-col justify-center items-center">
                    <p className="pixel-caps md:mt-[50px] desktop:mt-[50px] large-desktop:mt-[70px] text-[#FCFC03] text-[1.5rem] md:text-[48px] desktop:text-[4rem] large-desktop:text-[5rem] text-center mb-[30px]">
                        $FLAP TOKENOMICS
                    </p>
                    <p className="pixel-caps text-[#FCFC03] text-[1rem] md:text-[2rem] desktop:text-[3rem] large-desktop:text-[4rem] text-center mb-[10px]">
                        TOKEN SUPPLY:
                    </p>
                    <p className="text-[#FCFC03] text-[0.8rem] md:text-[1.5rem] desktop:text-[2.5rem] large-desktop:text-[3.5rem] text-center mb-[30px]">
                        100,000,000{" "}
                        <span className="font-light">
                            (100% UNRUGGABLE, 0% DEV)
                        </span>
                    </p>
                    <div className="w-full flex justify-center items-center md:hidden block ">
                        <FlappyCoinSvg className="h-[150px] w-[150px] md:h-[300px] md:w-[300px] desktop:h-[450px] large-desktop:w-[600px]" />
                    </div>
                    <div className="flex w-fit md:flex-row flex-col justify-center items-center gap-x-[40px] mt-[25px] md:mt-0 md:my-[50px] large-desktop:mt-[40px]">
                        <div className="md:flex w-[400.25px] desktop:w-[450.25px] large-desktop:w-[550.25px] hidden flex-col items-end gap-y-[40px]">
                            <div className="flex items-center gap-x-[30px]">
                                <p className="pixel-caps text-[#FCFC03] desktop:text-[1.5rem] large-desktop:text-[2rem]">
                                    26 % Liquidity
                                </p>
                                <div className="w-[50px] h-[50px] bg-[#FCFC03] rounded-full" />
                            </div>
                            <div className="flex items-center gap-x-[30px]">
                                <p className="text-nowrap pixel-caps text-[#39FF70] desktop:text-[1.5rem] large-desktop:text-[2rem]">
                                    70 % Fair Launch
                                </p>
                                <div className="w-[50px] h-[50px] bg-[#39FF70] rounded-full" />
                            </div>
                        </div>
                        <FlappyCoinSvg className="md:block hidden h-[250px] w-[250px]" />
                        <div className="w-full flex md:hidden block flex-col gap-y-[40px]">
                            <div className="flex justify-start items-center gap-x-[30px]">
                                <div className="w-[30px] h-[30px] bg-[#FCFC03] rounded-full" />
                                <p className="pixel-caps text-[#FCFC03] desktop:text-[1.5rem] large-desktop:text-[2rem]">
                                    26 % Liquidity
                                </p>
                            </div>
                            <div className="flex justify-start items-center gap-x-[30px]">
                                <div className="w-[30px] h-[30px] bg-[#FF00C7] rounded-full" />
                                <p className="pixel-caps text-[#FF00C7] desktop:text-[1.5rem] large-desktop:text-[2rem]">
                                    1.5 % REFERRAL
                                </p>
                            </div>
                        </div>
                        <div className="flex md:w-[400.25px] desktop:w-[450.25px] large-desktop:w-[550.25px] mt-[40px] md:mt-0 md:flex-col-reverse flex-col gap-y-[40px]">
                            <div className="flex justify-start items-center gap-x-[30px]">
                                <div className="md:w-[50px] md:h-[50px] w-[30px] h-[30px] bg-[#22A2FF] rounded-full" />
                                <p className="pixel-caps text-[#22A2FF] desktop:text-[1.5rem] large-desktop:text-[2rem]">
                                    2.5 % AIRDROP
                                </p>
                            </div>
                            <div className="md:hidden flex justify-start items-center gap-x-[30px]">
                                <div className="w-[30px] h-[30px] bg-[#39FF70] rounded-full" />
                                <p className="text-nowrap pixel-caps text-[#39FF70] desktop:text-[1.5rem] large-desktop:text-[2rem]">
                                    70 % Fair Launch
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-x-[30px]">
                                <div className="w-[50px] h-[50px] bg-[#FF00C7] rounded-full" />
                                <p className="pixel-caps text-[#FF00C7] desktop:text-[1.5rem] large-desktop:text-[2rem]">
                                    1.5 % REFERRAL
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="large-desktop:mt-[100px] mt-[50px] md:mt-[25px] desktop:mt-[20px] flex flex-col p-[20px] md:p-[30px] large-desktop:p-[60px] gap-y-[20px] border border-[12px] border-[#404833] w-fit mx-auto border-dashed-custom justify-center items-center py-[36px]">
                        <p className="text-white text-[16px] md:text-[2rem] desktop:text-[2rem] large-desktop:text-[3rem]">
                            in collaboration with
                        </p>
                        <a
                            href="https://app.bladeswap.xyz/swap"
                            target="_blank"
                        >
                            <BladeSvg className="h-[45px] cursor-pointer md:h-[75px] large-desktop:h-[120px] w-fit" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
