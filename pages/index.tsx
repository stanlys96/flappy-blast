import { useState, useEffect } from "react";
import Image from "next/image";
import { FlappyCoinSvg } from "@/src/components/FlappyCoinSvg";
import { BladeSvg } from "@/src/components/BladeSvg";
import { HeroLayout } from "@/src/layouts/HeroLayout";
import {
    Button,
    Carousel,
    Divider,
    Popover,
    Radio,
    RadioChangeEvent,
    Spin,
} from "antd";
import { CarouselData } from "@/src/helper/helper";
import { GroundLargeSvg } from "@/src/components/GroundLargeSvg";
import { GroundSvg } from "@/src/components/GroundSvg";
import { GroundMobileSvg } from "@/src/components/GroundMobileSvg";
import { GroundCarouselSvg } from "@/src/components/GroundCarouselSvg";
import { useRouter } from "next/router";
import {
    useAccount,
    useBalance,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
    useWaitForTransactionReceipt,
    useWriteContract,
    useReadContract,
} from "wagmi";
import { ExportOutlined } from "@ant-design/icons";
import { useSwitchChain } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import useSWR from "swr";
import { axiosApi, fetcherStrapi } from "@/utils/axios";
import Swal from "sweetalert2";
import { blast } from "viem/chains";
import copy from "clipboard-copy";
import CurrencyInput from "react-currency-input-field";
import contractAbi from "../src/helper/contractAbi.json";
import realContractAbi from "../src/helper/realContractAbi.json";
import { ethers, parseEther } from "ethers";
import { signIn, signOut, useSession } from "next-auth/react";
import { stringToBytes32 } from "@/utils/helper";
import Modal from "antd/es/modal/Modal";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});

