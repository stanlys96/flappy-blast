import { HeroLayout } from "@/src/layouts/HeroLayout";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
    useAccount,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
    useReadContract,
    useSwitchChain,
} from "wagmi";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import FlappyBird from "@/src/components/FlappyBird";
import TwitterIntentHandler from "@/src/components/TwitterIntentHandler";
import useSWR from "swr";
import Cookie from "js-cookie";
import { signIn, signOut, useSession } from "next-auth/react";
import {
    Button,
    Modal,
    Avatar,
    Popover,
    Menu,
    Dropdown,
    Space,
    Progress,
} from "antd";
import {
    ExportOutlined,
    CaretRightOutlined,
    CheckOutlined,
    LeftOutlined,
    CaretDownOutlined,
} from "@ant-design/icons";
import { axiosApi, fetcherStrapi } from "@/utils/axios";
import { filterAndSortByHighScore, partnershipData } from "@/utils/helper";
import { ethers } from "ethers";
import { blast } from "viem/chains";
// AirdropPage
export default function AirdropPage() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const { address, chain, isConnected } = useAccount();
    const [isClientMobile, setIsClientMobile] = useState(false);
    const [currentState, setCurrentState] = useState<
        "index" | "flap" | "leaderboard" | "partnership"
    >("index");
    const { chains, switchChain } = useSwitchChain();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address });
    const [domLoaded, setDomLoaded] = useState(false);
    const ensAvatar = useEnsAvatar({ name: ensName ?? "" });
    const { open } = useWeb3Modal();
    const { open: web3ModalOpen, selectedNetworkId } = useWeb3ModalState();
    const [data, setData] = useState(null);

    const { data: twitterData, mutate: twitterMutate } = useSWR(
        // @ts-ignore
        `/api/twitter-accounts?filters[twitter_id][$eq]=${session?.user.id}`,
        fetcherStrapi
    );

    const { data: leaderboardsData, mutate: leaderboardsMutate } = useSWR(
        `/api/twitter-accounts?filters[high_score][$notNull]=true&filters[high_score][$gt]=0`,
        fetcherStrapi
    );

    const currentTwitterData = twitterData?.data?.data?.[0];
    const leaderboardsResult = leaderboardsData?.data?.data;
    const sortedLeaderboardsResult =
        filterAndSortByHighScore(leaderboardsResult);

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

    const socialActionButtonStyles = {
        base: {
            border: "2px solid #000",
            borderRadius: "0px",
            backgroundColor: "#fff",
            color: "#000",
        },
        verifying: {
            border: "2px solid yellow",
            color: "#B6B623",
        },
        verified: {
            border: "2px solid green",
            color: "#149309",
        },
    };

    const getSocialActionButtonStyles = (action: string) => {
        if (verificationStatus[action] === "verifying") {
            return {
                ...socialActionButtonStyles.base,
                ...socialActionButtonStyles.verifying,
            };
        } else if (verificationStatus[action] === "verified") {
            return {
                ...socialActionButtonStyles.base,
                ...socialActionButtonStyles.verified,
            };
        }
        return socialActionButtonStyles.base;
    };

    // 0 connect wallet, 1 twitter social action, 2 congrats, 3 finished, 10 hide
    const [modalStep, setModalStep] = useState(10);
    const [walletPopup, setIsWalletPopup] = useState(false);
    const [checkingWallet, setCheckingWallet] = useState(false);
    const [isBlast, setIsBlast] = useState(true);
    const [dropdownValue, setDropdownValue] = useState("Choose Project");
    const [partnershipModal, setPartnershipModal] = useState(false);
    const [playGameReady, setPlayGameReady] = useState(false);
    const currentSelectedProject = partnershipData.find(
        (data) => data.name.toLowerCase() === dropdownValue.toLowerCase()
    );

    const currentSelectedContract = useReadContract({
        abi: currentSelectedProject?.abi ?? [],
        // @ts-ignore
        address: "0x" + currentSelectedProject?.contractAddress ?? "0x000",
        functionName: "balanceOf",
        args: [address],
    });

    const currentSelectedDecimals = useReadContract({
        abi: currentSelectedProject?.abi ?? [],
        // @ts-ignore
        address: "0x" + currentSelectedProject?.contractAddress ?? "0x000",
        functionName: "decimals",
    });

    const currentSelectedSymbol = useReadContract({
        abi: currentSelectedProject?.abi ?? [],
        // @ts-ignore
        address: "0x" + currentSelectedProject?.contractAddress ?? "0x000",
        functionName: "symbol",
    });

    const [verificationStatus, setVerificationStatus] = useState<any>({
        follow: "unopened",
        retweet: "unopened",
        like: "unopened",
        tweet: "unopened",
    });

    const handleConnectWallet = () => {
        setCheckingWallet(true);
        setIsWalletPopup(true);
        setModalStep(10);
        open();
    };

    const handleOpenLink = (button: string) => {
        setTimeout(() => {
            setVerificationStatus((prevStatus: any) => ({
                ...prevStatus,
                [button]: "unverified",
            }));
        }, 1000);
    };

    const handleVerification = (button: string) => {
        setVerificationStatus((prevStatus: any) => ({
            ...prevStatus,
            [button]: "verifying",
        }));
        const randomDelay = Math.floor(Math.random() * 3000) + 1000; // Random delay between 1 to 4 seconds
        setTimeout(() => {
            setVerificationStatus((prevStatus: any) => ({
                ...prevStatus,
                [button]: "verified",
            }));
        }, randomDelay);
    };

    const handleMenuClick = (e: any) => {
        setDropdownValue(e.key);
    };

    const enableCheckBtn =
        address &&
        chain?.name === "Blast" &&
        address === currentTwitterData?.attributes?.wallet_address;
    const addressNotMatch =
        address !== currentTwitterData?.attributes?.wallet_address;

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="Goldmilio">
                <span>Goldmilio</span>
            </Menu.Item>
            <Menu.Item key="Blast Birbs">
                <span>Blast Birbs</span>
            </Menu.Item>
            <Menu.Item key="Blastr">
                <span>Blastr</span>
            </Menu.Item>
            <Menu.Item key="Blast Hoges">
                <span>Blast Hoges</span>
            </Menu.Item>
            <Menu.Item key="Blast Wolves">
                <span>Blast Wolves</span>
            </Menu.Item>
            <Menu.Item key="Blade">
                <span>Blade</span>
            </Menu.Item>
        </Menu>
    );

    useEffect(() => {
        if (walletPopup === true && web3ModalOpen === false) {
            // Change this to blast
            if (chain?.name === "Blast") {
                setIsWalletPopup(false);
            } else {
                setIsBlast(false);
                setIsWalletPopup(false);
            }
        }
    }, [web3ModalOpen]);

    useEffect(() => {
        if (!walletPopup) {
            if (address) {
                Cookie.set("wallet_address", address as string, {
                    expires: 1,
                });
            } else if (
                !address &&
                !currentTwitterData?.attributes?.wallet_address
            ) {
                setModalStep(0);
            }
            if (currentTwitterData && address) {
                Cookie.set(
                    "twitter_id",
                    currentTwitterData?.attributes?.twitter_id,
                    {
                        expires: 1,
                    }
                );
                Cookie.set("strapi_twitter_id", currentTwitterData?.id, {
                    expires: 1,
                });
                // Get Wallet data
                if (!currentTwitterData?.attributes?.wallet_address) {
                    axiosApi
                        .put(
                            `/api/twitter-accounts/${currentTwitterData?.id}`,
                            {
                                data: {
                                    is_wallet: true,
                                    wallet_address: address,
                                },
                            }
                        )
                        .then((response) => twitterMutate())
                        .catch((err) => {
                            console.log(err);
                        });
                }

                if (!currentTwitterData?.attributes?.wallet_address) {
                    setModalStep(0);
                } else if (
                    currentTwitterData?.attributes?.wallet_address &&
                    !playGameReady &&
                    !currentTwitterData?.attributes?.["is_socialaction"]
                ) {
                    setModalStep(1);
                } else if (
                    currentTwitterData?.attributes?.wallet_address &&
                    currentTwitterData?.attributes?.["is_socialaction"] &&
                    !playGameReady
                ) {
                    setModalStep(2);
                    setPlayGameReady(true);
                }
            }
        }
    }, [
        // @ts-ignore
        session?.user?.id,
        userData,
        modalStep,
        walletPopup,
        address,
        currentTwitterData,
        playGameReady,
    ]);

    useEffect(() => {
        if (
            verificationStatus.follow === "verified" &&
            verificationStatus.retweet === "verified" &&
            verificationStatus.like === "verified" &&
            verificationStatus.tweet === "verified"
        ) {
            setModalStep(2);
            if (currentTwitterData?.attributes?.["is_socialaction"] !== true) {
                axiosApi
                    .put(
                        `/api/twitter-accounts/${currentTwitterData?.["id"]}`,
                        {
                            data: {
                                is_socialaction: true,
                            },
                        }
                    )
                    .then((response) => {
                        if (response.status == 200) {
                            const updatedUserData = {
                                // @ts-ignore
                                ...userData,
                                is_socialaction: true,
                            };
                            setUserData(updatedUserData);
                            twitterMutate();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }, [verificationStatus]);

    if (!domLoaded) return <div></div>;

    return (
        <HeroLayout>
            <TwitterIntentHandler />
            <div
                style={{ zIndex: 119 }}
                className="flex justify-center items-center w-[80%] md:w-[60%] z-150 mx-auto relative h-[100vh]"
            >
                <div className="bg-white px-6 justify-center items-center md:px-12 py-6 md:py-12 rounded-[22px] mt-[30px] w-full flex flex-col gap-y-[15px] w-[1000px]">
                    {currentState === "index" && (
                        <div>
                            <div className="flex flex-col items-center md:items-start gap-y-[20px]">
                                <div className="flex justify-center w-full">
                                    {!session ? (
                                        <>
                                            <Button
                                                type="primary"
                                                style={{
                                                    border: "2px solid #000",
                                                    borderRadius: "0px",
                                                    backgroundColor: "#fff",
                                                    color: "#000",
                                                    fontWeight: "bold",
                                                }}
                                                onClick={() => signIn()}
                                            >
                                                <img
                                                    alt="X"
                                                    className="w-4 h-4"
                                                    src="/assets/x-logo-black.png"
                                                />
                                                <p>Login to X</p>
                                            </Button>
                                        </>
                                    ) : (
                                        <Popover
                                            content={
                                                <a
                                                    className="text-red-500 font-bold"
                                                    onClick={() => signOut()}
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
                                                }}
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
                                <div className="flex gap-x-[10px] items-center">
                                    <p className="font-bold text-black md:text-[16px] text-[12px]">
                                        1.{" "}
                                        <span>
                                            login via twitter and complete the
                                            one time verification of wallet and
                                        </span>
                                        <br></br>
                                        <span>
                                            &nbsp;&nbsp;&nbsp;
                                            <span>
                                                social tasks to play
                                                flappyblast.{" "}
                                            </span>
                                            <span className="text-red-500">
                                                *required
                                            </span>
                                        </span>
                                    </p>
                                    {/* <div className="p-[5px] rounded-[6px] bg-[#FF6666]">
										<p className="text-[#560000] md:text-[12px] text-[10px]">REQUIRED</p>
									</div> */}
                                </div>
                                <div className="flex gap-x-[10px] items-center">
                                    <p className="font-bold md:text-left text-center md:text-[16px] text-[12px]">
                                        2. claim free $FLAP for extra allocation
                                        only for partnered projects
                                    </p>
                                </div>
                                <p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
                                    3. top 100 players on flappyblast will get
                                    extra allocation
                                </p>
                                <p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
                                    4. goodluck and $FLAP up ;)
                                </p>
                            </div>
                            <div className="flex md:flex-row flex-col gap-x-[40px] justify-center items-center">
                                <div
                                    onClick={() => {
                                        if (!session) return;
                                        setCurrentState("flap");
                                    }}
                                    className={`md:block hidden relative mt-[25px] ${
                                        session
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                    }`}
                                >
                                    <Image
                                        width={300}
                                        height={100}
                                        alt="button"
                                        src={`/images/${
                                            session
                                                ? "flap_button.png"
                                                : "Flap_Disabled.png"
                                        }`}
                                    />
                                </div>
                                <div
                                    onClick={() => {
                                        if (!session) return;
                                        setCurrentState("flap");
                                    }}
                                    className={`block md:hidden relative mt-[25px] ${
                                        session
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                    }`}
                                >
                                    <Image
                                        width={150}
                                        height={100}
                                        alt="button"
                                        src={`/images/${
                                            session
                                                ? "flap_button.png"
                                                : "Flap_Disabled.png"
                                        }`}
                                    />
                                </div>
                                <div
                                    onClick={() => {
                                        if (
                                            !session &&
                                            !currentTwitterData?.attributes?.[
                                                "is_socialaction"
                                            ]
                                        )
                                            return;
                                        setPartnershipModal(true);
                                    }}
                                    className={`md:block hidden relative mt-[25px] ${
                                        session &&
                                        currentTwitterData?.attributes?.[
                                            "is_socialaction"
                                        ]
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                    }`}
                                >
                                    <Image
                                        width={300}
                                        height={100}
                                        alt="button"
                                        src={`/images/${
                                            session &&
                                            currentTwitterData?.attributes?.[
                                                "is_socialaction"
                                            ]
                                                ? "Partnership_Claim.png"
                                                : "Partnership_Claim_Disabled.png"
                                        }`}
                                    />
                                </div>
                                <div
                                    onClick={() => {
                                        if (
                                            !session &&
                                            !currentTwitterData?.attributes?.[
                                                "is_socialaction"
                                            ]
                                        )
                                            return;
                                        setPartnershipModal(true);
                                    }}
                                    className={`block md:hidden relative mt-[25px] ${
                                        session &&
                                        currentTwitterData?.attributes?.[
                                            "is_socialaction"
                                        ]
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                    }`}
                                >
                                    <Image
                                        width={150}
                                        height={100}
                                        alt="button"
                                        src={`/images/${
                                            session &&
                                            currentTwitterData?.attributes?.[
                                                "is_socialaction"
                                            ]
                                                ? "Partnership_Claim.png"
                                                : "Partnership_Claim_Disabled.png"
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {currentState === "flap" && (
                        <div className="flex flex-col gap-y-[20px] w-full">
                            <div className="flex justify-start">
                                {session && (
                                    <>
                                        <div className="flex flex-wrap gap-4 justify-between w-full">
                                            <Button
                                                style={{
                                                    border: "2px solid",
                                                }}
                                            >
                                                <img
                                                    alt="X"
                                                    className="w-4 h-4"
                                                    src="/assets/x-logo-black.png"
                                                />
                                                {/* @ts-ignore */}
                                                <p>@{session.username}</p>
                                            </Button>
                                            <div className="flex gap-2">
                                                <Button
                                                    style={{
                                                        border: "2px solid",
                                                    }}
                                                    onClick={() =>
                                                        setCurrentState(
                                                            "leaderboard"
                                                        )
                                                    }
                                                >
                                                    Leaderboards
                                                </Button>
                                                <Button
                                                    danger
                                                    style={{
                                                        border: "2px solid ",
                                                    }}
                                                    onClick={() =>
                                                        setCurrentState("index")
                                                    }
                                                >
                                                    Exit game
                                                </Button>
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
                                                    X account not eligible yet
                                                </div>
                                            }
                                            open={modalStep == 0}
                                            footer={null}
                                            closable={false} // Remove the "X" button
                                            // maskClosable={false} // Prevent closing by clicking outside
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div className="text-center flex flex-col gap-6 mb-6">
                                                    <div>
                                                        <p>
                                                            To become eligible,
                                                            please complete the
                                                            one-time tasks.
                                                        </p>
                                                        <p>
                                                            After that, you can
                                                            play FlappyBlast and
                                                            easily qualify for
                                                            the airdrop!
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            Step 1/2 - Connect
                                                            Wallet
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center items-center w-full gap-2">
                                                    <div className="w-fit">
                                                        <Button
                                                            type="primary"
                                                            onClick={() =>
                                                                handleConnectWallet()
                                                            }
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
                                                            className="font-bold"
                                                        >
                                                            Connect Wallet
                                                        </Button>
                                                    </div>
                                                    {!isBlast && (
                                                        <p className="text-red-500">
                                                            *Please switch your
                                                            network to Blast and
                                                            try again.
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-center bg-[#F0F0F0] p-4 font-bold mx-6 mt-4">
                                                    NOTICE: This action can only
                                                    be done once, you will not
                                                    able to change your wallet
                                                    address connected with you X
                                                    account with us
                                                </div>
                                            </div>
                                        </Modal>

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
                                                    X account not eligible yet
                                                </div>
                                            }
                                            open={modalStep == 1}
                                            footer={null}
                                            closable={false} // Remove the "X" button
                                            // maskClosable={false} // Prevent closing by clicking outside
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div className="text-center flex flex-col gap-6 mb-6">
                                                    <div>
                                                        <p>
                                                            To become eligible,
                                                            please complete the
                                                            one-time tasks.
                                                        </p>
                                                        <p>
                                                            After that, you can
                                                            play FlappyBlast and
                                                            easily qualify for
                                                            the airdrop!
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            Step 2/2 - Social
                                                            Campaign
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <a
                                                        href="https://twitter.com/intent/follow?screen_name=flappyblast"
                                                        onClick={() =>
                                                            handleOpenLink(
                                                                "follow"
                                                            )
                                                        }
                                                    >
                                                        <p className="">
                                                            1.{" "}
                                                            <span className="underline">
                                                                Follow
                                                                @Flappyblast on
                                                                X
                                                            </span>
                                                        </p>
                                                    </a>
                                                    {verificationStatus.follow ===
                                                    "unopened" ? (
                                                        <a href="https://twitter.com/intent/follow?screen_name=flappyblast">
                                                            <Button
                                                                type="primary"
                                                                onClick={() =>
                                                                    handleOpenLink(
                                                                        "follow"
                                                                    )
                                                                }
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
                                                                style={{
                                                                    border: "2px solid #000",
                                                                    borderRadius:
                                                                        "0px",
                                                                    backgroundColor:
                                                                        "#fff",
                                                                    color: "#000",
                                                                }}
                                                            >
                                                                Follow
                                                            </Button>
                                                        </a>
                                                    ) : (
                                                        <Button
                                                            type="primary"
                                                            onClick={() =>
                                                                handleVerification(
                                                                    "follow"
                                                                )
                                                            }
                                                            style={getSocialActionButtonStyles(
                                                                "follow"
                                                            )}
                                                            icon={
                                                                verificationStatus.follow ===
                                                                "unverified" ? (
                                                                    <CaretRightOutlined
                                                                        style={{
                                                                            color: "#000",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    false
                                                                )
                                                            }
                                                            iconPosition={"end"}
                                                        >
                                                            {verificationStatus.follow ===
                                                            "verifying"
                                                                ? "Verifying..."
                                                                : verificationStatus.follow ===
                                                                  "verified"
                                                                ? "Done"
                                                                : "Verify"}
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="flex justify-between">
                                                    <a
                                                        href="https://twitter.com/intent/retweet?tweet_id=463440424141459456"
                                                        onClick={() =>
                                                            handleOpenLink(
                                                                "retweet"
                                                            )
                                                        }
                                                    >
                                                        <p className="">
                                                            2.{" "}
                                                            <span className="underline">
                                                                Retweet
                                                                @Flappyblast&apos;s
                                                                post on X
                                                            </span>
                                                        </p>
                                                    </a>
                                                    {verificationStatus.retweet ===
                                                    "unopened" ? (
                                                        <a href="https://twitter.com/intent/retweet?tweet_id=463440424141459456">
                                                            <Button
                                                                type="primary"
                                                                onClick={() =>
                                                                    handleOpenLink(
                                                                        "retweet"
                                                                    )
                                                                }
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
                                                            >
                                                                Retweet
                                                            </Button>
                                                        </a>
                                                    ) : (
                                                        <Button
                                                            type="primary"
                                                            onClick={() =>
                                                                handleVerification(
                                                                    "retweet"
                                                                )
                                                            }
                                                            style={getSocialActionButtonStyles(
                                                                "retweet"
                                                            )}
                                                            icon={
                                                                verificationStatus.retweet ===
                                                                "unverified" ? (
                                                                    <CaretRightOutlined
                                                                        style={{
                                                                            color: "#000",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    false
                                                                )
                                                            }
                                                            iconPosition={"end"}
                                                        >
                                                            {verificationStatus.retweet ===
                                                            "verifying"
                                                                ? "Verifying..."
                                                                : verificationStatus.retweet ===
                                                                  "verified"
                                                                ? "Done"
                                                                : "Verify"}
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="flex justify-between">
                                                    <a
                                                        href="https://twitter.com/intent/like?tweet_id=463440424141459456"
                                                        onClick={() =>
                                                            handleOpenLink(
                                                                "like"
                                                            )
                                                        }
                                                    >
                                                        <p className="">
                                                            3.{" "}
                                                            <span className="underline">
                                                                Like
                                                                @Flappyblast&apos;s
                                                                post on X
                                                            </span>
                                                        </p>
                                                    </a>
                                                    {verificationStatus.like ===
                                                    "unopened" ? (
                                                        <a href="https://twitter.com/intent/like?tweet_id=463440424141459456">
                                                            <Button
                                                                type="primary"
                                                                onClick={() =>
                                                                    handleOpenLink(
                                                                        "like"
                                                                    )
                                                                }
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
                                                            >
                                                                Like
                                                            </Button>
                                                        </a>
                                                    ) : (
                                                        <Button
                                                            type="primary"
                                                            onClick={() =>
                                                                handleVerification(
                                                                    "like"
                                                                )
                                                            }
                                                            style={getSocialActionButtonStyles(
                                                                "like"
                                                            )}
                                                            icon={
                                                                verificationStatus.like ===
                                                                "unverified" ? (
                                                                    <CaretRightOutlined
                                                                        style={{
                                                                            color: "#000",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    false
                                                                )
                                                            }
                                                            iconPosition={"end"}
                                                        >
                                                            {verificationStatus.like ===
                                                            "verifying"
                                                                ? "Verifying..."
                                                                : verificationStatus.like ===
                                                                  "verified"
                                                                ? "Done"
                                                                : "Verify"}
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="flex justify-between">
                                                    <a
                                                        href="https://twitter.com/intent/tweet?text=Hello%20world&hashtags=yrdy"
                                                        onClick={() =>
                                                            handleOpenLink(
                                                                "tweet"
                                                            )
                                                        }
                                                    >
                                                        <p className="">
                                                            4.{" "}
                                                            <span className="underline">
                                                                Tweet about
                                                                @Flappyblast on
                                                                X
                                                            </span>
                                                        </p>
                                                    </a>
                                                    {verificationStatus.tweet ===
                                                    "unopened" ? (
                                                        <a href="https://twitter.com/intent/tweet?text=Hello%20world&hashtags=yrdy">
                                                            <Button
                                                                type="primary"
                                                                onClick={() =>
                                                                    handleOpenLink(
                                                                        "tweet"
                                                                    )
                                                                }
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
                                                            >
                                                                Tweet
                                                            </Button>
                                                        </a>
                                                    ) : (
                                                        <Button
                                                            type="primary"
                                                            onClick={() =>
                                                                handleVerification(
                                                                    "tweet"
                                                                )
                                                            }
                                                            style={getSocialActionButtonStyles(
                                                                "tweet"
                                                            )}
                                                            icon={
                                                                verificationStatus.tweet ===
                                                                "unverified" ? (
                                                                    <CaretRightOutlined
                                                                        style={{
                                                                            color: "#000",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    false
                                                                )
                                                            }
                                                            iconPosition={"end"}
                                                        >
                                                            {verificationStatus.tweet ===
                                                            "verifying"
                                                                ? "Verifying..."
                                                                : verificationStatus.tweet ===
                                                                  "verified"
                                                                ? "Done"
                                                                : "Verify"}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Modal>

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
                                                    Your X account is eligible
                                                    for airdrop 🎉
                                                </div>
                                            }
                                            open={modalStep == 2}
                                            onCancel={() => setModalStep(3)}
                                            footer={null}
                                            closable={false}
                                        >
                                            <div className="text-center my-6">
                                                <p>
                                                    Congrats! Just play
                                                    Flappyblast and share your
                                                    scores with us! Join our fun
                                                    Discord community to share
                                                    and compare. &nbsp;
                                                    <span className="underline font-bold">
                                                        Join here!
                                                    </span>
                                                </p>

                                                <div className="flex justify-center w-full">
                                                    <div
                                                        onClick={() =>
                                                            setModalStep(3)
                                                        }
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
                                                        onClick={() =>
                                                            setModalStep(3)
                                                        }
                                                        className="block md:hidden relative mt-[25px] cursor-pointer"
                                                    >
                                                        <Image
                                                            width={150}
                                                            height={100}
                                                            alt="button"
                                                            src="/images/flap_button.png"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Modal>
                                    </>
                                )}
                            </div>
                            <div
                                className={`rounded-[8px] w-full ${
                                    modalStep < 3 || modalStep == 10 || !session
                                        ? "bg-[#F1F1F1]"
                                        : ""
                                }`}
                            >
                                <div
                                    className={`flex flex-col justify-center${
                                        modalStep < 3 ||
                                        modalStep == 10 ||
                                        !session
                                            ? "mx-6 my-12"
                                            : ""
                                    }`}
                                >
                                    {modalStep === 0 || !session ? (
                                        <p className="text-center">
                                            Login to Twitter to play FlappyBlast
                                        </p>
                                    ) : (modalStep > 0 && modalStep < 3) ||
                                      modalStep == 10 ? (
                                        <p className="text-center">
                                            Complete tasks to play FlappyBlast
                                        </p>
                                    ) : (
                                        <>
                                            <FlappyBird />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {currentState === "leaderboard" && (
                        <>
                            <div className="flex flex-col gap-4 md:gap-0 md:flex-row items-center justify-between w-full">
                                <div className="pixel-caps text-md md:text-2xl">
                                    LEADERBOARDS
                                </div>
                                <Button
                                    onClick={() => setCurrentState("flap")}
                                    style={{
                                        border: "2px solid",
                                    }}
                                    icon={
                                        <LeftOutlined
                                            style={{ color: "#000" }}
                                        />
                                    }
                                    iconPosition={"start"}
                                >
                                    Return to the game
                                </Button>
                            </div>

                            <div className="overflow-y-auto max-h-96 w-full mt-6">
                                <table className="w-full">
                                    <thead className="pixel-caps bg-white sticky top-0 z-20">
                                        <tr className="table-header">
                                            <th className="py-2 md:px-4 text-xs md:text-base">
                                                RANK
                                            </th>
                                            <th className="py-2 md:px-4 text-xs md:text-base hidden md:table-cell">
                                                PP
                                            </th>
                                            <th className="py-2 md:px-4 text-xs md:text-base">
                                                USERNAME
                                            </th>
                                            <th className="py-2 md:px-4 text-xs md:text-base">
                                                POINTS
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="overflow-x-auto">
                                        {sortedLeaderboardsResult &&
                                            sortedLeaderboardsResult?.map(
                                                (
                                                    sortedLeaderboardData,
                                                    index
                                                ) => (
                                                    <tr
                                                        key={index}
                                                        className="table-row text-center border-black border-b-2 border-dashed"
                                                    >
                                                        <td className="py-4 px-2 whitespace-nowrap text-sm md:text-base">
                                                            {index + 1}
                                                        </td>
                                                        <td className="py-4 px-2 whitespace-nowrap hidden md:table-cell">
                                                            <div className="flex justify-center">
                                                                <img
                                                                    className="w-8 h-8 md:w-12 md:h-12 rounded-full"
                                                                    src={
                                                                        sortedLeaderboardData
                                                                            ?.attributes
                                                                            ?.twitter_pic ??
                                                                        ""
                                                                    }
                                                                    alt="avatar"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-2 whitespace-nowrap text-sm md:text-base">
                                                            {/* @ts-ignore */}@
                                                            {
                                                                sortedLeaderboardData
                                                                    ?.attributes
                                                                    ?.twitter_username
                                                            }
                                                        </td>
                                                        <td className="py-4 px-2 whitespace-nowrap text-sm md:text-base">
                                                            {
                                                                sortedLeaderboardData
                                                                    ?.attributes
                                                                    ?.high_score
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
                <Modal
                    className="z-[50]"
                    centered
                    title={
                        <div
                            style={{
                                textAlign: "center",
                                fontSize: "24px",
                                fontWeight: "bold",
                            }}
                        >
                            Partnership Checker
                        </div>
                    }
                    open={partnershipModal}
                    footer={null}
                    onClose={() => setPartnershipModal(false)}
                    onCancel={() => setPartnershipModal(false)}
                    closable // Remove the "X" button
                    maskClosable={false} // Prevent closing by clicking outside
                >
                    <div className="flex flex-col gap-2">
                        <div className="text-center flex flex-col gap-6">
                            <div>
                                <p>
                                    Select the project you belong to, but
                                    remember, you can only link with one
                                    project. Ensure you&apos;ve met all the
                                    requirements to successfully claim your
                                    rewards.
                                </p>
                            </div>
                        </div>
                        {!address ? (
                            <div className="flex flex-col justify-center items-center w-full gap-2">
                                <div className="w-fit">
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setPartnershipModal(false);
                                            open();
                                        }}
                                        style={{
                                            border: "2px solid #000",
                                            borderRadius: "0px",
                                            backgroundColor: "#fff",
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
                                        className="font-bold"
                                    >
                                        Connect Wallet
                                    </Button>
                                </div>
                                {chain?.name !== "Blast" && (
                                    <div>
                                        <p className="text-red-500">
                                            *Please switch your network to Blast
                                            and try again.
                                        </p>
                                        {/* <Button
                                            type="primary"
                                            onClick={() => {}}
                                            style={{
                                                border: "2px solid #000",
                                                borderRadius: "0px",
                                                backgroundColor: "#fff",
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
                                            className="font-bold"
                                        >
                                            Switch to Blast
                                        </Button> */}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div
                                    onClick={() => disconnect()}
                                    className="p-[12px] border-[3px] border-[#000] flex gap-x-[10px] cursor-pointer items-center w-fit mx-auto"
                                >
                                    {ensAvatar?.data && (
                                        <img
                                            className="w-[30px] h-[30px] hidden md:block rounded-full"
                                            src={ensAvatar?.data ?? ""}
                                        />
                                    )}
                                    <p className="font-bold md:text-[16px] text-[12px]">
                                        {address.slice(0, 10) +
                                            "..." +
                                            address.slice(address.length - 10)}
                                    </p>
                                    {ensName && (
                                        <p className="font-bold md:text-[16px] text-[12px]">
                                            {ensName}
                                        </p>
                                    )}
                                </div>
                                {chain?.name !== "Blast" && (
                                    <div className="mt-2 mx-auto">
                                        <p className="text-red-500 text-center">
                                            *Please switch your network to Blast
                                            and try again.
                                        </p>
                                        <div className="w-full flex justify-center my-3">
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    switchChain({
                                                        chainId: blast.id,
                                                    });
                                                }}
                                                style={{
                                                    border: "2px solid #000",
                                                    borderRadius: "0px",
                                                    backgroundColor: "#fff",
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
                        {addressNotMatch && (
                            <p className="text-red-500 text-center roboto">
                                *wrong wallet connected: connect to{" "}
                                <span className="font-bold">
                                    ...
                                    {currentTwitterData?.attributes?.wallet_address?.slice(
                                        33,
                                        currentTwitterData?.attributes
                                            ?.wallet_address?.length
                                    )}
                                </span>
                            </p>
                        )}
                        {dropdownValue !== "Choose Project" && (
                            <div className="flex gap-x-[10px] items-center justify-center roboto">
                                <p className="text-center">
                                    You have:{" "}
                                    {currentSelectedProject?.isNft
                                        ? `${currentSelectedContract?.data?.toString()} ${dropdownValue} NFT`
                                        : `${
                                              currentSelectedContract?.data
                                                  ? ethers
                                                        .formatUnits(
                                                            // @ts-ignore
                                                            currentSelectedContract?.data,
                                                            currentSelectedDecimals?.data
                                                        )
                                                        .toString()
                                                  : "0"
                                          } ${currentSelectedSymbol?.data}`}
                                </p>
                                <div
                                    className={`${
                                        currentSelectedProject?.isNft
                                            ? parseInt(
                                                  // @ts-ignore
                                                  currentSelectedContract?.data?.toString()
                                              ) > 0
                                                ? "bg-[#4FB768]"
                                                : "bg-[#B74F4F]"
                                            : parseFloat(
                                                  currentSelectedContract?.data
                                                      ? ethers
                                                            .formatUnits(
                                                                // @ts-ignore
                                                                currentSelectedContract?.data,
                                                                currentSelectedDecimals?.data
                                                            )
                                                            .toString()
                                                      : "0"
                                              ) > 100
                                            ? "bg-[#4FB768]"
                                            : "bg-[#B74F4F]"
                                    } rounded-[3px] p-[8px]`}
                                >
                                    <p className="text-white">
                                        {currentSelectedProject?.isNft
                                            ? parseInt(
                                                  // @ts-ignore
                                                  currentSelectedContract?.data?.toString()
                                              ) > 0
                                                ? "Eligible"
                                                : "Ineligible"
                                            : parseFloat(
                                                  currentSelectedContract?.data
                                                      ? ethers
                                                            .formatUnits(
                                                                // @ts-ignore
                                                                currentSelectedContract?.data,
                                                                currentSelectedDecimals?.data
                                                            )
                                                            .toString()
                                                      : "0"
                                              ) > 100.0
                                            ? "Eligible"
                                            : "Ineligible"}
                                    </p>
                                </div>
                            </div>
                        )}
                        <Dropdown
                            className="border border-[#BDBDBD] py-[11px] px-[19px] rounded-[10px] flex gap-x-[10px] cursor-pointer items-center"
                            overlay={menu}
                            trigger={["click"]}
                        >
                            <a
                                className={`${
                                    dropdownValue === "Choose Project"
                                        ? "text-[#878787]"
                                        : "text-[#000000]"
                                } flex justify-between`}
                            >
                                <Space>{dropdownValue}</Space>
                                <CaretDownOutlined style={{ color: "black" }} />
                            </a>
                        </Dropdown>

                        <Progress
                            size={{
                                height: 20,
                            }}
                            strokeColor="#4FB768"
                            status="success"
                            percent={(500000 / 1500000) * 100}
                            showInfo={false}
                        />
                        <p className="font-bold text-center">
                            500,000 / 1,500,000 Claimed
                        </p>
                        <div className="flex justify-center w-full mt-[10px]">
                            <div
                                onClick={() => {}}
                                className={`md:block hidden relative ${
                                    enableCheckBtn
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed"
                                }`}
                            >
                                <Image
                                    width={300}
                                    height={100}
                                    alt="button"
                                    src={`/images/${
                                        enableCheckBtn
                                            ? "Check_Btn.png"
                                            : "Check_Now_Disabled.png"
                                    }`}
                                />
                            </div>
                            <div
                                onClick={() => {}}
                                className={`block md:hidden relative ${
                                    enableCheckBtn
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed"
                                }`}
                            >
                                <Image
                                    width={150}
                                    height={100}
                                    alt="button"
                                    src={`/images/${
                                        enableCheckBtn
                                            ? "Check_Btn.png"
                                            : "Check_Now_Disabled.png"
                                    }`}
                                />
                            </div>
                        </div>
                        <a
                            onClick={() => setPartnershipModal(false)}
                            className="underline text-center cursor-pointer hover:underline text-[#1A202C] mt-2"
                        >
                            Return to previous page
                        </a>
                    </div>
                </Modal>
            </div>
        </HeroLayout>
    );
}
