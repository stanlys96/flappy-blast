import { HeroLayout } from "@/src/layouts/HeroLayout";
import { useState, useEffect } from "react";
import {
    useAccount,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
    useBalance,
    useSwitchChain,
    useWriteContract,
    useWaitForTransactionReceipt,
    createConfig,
    http,
    useReadContract,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
    Button,
    Divider,
    NotificationArgsProps,
    Popover,
    Radio,
    RadioChangeEvent,
    Spin,
    notification,
} from "antd";
import { PresaleTitle } from "@/src/components/PresaleTitle";
import Image from "next/image";
import { ExportOutlined } from "@ant-design/icons";
import { blast, sepolia } from "viem/chains";
import contractAbi from "../src/helper/contractAbi.json";
import { parseEther } from "ethers";
import CurrencyInput from "react-currency-input-field";
import { signIn, signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcherStrapi } from "@/utils/axios";
import copy from "clipboard-copy";
import React from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});

const Context = React.createContext({ name: "Default" });

export default function PresalePage() {
    const router = useRouter();
    const [api, contextHolder] = notification.useNotification();
    const { address, chain, isConnecting } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({
        address,
    });
    const { data: session, status } = useSession();
    const [domLoaded, setDomLoaded] = useState(false);
    const [waitingForReceipt, setWaitingForReceipt] = useState(false);
    const ensAvatar = useEnsAvatar({
        name: ensName ?? "",
    });
    const [flapAmount, setFlapAmount] = useState("0");
    const {
        writeContract,
        data: hash,
        isPending,
        writeContractAsync,
        isSuccess,
    } = useWriteContract();

    const { chains, switchChain } = useSwitchChain();
    const { open } = useWeb3Modal();
    const [refferalRadioValue, setRefferalRadioValue] = useState("flappyblast");
    const [currentReferralUrl, setCurrentReferralUrl] = useState<
        | "https://www.flappyblast.com/?ref="
        | "https://app.bladeswap.xyz/meme-world/flap?mref="
    >("https://www.flappyblast.com/?ref=");
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
        chainId: sepolia.id,
        blockTag: "finalized",
        query: {
            refetchInterval: 1,
        },
    });

    const receiptResult = useWaitForTransactionReceipt({
        // @ts-ignore
        hash: hash,
    });
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

    const { data: twitterData, mutate: twitterMutate } = useSWR(
        // @ts-ignore
        `/api/twitter-accounts?filters[twitter_id][$eq]=${session?.user.id}`,
        fetcherStrapi
    );

    const currentTwitterData = twitterData?.data?.data?.[0];

    const result = useWaitForTransactionReceipt({
        // @ts-ignore
        hash: transactionHash,
    });

    const disableBtn =
        parseFloat(flapAmount ?? "0") === 0 ||
        !flapAmount ||
        parseFloat(flapAmount) > parseFloat(data?.formatted ?? "0") ||
        chain?.name !== "Blast";

    useEffect(() => {
        router.push("/");
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!receiptResult?.data && transactionHash) {
            setWaitingForReceipt(true);
        }
        if (receiptResult?.data) {
            setWaitingForReceipt(false);
            setTransactionHash("");
        }
    }, [receiptResult?.data, transactionHash]);

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
                                Total Raised: 0 ETH / 150 ETH
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
                                            <div
                                                onClick={() => disconnect()}
                                                className="px-[8px] bg-[#FFFF95] border border-[2px] py-[4px] border-[#000] flex gap-x-[10px] cursor-pointer items-center w-fit mx-auto"
                                            >
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
                                                            address.length - 5
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
                                                        *You are not on blast
                                                    </p>
                                                    <div className="w-full flex justify-center my-3">
                                                        <Button
                                                            type="primary"
                                                            onClick={() => {
                                                                switchChain({
                                                                    chainId:
                                                                        blast.id,
                                                                });
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
                                                            iconPosition={"end"}
                                                            className="font-bold mx-auto"
                                                        >
                                                            Switch to Blast
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
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
                                                        setFlapAmount(
                                                            value ?? "0"
                                                        );
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
                                        </div>
                                        {/* button enabled */}
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
                                                    )
                                                        return;
                                                    try {
                                                        const result =
                                                            await writeContractAsync(
                                                                {
                                                                    abi: contractAbi,
                                                                    address:
                                                                        "0x47C704F345bfF26E78cFF015E0998f5A19486359",
                                                                    functionName:
                                                                        "commit",
                                                                    args: [
                                                                        "0x6567507252626459756100000000000000000000000000000000000000000000",
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
                                                            e.message,
                                                            "<<< E"
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
                                                    style={{ height: "auto" }}
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
                                        0.000 ETH
                                    </p>
                                </div>
                                <div className="my-2">
                                    <p className="text-base">Start Sale</p>
                                    <p className="text-md font-semibold">
                                        June 21 2024,00:00 UTC
                                    </p>
                                </div>
                                <div className="my-2">
                                    <p className="text-base">End of Sale</p>
                                    <p className="text-md font-bold">
                                        June 23 2024,00:00 UTC
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
        </div>
    );
}