export default function HomePage() {
    const router = useRouter();
    const referralCode = stringToBytes32(router.query.ref?.toString() ?? "");
    const { data: session, status } = useSession();
    const [text, setText] = useState("Guaranteed Floor Price");
    const [text2, setText2] = useState(
        <div className="flex flex-col gap-1">
            <div>Fairlaunch</div>
            <div className="text-sm">HC: 150ETH</div>
            <div className="text-sm">IC: 0,03-3 ETH</div>
        </div>
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const { address, chain, isConnecting } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({
        address,
    });
    const { data: twitterData, mutate: twitterMutate } = useSWR(
        // @ts-ignore
        `/api/twitter-accounts?filters[twitter_id][$eq]=${session?.user.id}`,
        fetcherStrapi
    );

    const currentTwitterData = twitterData?.data?.data?.[0];

    const ensAvatar = useEnsAvatar({
        name: ensName ?? "",
    });
    const { chains, switchChain } = useSwitchChain();
    const { open } = useWeb3Modal();
    const [refferalRadioValue, setRefferalRadioValue] = useState<
        "flappyblast" | "bladeswap"
    >("flappyblast");
    const [currentReferralUrl, setCurrentReferralUrl] = useState<
        | "https://www.flappyblast.com/?ref="
        | "https://app.bladeswap.xyz/meme-world/flap?mref="
    >("https://www.flappyblast.com/?ref=");
    const {
        writeContract,
        data: hash,
        isPending,
        writeContractAsync,
        isSuccess,
    } = useWriteContract();
    const [flapAmount, setFlapAmount] = useState("0");
    const [waitingForReceipt, setWaitingForReceipt] = useState(false);
    const [text3, setText3] = useState("Infinity and beyond");
    const [text4, setText4] = useState("Optimized for jackpot");
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isHovered3, setIsHovered3] = useState(false);
    const [isHovered4, setIsHovered4] = useState(false);
    const [totalCarouselData, setTotalCarouselData] = useState(CarouselData);
    const [totalCarousel, setTotalCarousel] = useState([0, 1, 2, 3]);
    const [domLoaded, setDomLoaded] = useState(false);

    const totalCommitmentsCall = useReadContract({
        abi: realContractAbi,
        // @ts-ignore
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        functionName: "totalCommitments",
        chainId: blast.id,
    });

    const userCommitmentsCall = useReadContract({
        abi: realContractAbi,
        // @ts-ignore
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        functionName: "commitments",
        chainId: blast.id,
        args: [address],
    });

    const totalCommitmentsResult = totalCommitmentsCall?.data
        ? ethers
              .formatUnits(
                  // @ts-ignore
                  totalCommitmentsCall?.data,
                  18
              )
              .toString()
        : "0";

    const userCommitmentsResult = userCommitmentsCall?.data
        ? ethers
              .formatUnits(
                  // @ts-ignore
                  userCommitmentsCall?.data,
                  18
              )
              .toString()
        : "0";

    const onRefferalChange = (e: RadioChangeEvent) => {
        if (e.target.value === "flappyblast") {
            setCurrentReferralUrl("https://www.flappyblast.com/?ref=");
        } else {
            setCurrentReferralUrl(
                "https://app.bladeswap.xyz/meme-world/flap?mref="
            );
        }
        setRefferalRadioValue(e.target.value);
    };

    const [transactionHash, setTransactionHash] = useState("");
    const { data, error, isLoading, refetch } = useBalance({
        address,
        blockTag: "latest",
        // chainId: blast.id,
        query: {
            refetchInterval: 100,
        },
    });

    const receiptResult = useWaitForTransactionReceipt({
        // @ts-ignore
        hash: hash,
    });

    const handleCopy = async (text: string) => {
        try {
            copy(text);
            Toast.fire({
                icon: "success",
                title: "Copied successfully!",
            });
        } catch (error) {
            console.error("Failed to copy:", error);
            Toast.fire({
                icon: "error",
                title: "Signed in successfully",
            });
        }
    };

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
        if (!receiptResult?.data && transactionHash) {
            setWaitingForReceipt(true);
        }
        if (receiptResult?.data) {
            setWaitingForReceipt(false);
            Swal.fire({
                title: "Success",
                html: `
                    <p class="mb-[10px]">Go to the link below to get your transaction confirmation!</p>
                    <a class="mt-2 underline" target="_blank" href='https://blastscan.io/tx/${receiptResult?.data?.transactionHash}' autofocus>https://blastscan.io/tx/${receiptResult?.data?.transactionHash}</a>
                `,
                icon: "success",
            });
            setTransactionHash("");
            setFlapAmount("0");
        }
    }, [receiptResult?.data, transactionHash]);

    const disableBtn = true;

    // const disableBtn =
    //     parseFloat(flapAmount ?? "0") === 0 ||
    //     !flapAmount ||
    //     parseFloat(flapAmount) > parseFloat(data?.formatted ?? "0") ||
    //     parseFloat(flapAmount) < 0.003 ||
    //     parseFloat(flapAmount) > 3;
    // chain?.name !== "Blast";

    useEffect(() => {
        if (!currentTwitterData?.attributes?.wallet_address && address) {
            axiosApi
                .put(`/api/twitter-accounts/${currentTwitterData?.id}`, {
                    data: {
                        is_wallet: true,
                        wallet_address: address,
                    },
                })
                .then((response) => {
                    twitterMutate();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [address, currentTwitterData]);

    useEffect(() => {
        setDomLoaded(true);
    }, []);
    if (!domLoaded) return <div></div>;
    return (
        <div className="w-full overflow-hidden">
            <HeroLayout>
                <div className="flex py-[40px] w-full min-h-[100vh] justify-center items-start">
                    <div
                        className="flex flex-col items-center gap-4 md:gap-6"
                        style={{ zIndex: 110, position: "relative" }}
                    >
                        <p className="botsmatic text-[#389616] text-[1.5rem] md:text-[3rem] mt-[100px]">
                            FLAPPYBLAST PRESALE
                        </p>
                        <div className="flex gap-4 justify-center items-stretch flex-col md:flex-row">
                            <Image
                                width={250}
                                height={35}
                                alt="blade"
                                src="/images/blade.png"
                            />
                            <a
                                href="https://app.bladeswap.xyz/meme-world/flap"
                                target="_blank"
                                className="cursor-pointer bg-black text-lg flex justify-center items-center border-2 border-[#FCFC03] text-[#FCFC03] px-4"
                            >
                                Buy on Bladeswap
                            </a>
                        </div>
                        <div className="flex gap-4 w-fit flex-col md:flex-row text-lg">
                            <div className="px-6 py-2 w-fit mx-auto bg-white border-4 border-black font-bold text-center">
                                Presale starts in:{" "}
                                {timeLeft?.hours?.toString().padStart(2, "0")}:
                                {timeLeft?.minutes?.toString().padStart(2, "0")}
                                :
                                {timeLeft?.seconds?.toString().padStart(2, "0")}
                            </div>
                            <div className="p-2 bg-white w-fit mx-auto border-4 border-black font-bold text-center">
                                Total Raised:{" "}
                                {totalCommitmentsResult
                                    ?.toString()
                                    ?.slice(0, 7)}{" "}
                                ETH / 150 ETH
                            </div>
                        </div>
                        <div className="flex gap-4 flex-col md:flex-row w-[80vw] md:w-fit">
                            <div className="bg-[#ddd894] p-4 rounded-lg">
                                <div className="flex items-start md:justify-between md:flex-row flex-col gap-y-2 mb-2 md:mb-0">
                                    <div className="md:text-[1.5rem] text-[1rem] font-bold kong-text">
                                        Sale
                                    </div>
                                    {!address ? (
                                        <div>
                                            {isConnecting ? (
                                                <div>
                                                    <Spin size="large" />
                                                </div>
                                            ) : (
                                                <Button
                                                    style={{
                                                        border: "2px solid",
                                                        backgroundColor:
                                                            "#FFFF95",
                                                    }}
                                                    className="w-fit text-md font-bold"
                                                    onClick={() => open()}
                                                >
                                                    Connect your wallet
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <Popover
                                                content={
                                                    <a
                                                        className="text-red-500 font-bold"
                                                        onClick={() =>
                                                            disconnect()
                                                        }
                                                    >
                                                        Logout
                                                    </a>
                                                }
                                                placement="bottomLeft"
                                                trigger="click"
                                            >
                                                <div className="px-[8px] bg-[#FFFF95] border border-[2px] py-[4px] border-[#000] flex gap-x-[10px] cursor-pointer items-center w-fit mx-auto">
                                                    {ensAvatar?.data && (
                                                        <img
                                                            className="w-[30px] h-[30px] hidden md:block rounded-full"
                                                            src={
                                                                ensAvatar?.data ??
                                                                ""
                                                            }
                                                        />
                                                    )}
                                                    <p className="font-bold md:text-[16px] text-[12px]">
                                                        {address.slice(0, 5) +
                                                            "..." +
                                                            address.slice(
                                                                address.length -
                                                                    5
                                                            )}
                                                    </p>
                                                    {ensName && (
                                                        <p className="font-bold md:text-[16px] text-[12px]">
                                                            {ensName}
                                                        </p>
                                                    )}
                                                </div>
                                                {chain?.name !== "Blast" && (
                                                    <div className="mt-2 mx-auto">
                                                        <p className="text-red-500 text-[12px] text-center">
                                                            *You are not on
                                                            blast
                                                        </p>
                                                        <div className="w-full flex justify-center my-3">
                                                            <Button
                                                                type="primary"
                                                                onClick={() => {
                                                                    switchChain(
                                                                        {
                                                                            chainId:
                                                                                blast.id,
                                                                        }
                                                                    );
                                                                }}
                                                                style={{
                                                                    border: "2px solid #000",
                                                                    borderRadius:
                                                                        "0px",
                                                                    backgroundColor:
                                                                        "#fff",
                                                                    color: "#000",
                                                                }}
                                                                icon={
                                                                    <ExportOutlined
                                                                        style={{
                                                                            color: "#000",
                                                                        }}
                                                                    />
                                                                }
                                                                iconPosition={
                                                                    "end"
                                                                }
                                                                className="font-bold mx-auto"
                                                            >
                                                                Switch to Blast
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Popover>
                                        </div>
                                    )}
                                </div>
                                {/* Presale ongoing */}
                                <div className="">
                                    <p className="text-md mb-2">Amount</p>
                                    <div className="flex justify-between gap-4 flex-col md:flex-row">
                                        <div>
                                            <div className="bg-white  border-4 border-black flex justify-between py-1 pl-4 pr-1 items-center">
                                                <CurrencyInput
                                                    className="outline-none max-w-[150px]"
                                                    id="input-example"
                                                    name="input-name"
                                                    placeholder="0"
                                                    disabled={isPending}
                                                    value={flapAmount}
                                                    defaultValue={0}
                                                    decimalsLimit={6}
                                                    onFocus={undefined}
                                                    onKeyUp={undefined}
                                                    onSubmit={undefined}
                                                    onSubmitCapture={undefined}
                                                    onChangeCapture={undefined}
                                                    transformRawValue={(
                                                        value: any
                                                    ) => {
                                                        if (
                                                            value[
                                                                value.length - 1
                                                            ] === ","
                                                        ) {
                                                            return value + ".";
                                                        }
                                                        return value;
                                                    }}
                                                    onValueChange={(
                                                        value,
                                                        name
                                                    ) => {
                                                        try {
                                                            if (
                                                                value ===
                                                                    "0k" ||
                                                                value === "-" ||
                                                                value === "-0"
                                                            ) {
                                                                return;
                                                            }
                                                            if (
                                                                parseFloat(
                                                                    value ?? "0"
                                                                ) < 0
                                                            ) {
                                                                setFlapAmount(
                                                                    "0"
                                                                );
                                                            } else {
                                                                setFlapAmount(
                                                                    value ?? "0"
                                                                );
                                                            }
                                                        } catch (e) {
                                                            setFlapAmount("0");
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    style={{
                                                        border: "0px solid",
                                                    }}
                                                    disabled={isPending}
                                                    className="font-bold"
                                                    onClick={async () => {
                                                        setFlapAmount(
                                                            data?.formatted
                                                                ?.toString()
                                                                ?.slice(0, 7) ??
                                                                "0"
                                                        );
                                                    }}
                                                >
                                                    MAX
                                                </Button>
                                            </div>
                                            {/* <p className="text-red-500 text-sm mb-2 mt-1">
													*transaction failed. please try again
												</p> */}
                                            <p className="text-md mt-2">
                                                Balance:{" "}
                                                {data?.formatted?.slice(0, 7)}{" "}
                                                ETH
                                            </p>
                                            <p className="text-md mt-2">
                                                Min: 0.003 ETH, Max: 3 ETH
                                            </p>
                                        </div>
                                        {/* button enabled */}
                                        <div className="flex justify-center items-center md:items-start">
                                            {isPending || waitingForReceipt ? (
                                                <div className="w-[150px] justify-center items-center">
                                                    <Spin
                                                        className="w-[150px]"
                                                        size={"large"}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={async () => {
                                                        if (
                                                            isPending ||
                                                            disableBtn ||
                                                            waitingForReceipt
                                                        ) {
                                                            return;
                                                        }
                                                        if (
                                                            parseFloat(
                                                                flapAmount ??
                                                                    "0"
                                                            ) +
                                                                parseFloat(
                                                                    userCommitmentsResult?.toString() ??
                                                                        "0"
                                                                ) >
                                                            3
                                                        ) {
                                                            return Swal.fire({
                                                                title: "Maximum commitment exceeded!",
                                                                text: "You can only buy max 3 ETH",
                                                                icon: "info",
                                                            });
                                                        }
                                                        try {
                                                            const result =
                                                                await writeContractAsync(
                                                                    {
                                                                        abi: realContractAbi,
                                                                        address:
                                                                            process
                                                                                .env
                                                                                .NEXT_PUBLIC_CONTRACT_ADDRESS as any,
                                                                        functionName:
                                                                            "commit",
                                                                        args: [
                                                                            referralCode,
                                                                        ],
                                                                        value: parseEther(
                                                                            flapAmount
                                                                        ),
                                                                    }
                                                                );
                                                            setTransactionHash(
                                                                result
                                                            );
                                                            setWaitingForReceipt(
                                                                true
                                                            );
                                                        } catch (e: any) {
                                                            console.log(
                                                                e?.toString(),
                                                                "<< WALO"
                                                            );
                                                        }
                                                    }}
                                                    className={`${
                                                        disableBtn ||
                                                        waitingForReceipt
                                                            ? "cursor-not-allowed"
                                                            : "cursor-pointer"
                                                    }`}
                                                >
                                                    <Image
                                                        width={150}
                                                        height={0}
                                                        style={{
                                                            height: "auto",
                                                        }}
                                                        alt="buy-flap"
                                                        src={`/images/${
                                                            disableBtn ||
                                                            waitingForReceipt
                                                                ? "BuyFlap_Btn_Disabled"
                                                                : "BuyFlap_Btn"
                                                        }.png`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {/* button disabled */}
                                        {/* <div>
                                            <Image
                                                width={150}
                                                height={0}
                                                style={{ height: "auto" }}
                                                alt="buy-flap"
                                                src="/images/BuyFlap_Btn_Disabled.png"
                                            />
                                        </div> */}
                                    </div>
                                </div>
                                {/* Presale ended */}
                                {/* <div className="gap-2 py-2 px-4 bg-[#FEF9C0] flex flex-col justify-center items-center">
										<p className="text-sm whitespace-nowrap">Thank you for your participation</p>
										<p className="text-xl font-semibold whitespace-nowrap">Presale Ended</p>
									</div> */}
                                <Divider rootClassName="mt-2 mb-3" />
                                <div className="flex justify-between md:flex-row flex-col gap-y-2">
                                    <div className="text-xl md:text-2xl font-bold kong-text">
                                        Refferal
                                    </div>
                                    <div>
                                        {!session ? (
                                            <Button
                                                style={{
                                                    border: "2px solid",
                                                    backgroundColor: "#FFFF95",
                                                }}
                                                className="w-fit font-bold"
                                                onClick={() => {
                                                    signIn();
                                                }}
                                            >
                                                Login to X
                                            </Button>
                                        ) : (
                                            <Popover
                                                content={
                                                    <a
                                                        className="text-red-500 font-bold"
                                                        onClick={() =>
                                                            signOut()
                                                        }
                                                    >
                                                        Logout
                                                    </a>
                                                }
                                                placement="bottomLeft"
                                                trigger="click"
                                            >
                                                <Button
                                                    style={{
                                                        border: "2px solid",
                                                        backgroundColor:
                                                            "#FFFF95",
                                                    }}
                                                    className="w-fit font-bold"
                                                >
                                                    <img
                                                        alt="X"
                                                        className="w-4 h-4"
                                                        src="/assets/x-logo-black.png"
                                                    />
                                                    {/* @ts-ignore */}
                                                    <p>@{session.username}</p>
                                                </Button>
                                            </Popover>
                                        )}
                                    </div>
                                </div>
                                <div className="my-4">
                                    <div className="text-md mb-2">
                                        <Radio.Group
                                            onChange={onRefferalChange}
                                            value={refferalRadioValue}
                                        >
                                            <Radio value={"flappyblast"}>
                                                Flappyblast site
                                            </Radio>
                                            <Radio value={"bladeswap"}>
                                                Bladeswap site
                                            </Radio>
                                        </Radio.Group>
                                    </div>
                                    <div className="bg-white border-4 border-black flex flex-wrap md:flex-nowrap justify-between py-2 pl-4 pr-2 items-center gap-x-2">
                                        <div className="flex mb-2 md:mb-0">
                                            <p className="text-ellipsis text-[9px] md:text-[10px] md:text-left text-center">
                                                {currentReferralUrl}
                                                {
                                                    currentTwitterData
                                                        ?.attributes
                                                        ?.referral_code
                                                }
                                            </p>
                                        </div>
                                        <div className="flex-1 flex justify-center items-center">
                                            <Button
                                                type="primary"
                                                style={{
                                                    border: "0px solid",
                                                }}
                                                className="w-fit font-bold"
                                                onClick={() => {
                                                    handleCopy(
                                                        `${currentReferralUrl}${currentTwitterData?.attributes?.referral_code}`
                                                    );
                                                }}
                                            >
                                                copy link
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#ddd894] p-4 rounded-lg">
                                <div className="text-xl md:text-2xl font-bold mb-4 kong-text">
                                    Sale Info
                                </div>
                                <div className="px-6 py-2 mb-4 bg-[#FEF9C0] text-md">
                                    <p>Total Participation</p>
                                    <p className="text-md font-bold">
                                        {userCommitmentsResult
                                            ?.toString()
                                            ?.slice(0, 7)}{" "}
                                        ETH
                                    </p>
                                </div>
                                <div className="my-2">
                                    <p className="text-base">Start Sale</p>
                                    <p className="text-md font-semibold">
                                        June 21 2024,08:00 UTC
                                    </p>
                                </div>
                                <div className="my-2">
                                    <p className="text-base">End of Sale</p>
                                    <p className="text-md font-bold">
                                        June 23 2024,08:00 UTC
                                    </p>
                                </div>
                                <div className="flex gap-y-2 gap-x-6 md:gap-6 my-2 flex-wrap">
                                    <div>
                                        <p className="text-base whitespace-nowrap">
                                            Sale Type
                                        </p>
                                        <p className="text-md font-semibold whitespace-nowrap">
                                            Fairlaunch
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-base whitespace-nowrap">
                                            Method
                                        </p>
                                        <p className="text-md font-semibold whitespace-nowrap">
                                            Overflow
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-base whitespace-nowrap">
                                            Claim Token
                                        </p>
                                        <p className="text-md font-semibold whitespace-nowrap">
                                            via Bladeswap
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-base">Hard Cap</p>
                                    <p className="text-md font-semibold">
                                        150 ETH
                                    </p>
                                </div>
                            </div>
                        </div>
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
            <Modal
                centered
                title={
                    <div
                        style={{
                            textAlign: "center",
                            fontSize: "24px",
                            fontWeight: "bold",
                        }}
                    >
                        {modalTitle}
                    </div>
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onClose={() => setModalOpen(false)}
                onOk={() => setModalOpen(false)}
                closable // Remove the "X" button
                // maskClosable={false} // Prevent closing by clicking outside
            >
                <p>{modalMessage}</p>
            </Modal>
        </div>
    );
}
