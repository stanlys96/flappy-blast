// @ts-nocheck
import { HeroLayout } from "@/src/layouts/HeroLayout";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
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
    Spin,
    Pagination,
} from "antd";
import {
    ExportOutlined,
    CaretRightOutlined,
    LeftOutlined,
    CaretDownOutlined,
} from "@ant-design/icons";
import { axiosApi, fetcherStrapi } from "@/utils/axios";
import { DataObject } from "@/utils/helper";
import { ethers } from "ethers";
import { blast } from "viem/chains";
import { useRouter } from "next/router";

// AirdropPage
export default function AirdropPage() {
    const tableRef = useRef(null);
    const tweetText =
        "🚀 I'm joining the @flappyblast airdrop campaign! The campaign ends on June 21st, 1pm UTC. Their presale is coming soon and it's 100% unruggable! Don't miss out!";
    const encodedTweet = encodeURIComponent(tweetText);
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
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
    const [allocationModal, setAllocationModal] = useState(false);
    const [allocationDoneModal, setAllocationDoneModal] = useState(false);
    const [allocationFinishedModal, setAllocationFinishedModal] =
        useState(false);
    const [partnershipLoading, setPartnershipLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: twitterData, mutate: twitterMutate } = useSWR(
        // @ts-ignore
        `/api/twitter-accounts?filters[twitter_id][$eq]=${session?.user.id}`,
        fetcherStrapi
    );

    const { data: leaderboardsData } = useSWR(
        `/api/twitter-accounts?filters[high_score][$notNull]=true&filters[high_score][$gt]=0&sort=high_score:desc&pagination[page]=${currentPage}&pagination[pageSize]=25`,
        fetcherStrapi
    );

    const { data: partnersData } = useSWR(
        `/api/partner-lists?sort=order:asc`,
        fetcherStrapi
    );

    const { data: partnershipData, mutate: partnershipMutate } = useSWR(
        // @ts-ignore
        `/api/partnerships?filters[twitter_account][twitter_id][$eq]=${session?.user.id}&populate=*`,
        fetcherStrapi
    );

    const { data: allocationsData } = useSWR(
        `/api/sumAllAllocations`,
        fetcherStrapi
    );

    const partnersResult = partnersData?.data?.data;
    const currentTwitterData = twitterData?.data?.data?.[0];
    const leaderboardsResult = leaderboardsData?.data;
    const partnershipResult = partnershipData?.data?.data?.[0];
    const allocationsResult = allocationsData?.data;

    const router = useRouter();

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
    const [confirmAddress, setConfirmAddress] = useState(false);
    const currentSelectedProject = partnersResult?.find(
        (data: any) =>
            data?.attributes?.project_name?.toLowerCase() ===
            dropdownValue.toLowerCase()
    );

    const currentSelectedContract = useReadContract({
        abi: currentSelectedProject?.attributes?.abi ?? [],
        // @ts-ignore
        address:
            currentSelectedProject?.attributes?.contract_address ?? "0x000",
        functionName: "balanceOf",
        args: [address ?? ""],
    });

    const currentSelectedDecimals = useReadContract({
        abi: currentSelectedProject?.attributes?.abi ?? [],
        // @ts-ignore
        address:
            currentSelectedProject?.attributes?.contract_address ?? "0x000",
        functionName: "decimals",
    });

    const currentSelectedSymbol = useReadContract({
        abi: currentSelectedProject?.attributes?.abi ?? [],
        // @ts-ignore
        address:
            currentSelectedProject?.attributes?.contract_address ?? "0x000",
        functionName: "symbol",
    });

    const currentSelectedName = useReadContract({
        abi: currentSelectedProject?.attributes?.abi ?? [],
        // @ts-ignore
        address:
            currentSelectedProject?.attributes?.contract_address ?? "0x000",
        functionName: "name",
    });

    const currentSelectedContract2 = useReadContract({
        abi: currentSelectedProject?.attributes?.abi2 ?? [],
        // @ts-ignore
        address:
            currentSelectedProject?.attributes?.contract_address2 ?? "0x000",
        functionName: "balanceOf",
        args: [address ?? ""],
    });

    const currentSelectedDecimals2 = useReadContract({
        abi: currentSelectedProject?.attributes?.abi2 ?? [],
        // @ts-ignore
        address:
            currentSelectedProject?.attributes?.contract_address2 ?? "0x000",
        functionName: "decimals",
    });

    const currentSelectedSymbol2 = useReadContract({
        abi: currentSelectedProject?.attributes?.abi2 ?? [],
        // @ts-ignore
        address:
            currentSelectedProject?.attributes?.contract_address2 ?? "0x000",
        functionName: "symbol",
    });

    const currentSelectedName2 = useReadContract({
        abi: currentSelectedProject?.attributes?.abi2 ?? [],
        // @ts-ignore
        address:
            currentSelectedProject?.attributes?.contract_address2 ?? "0x000",
        functionName: "name",
    });

    const tokenData1 = currentSelectedContract?.data
        ? ethers
              .formatUnits(
                  // @ts-ignore
                  currentSelectedContract?.data,
                  currentSelectedDecimals?.data
              )
              .toString()
        : "0";

    const tokenData2 = currentSelectedContract2?.data
        ? ethers
              .formatUnits(
                  // @ts-ignore
                  currentSelectedContract2?.data,
                  currentSelectedDecimals2?.data
              )
              .toString()
        : "0";

    const [verificationStatus, setVerificationStatus] = useState<any>({
        follow: "unopened",
        retweet: "unopened",
        like: "unopened",
        tweet: "unopened",
        discord: "unopened",
        telegram: "unopened",
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
        address === currentTwitterData?.attributes?.wallet_address &&
        dropdownValue !== "Choose Project";

    const addressNotMatch =
        address !== currentTwitterData?.attributes?.wallet_address;

    const isEligible = !address
        ? false
        : currentSelectedProject?.attributes?.isNft
        ? parseInt(
              // @ts-ignore
              currentSelectedContract?.data?.toString()
          ) >= currentSelectedProject?.attributes?.min_value ||
          parseInt(
              // @ts-ignore
              currentSelectedContract2?.data?.toString()
          ) >= currentSelectedProject?.attributes?.min_value2
        : currentSelectedProject?.attributes?.is_multiple
        ? parseFloat(tokenData1) >=
              (currentSelectedProject?.attributes?.min_value ?? 0) ||
          parseFloat(tokenData2) >=
              (currentSelectedProject?.attributes?.min_value2 ?? 0)
        : parseFloat(tokenData1) >=
          (currentSelectedProject?.attributes?.min_value ?? 0);

    const menu = (
        <Menu className="scrollable-menu" onClick={handleMenuClick}>
            {partnersResult?.map((partnership: any) => (
                <Menu.Item key={partnership?.attributes?.project_name}>
                    <span>{partnership?.attributes?.project_name}</span>
                </Menu.Item>
            ))}
        </Menu>
    );

    const handleCheckPartnership = () => {
        if (!enableCheckBtn || !isEligible) return;
        setPartnershipLoading(true);
        axiosApi
            .post("/api/partnerships", {
                data: {
                    twitter_account: currentTwitterData?.id,
                    partner_list: currentSelectedProject?.id,
                    allocation:
                        currentSelectedProject?.attributes?.allocation ?? 0,
                    value1: currentSelectedProject?.attributes?.isNft
                        ? parseInt(
                              currentSelectedContract?.data?.toString() ?? "0"
                          )
                        : parseFloat(tokenData1 ?? "0"),
                    value2: currentSelectedProject?.attributes?.isNft
                        ? parseInt(
                              currentSelectedContract2?.data?.toString() ?? "0"
                          )
                        : parseFloat(tokenData2 ?? "0"),
                },
            })
            .then((response) => {
                partnershipMutate();
                setPartnershipModal(false);
                setAllocationModal(true);
                setPartnershipLoading(false);
            })
            .catch((err) => {
                setPartnershipLoading(false);
            });
    };

    const handlePartnershipButton = () => {
        if (!session || !currentTwitterData?.attributes?.["is_socialaction"])
            return;
        if (partnershipResult) {
            setAllocationDoneModal(true);
        } else {
            if (
                allocationsResult &&
                allocationsResult?.totalAllocations >=
                    allocationsResult?.maxAllocations
            ) {
                setAllocationFinishedModal(true);
            } else {
                setPartnershipModal(true);
            }
        }
    };

    const handleSuccessButton = async () => {
        setModalStep(3);
        axiosApi
            .put(`/api/twitter-accounts/${currentTwitterData?.id}`, {
                data: {
                    show_success_modal: false,
                },
            })
            .then((response) => twitterMutate())
            .catch((err) => {
                console.log(err);
            });
    };

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
            if (currentTwitterData) {
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

                if (
                    !currentTwitterData?.attributes?.wallet_address &&
                    address &&
                    confirmAddress
                ) {
                    // Get Wallet data
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
                        .then((response) => {
                            setConfirmLoading(false);
                            setConfirmAddress(false);
                            twitterMutate();
                        })
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
                    !currentTwitterData?.attributes?.show_success_modal
                ) {
                    setModalStep(3);
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
        confirmAddress,
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

    useEffect(() => {
        if (currentTwitterData?.attributes?.wallet_address) {
            Cookie.set(
                "wallet_address",
                currentTwitterData?.attributes?.wallet_address as string,
                {
                    expires: 1,
                }
            );
        } else if (address) {
            Cookie.set("wallet_address", address as string, {
                expires: 1,
            });
        }
    }, [address, currentTwitterData]);

    useEffect(() => {
        const handleRouteChange = () => {
            window.scrollTo(0, 0); // Scroll to top on route change
        };

        router.events.on("routeChangeComplete", handleRouteChange);

        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, []);

    useEffect(() => {
        if (currentTwitterData?.attributes?.cheater) {
            router.push("/");
        }
    }, [currentTwitterData]);

    if (!domLoaded) return <div></div>;

    return (
        <HeroLayout>
            <TwitterIntentHandler />
            <div
                style={{ zIndex: 119 }}
                className="flex justify-center items-center w-[90%] md:w-[60%] z-150 mx-auto relative h-[100vh]"
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
                                <div className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
                                    <p>
                                        3. top 100 players on flappyblast will
                                        get extra allocation
                                    </p>
                                    <p className="md:ml-8 ml-4 text-left">
                                        -Tier 1 alloc: Top 1 Player
                                    </p>
                                    <p className="md:ml-8 ml-4 text-left">
                                        -Tier 2 alloc: Top 10 Player
                                    </p>
                                    <p className="md:ml-8 ml-4 text-left">
                                        -Tier 3 alloc: Top 100 Player
                                    </p>
                                    <p className="md:ml-8 ml-4 text-left">
                                        -Tier 4 alloc: Top 1000 Player
                                    </p>
                                </div>
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
                                    onClick={handlePartnershipButton}
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
                                    onClick={handlePartnershipButton}
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
                                                {!address ? (
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
                                                                iconPosition={
                                                                    "end"
                                                                }
                                                                className="font-bold"
                                                            >
                                                                Connect Wallet
                                                            </Button>
                                                        </div>
                                                        {!isBlast && (
                                                            <p className="text-red-500">
                                                                *Please switch
                                                                your network to
                                                                Blast and try
                                                                again.
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div
                                                            onClick={() =>
                                                                disconnect()
                                                            }
                                                            className="p-[12px] border-[3px] border-[#000] flex gap-x-[10px] cursor-pointer items-center w-fit mx-auto"
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
                                                                {address.slice(
                                                                    0,
                                                                    10
                                                                ) +
                                                                    "..." +
                                                                    address.slice(
                                                                        address.length -
                                                                            10
                                                                    )}
                                                            </p>
                                                            {ensName && (
                                                                <p className="font-bold md:text-[16px] text-[12px]">
                                                                    {ensName}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {chain?.name !==
                                                            "Blast" && (
                                                            <div className="mt-2 mx-auto">
                                                                <p className="text-red-500 text-center">
                                                                    *Please
                                                                    switch your
                                                                    network to
                                                                    Blast and
                                                                    try again.
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
                                                                        Switch
                                                                        to Blast
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="text-center bg-[#F0F0F0] p-4 font-bold mx-6 mt-4">
                                                    NOTICE: This action can only
                                                    be done once, you will not
                                                    able to change your wallet
                                                    address connected with you X
                                                    account with us
                                                </div>
                                                <div className="flex justify-center w-full">
                                                    {confirmLoading ? (
                                                        <Spin
                                                            className="md:block hidden"
                                                            size="large"
                                                        />
                                                    ) : (
                                                        <div
                                                            onClick={() => {
                                                                setConfirmLoading(
                                                                    true
                                                                );
                                                                setConfirmAddress(
                                                                    true
                                                                );
                                                            }}
                                                            className="md:block hidden relative mt-[25px] cursor-pointer"
                                                        >
                                                            <Image
                                                                width={250}
                                                                height={100}
                                                                alt="button"
                                                                src="/images/Confirm_Btn.svg"
                                                            />
                                                        </div>
                                                    )}
                                                    {confirmLoading ? (
                                                        <Spin
                                                            className="block md:hidden"
                                                            size="large"
                                                        />
                                                    ) : (
                                                        <div
                                                            onClick={() => {
                                                                setConfirmLoading(
                                                                    true
                                                                );
                                                                setConfirmAddress(
                                                                    true
                                                                );
                                                            }}
                                                            className="block md:hidden relative mt-[25px] cursor-pointer"
                                                        >
                                                            <Image
                                                                width={150}
                                                                height={100}
                                                                alt="button"
                                                                src="/images/Confirm_Btn.svg"
                                                            />
                                                        </div>
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
                                                        href="https://twitter.com/intent/retweet?tweet_id=1802996855074370020"
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
                                                        <a href="https://twitter.com/intent/retweet?tweet_id=1802996855074370020">
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
                                                        href="https://twitter.com/intent/like?tweet_id=1802996855074370020"
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
                                                        <a href="https://twitter.com/intent/like?tweet_id=1802996855074370020">
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
                                                        href={`https://twitter.com/intent/tweet?text=${encodedTweet}`}
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
                                                        <a
                                                            href={`https://twitter.com/intent/tweet?text=${encodedTweet}`}
                                                        >
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
                                                <div className="flex justify-between">
                                                    <a
                                                        target="_blank"
                                                        href="https://discord.gg/qNcNxfVmVA"
                                                        onClick={() =>
                                                            handleOpenLink(
                                                                "discord"
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-center gap-x-2">
                                                            <span>5. </span>
                                                            <span className="underline">
                                                                Join Flappy
                                                                Blast&apos;s
                                                                Discord Server
                                                            </span>
                                                            <span className="text-red-500">
                                                                *not required
                                                            </span>
                                                        </div>
                                                    </a>
                                                    {verificationStatus.discord ===
                                                    "unopened" ? (
                                                        <a
                                                            target="_blank"
                                                            href="https://discord.gg/qNcNxfVmVA"
                                                        >
                                                            <Button
                                                                type="primary"
                                                                onClick={() =>
                                                                    handleOpenLink(
                                                                        "discord"
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
                                                                Join
                                                            </Button>
                                                        </a>
                                                    ) : (
                                                        <Button
                                                            type="primary"
                                                            onClick={() =>
                                                                handleVerification(
                                                                    "discord"
                                                                )
                                                            }
                                                            style={getSocialActionButtonStyles(
                                                                "discord"
                                                            )}
                                                            icon={
                                                                verificationStatus.discord ===
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
                                                            {verificationStatus.discord ===
                                                            "verifying"
                                                                ? "Verifying..."
                                                                : verificationStatus.discord ===
                                                                  "verified"
                                                                ? "Done"
                                                                : "Verify"}
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="flex justify-between">
                                                    <a
                                                        target="_blank"
                                                        href="https://t.me/+esBMo_0AwCcwZWZl"
                                                        onClick={() =>
                                                            handleOpenLink(
                                                                "discord"
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-center gap-x-2">
                                                            <span>6. </span>
                                                            <span className="underline">
                                                                Join Flappy
                                                                Blast&apos;s
                                                                Telegram Channel
                                                            </span>{" "}
                                                            <span className="text-red-500">
                                                                *not required
                                                            </span>
                                                        </div>
                                                    </a>
                                                    {verificationStatus.telegram ===
                                                    "unopened" ? (
                                                        <a
                                                            target="_blank"
                                                            href="https://t.me/+esBMo_0AwCcwZWZl"
                                                        >
                                                            <Button
                                                                type="primary"
                                                                onClick={() =>
                                                                    handleOpenLink(
                                                                        "telegram"
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
                                                                Join
                                                            </Button>
                                                        </a>
                                                    ) : (
                                                        <Button
                                                            type="primary"
                                                            onClick={() =>
                                                                handleVerification(
                                                                    "telegram"
                                                                )
                                                            }
                                                            style={getSocialActionButtonStyles(
                                                                "telegram"
                                                            )}
                                                            icon={
                                                                verificationStatus.telegram ===
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
                                                            {verificationStatus.telegram ===
                                                            "verifying"
                                                                ? "Verifying..."
                                                                : verificationStatus.telegram ===
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
                                            onOk={handleSuccessButton}
                                            onCancel={handleSuccessButton}
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
                                                    <a
                                                        href="https://discord.gg/qNcNxfVmVA"
                                                        target="_blank"
                                                        className="underline cursor-pointer font-bold"
                                                    >
                                                        Join here!
                                                    </a>
                                                </p>

                                                <div className="flex justify-center w-full">
                                                    <div
                                                        onClick={() => {
                                                            handleSuccessButton();
                                                        }}
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
                                                        onClick={() => {
                                                            handleSuccessButton();
                                                        }}
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
                                    onClick={() => {
                                        setCurrentPage(1);
                                        setCurrentState("flap");
                                    }}
                                    style={{
                                        border: "2px solid",
                                    }}
                                    icon={
                                        <LeftOutlined
                                            style={{
                                                color: "#000",
                                            }}
                                        />
                                    }
                                    iconPosition={"start"}
                                >
                                    Return to the game
                                </Button>
                            </div>

                            <div
                                ref={tableRef}
                                className="scrollable-menu-2 max-h-96 w-full mt-6"
                            >
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
                                        {leaderboardsResult &&
                                            leaderboardsResult?.data?.map(
                                                (
                                                    sortedLeaderboardData: DataObject,
                                                    index: number
                                                ) => (
                                                    <tr
                                                        key={index}
                                                        className="table-row text-center border-black border-b-2 border-dashed"
                                                    >
                                                        <td className="py-4 px-2 whitespace-nowrap text-sm md:text-base">
                                                            {(currentPage - 1) *
                                                                25 +
                                                                index +
                                                                1}
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
                            <Pagination
                                className="bg-[#149309] rounded-[16px]"
                                showSizeChanger={false}
                                defaultCurrent={1}
                                total={
                                    leaderboardsResult?.meta?.pagination
                                        ?.total ?? 0
                                }
                                pageSize={
                                    leaderboardsResult?.meta?.pagination
                                        ?.pageSize ?? 0
                                }
                                onChange={(page) => {
                                    setCurrentPage(page);
                                    if (tableRef) {
                                        tableRef.current?.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                            />
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
                                <div className="text-center flex flex-row gap-x-2 items-center">
                                    <p>You have: </p>
                                    <div className="flex flex-col gap-y-2 items-end">
                                        <span>
                                            {currentSelectedProject?.attributes
                                                ?.isNft
                                                ? `${
                                                      currentSelectedContract?.data?.toString() ??
                                                      "0"
                                                  } ${
                                                      currentSelectedName?.data
                                                  } NFT`
                                                : `${tokenData1} ${
                                                      currentSelectedSymbol?.data?.toString()?.[0] ===
                                                      "$"
                                                          ? currentSelectedSymbol?.data
                                                          : "$" +
                                                            currentSelectedSymbol?.data
                                                  }`}
                                        </span>
                                        {currentSelectedProject?.attributes
                                            ?.is_multiple && (
                                            <span>
                                                {currentSelectedProject
                                                    ?.attributes?.isNft
                                                    ? `${currentSelectedContract2?.data?.toString()} ${
                                                          currentSelectedName2?.data
                                                      } NFT`
                                                    : `${tokenData2} ${
                                                          currentSelectedSymbol2?.data?.toString()?.[0] ===
                                                          "$"
                                                              ? currentSelectedSymbol2?.data
                                                              : "$" +
                                                                currentSelectedSymbol2?.data
                                                      }`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        isEligible
                                            ? "bg-[#4FB768]"
                                            : "bg-[#B74F4F]"
                                    } rounded-[3px] p-[8px]`}
                                >
                                    <p className="text-white">
                                        {isEligible
                                            ? "Eligible"
                                            : "Not eligible"}
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
                                <CaretDownOutlined
                                    style={{
                                        color: "black",
                                    }}
                                />
                            </a>
                        </Dropdown>

                        <Progress
                            size={{
                                height: 20,
                            }}
                            strokeColor="#4FB768"
                            status="success"
                            percent={
                                (allocationsResult?.totalAllocations /
                                    allocationsResult?.maxAllocations) *
                                100
                            }
                            showInfo={false}
                        />
                        <p className="font-bold text-center">
                            {allocationsResult?.totalAllocations?.toLocaleString(
                                "en-US"
                            )}{" "}
                            /{" "}
                            {allocationsResult?.maxAllocations?.toLocaleString(
                                "en-US"
                            )}{" "}
                            Claimed
                        </p>
                        <div className="flex justify-center w-full mt-[10px]">
                            {partnershipLoading ? (
                                <Spin
                                    className="md:block hidden"
                                    size="large"
                                />
                            ) : (
                                <div
                                    onClick={handleCheckPartnership}
                                    className={`md:block hidden relative ${
                                        enableCheckBtn && isEligible
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                    }`}
                                >
                                    <Image
                                        width={300}
                                        height={100}
                                        alt="button"
                                        src={`/images/${
                                            enableCheckBtn && isEligible
                                                ? "Check_Btn.png"
                                                : "Check_Now_Disabled.png"
                                        }`}
                                    />
                                </div>
                            )}

                            {partnershipLoading ? (
                                <Spin
                                    className="block md:hidden"
                                    size="large"
                                />
                            ) : (
                                <div
                                    onClick={handleCheckPartnership}
                                    className={`block md:hidden relative ${
                                        enableCheckBtn && isEligible
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                    }`}
                                >
                                    <Image
                                        width={150}
                                        height={100}
                                        alt="button"
                                        src={`/images/${
                                            enableCheckBtn && isEligible
                                                ? "Check_Btn.png"
                                                : "Check_Now_Disabled.png"
                                        }`}
                                    />
                                </div>
                            )}
                        </div>
                        <a
                            onClick={() => {
                                if (partnershipLoading) return;
                                setPartnershipModal(false);
                            }}
                            className="underline text-center cursor-pointer hover:underline text-[#1A202C] mt-2"
                        >
                            Return to previous page
                        </a>
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
                            Extra allocation claimed 🎉
                        </div>
                    }
                    open={allocationModal}
                    footer={null}
                    closable={false} // Remove the "X" button
                    // maskClosable={false} // Prevent closing by clicking outside
                >
                    <div className="flex flex-col gap-2">
                        <div className="text-center flex flex-col gap-6">
                            <p>
                                Congratulations! Your wallet is now successfully
                                connected to the{" "}
                                {partnershipResult?.attributes?.partner_list
                                    ?.data?.attributes?.project_name ??
                                    currentSelectedProject?.attributes
                                        ?.project_name}{" "}
                                project. Just a heads up, you can only claim the
                                extra allocation once !
                            </p>
                        </div>
                        <a
                            onClick={() => setAllocationModal(false)}
                            className="underline text-center cursor-pointer hover:underline text-[#1A202C] mt-2"
                        >
                            Return to previous page
                        </a>
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
                            You have claimed this already
                        </div>
                    }
                    open={allocationDoneModal}
                    footer={null}
                    closable={false} // Remove the "X" button
                    // maskClosable={false} // Prevent closing by clicking outside
                >
                    <div className="flex flex-col gap-2">
                        <div className="text-center flex flex-col gap-6">
                            <p>
                                Your wallet has been linked to the{" "}
                                {partnershipResult?.attributes?.partner_list
                                    ?.data?.attributes?.project_name ??
                                    currentSelectedProject?.attributes
                                        ?.project_name}{" "}
                                project. Remember, you can only connect with one
                                project at a time.
                            </p>
                        </div>
                        <a
                            onClick={() => setAllocationDoneModal(false)}
                            className="underline text-center cursor-pointer hover:underline text-[#1A202C] mt-2"
                        >
                            Return to previous page
                        </a>
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
                            Allocation has already finished
                        </div>
                    }
                    open={allocationFinishedModal}
                    footer={null}
                    closable={false} // Remove the "X" button
                    // maskClosable={false} // Prevent closing by clicking outside
                >
                    <div className="flex flex-col gap-2">
                        <div className="text-center flex flex-col gap-6">
                            <p>Max allocation has been reached.</p>
                        </div>
                        <a
                            onClick={() => setAllocationFinishedModal(false)}
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
