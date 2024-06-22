import { MarioHole } from "@/src/components/MarioHoleSvg";
import { HeroLayout } from "@/src/layouts/HeroLayout";
import { useState, useEffect, useRef } from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
    Button,
    Pagination,
    Popover,
    Radio,
    RadioChangeEvent,
    Spin,
} from "antd";
import { axiosApi, fetcherStrapi } from "@/utils/axios";
import useSWR from "swr";
import copy from "clipboard-copy";
import Swal from "sweetalert2";
import { LeftOutlined } from "@ant-design/icons";
import { DataObject } from "@/utils/helper";

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

export default function ReferralPage() {
    const tableRef = useRef(null);
    const { data: session, status } = useSession();
    const { address, isConnecting } = useAccount();
    const { disconnect } = useDisconnect();
    const [currentState, setCurrentState] = useState<"index" | "leaderboard">(
        "index"
    );
    const { data: ensName } = useEnsName({
        address,
    });
    const [domLoaded, setDomLoaded] = useState(false);
    const ensAvatar = useEnsAvatar({
        name: ensName ?? "",
    });

    const [currentPage, setCurrentPage] = useState(1);

    const { data: leaderboardsData } = useSWR(
        `/api/twitter-accounts?filters[presale_points][$notNull]=true&filters[presale_points][$gt]=0&sort=presale_points:desc&pagination[page]=${currentPage}&pagination[pageSize]=25`,
        fetcherStrapi
    );

    const leaderboardsResult = leaderboardsData?.data;

    const [refferalRadioValue, setRefferalRadioValue] = useState<
        "flappyblast" | "bladeswap"
    >("flappyblast");
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
        `/api/twitter-accounts?filters[twitter_id][$eq]=${session?.user.id}&populate=*`,
        fetcherStrapi
    );

    const currentTwitterData = twitterData?.data?.data?.[0];
    const { data: referredPeopleData } = useSWR(
        `/api/getUniquePresales?id=${currentTwitterData?.id}`,
        fetcherStrapi
    );

    const referredPeopleResult = referredPeopleData?.data;
    const { open } = useWeb3Modal();

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
        <HeroLayout>
            <div
                style={{ zIndex: 119 }}
                className="flex justify-center items-center w-[80%] md:w-[60%] z-150 mx-auto relative h-[130vh] md:h-[100vh]"
            >
                <div className="bg-white px-[15px] justify-center items-center md:px-[60px] py-[20px] rounded-[22px] mt-[30px] w-full flex flex-col gap-y-[15px]">
                    {currentState === "index" && (
                        <div className="flex flex-col gap-y-[15px]">
                            <div className="flex justify-between items-center w-full flex-col md:flex-row gap-y-3">
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
                                {/* <div
                                    onClick={() =>
                                        setCurrentState("leaderboard")
                                    }
                                    className="border border-[#BDBDBD] py-[8px] px-[19px] rounded-[10px] flex gap-x-[10px] cursor-pointer items-center"
                                >
                                    <p className="font-bold md:text-[16px] text-[12px]">
                                        Leaderboards
                                    </p>
                                </div> */}
                            </div>
                            <div className="md:flex-row flex-col bg-[#B7CC5B] rounded-[8px] p-[24px] w-full flex gap-x-[20px] items-center">
                                <MarioHole className="md:w-[151px] md:h-[164px] w-[100px] h-[100px]" />
                                <div className="flex flex-col gap-y-[5px]">
                                    <p className="pixel-caps md:text-[16px] text-[10px] md:text-left text-center md:mt-0 mt-[10px]">
                                        Referral Sale Link
                                    </p>
                                    {!currentTwitterData?.attributes
                                        ?.wallet_address ? (
                                        <div className="mt-2">
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
                                        <p className="roboto md:text-left text-center">
                                            Your wallet address:{" "}
                                            {currentTwitterData?.attributes?.wallet_address?.slice(
                                                0,
                                                5
                                            ) +
                                                "..." +
                                                currentTwitterData?.attributes?.wallet_address?.slice(
                                                    currentTwitterData
                                                        ?.attributes
                                                        ?.wallet_address
                                                        ?.length - 5
                                                )}
                                        </p>
                                    )}
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
                                    <p className="md:text-[16px] text-[12px] md:text-left text-center font-bold">
                                        Your score:{" "}
                                        {currentTwitterData?.attributes
                                            ?.presale_points ?? "0"}
                                    </p>
                                    <p className="md:text-[16px] text-[12px] md:text-left text-center">
                                        You referred:{" "}
                                        {referredPeopleResult?.count ?? "0"}{" "}
                                        friends
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-[20px]">
                                <p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
                                    1. referral score will be calculated by the
                                    amount of eth your friend has committed for
                                    the presale.
                                </p>
                                <p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
                                    2. referral campaign will end after sale
                                    ends. we will distribute rewards after token
                                    launch.
                                </p>
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
                                        setCurrentState("index");
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
                                    Return to referral
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
                                                            {sortedLeaderboardData
                                                                ?.attributes
                                                                ?.boosted
                                                                ? sortedLeaderboardData
                                                                      ?.attributes
                                                                      ?.boost_multiplier *
                                                                  sortedLeaderboardData
                                                                      ?.attributes
                                                                      ?.presale_points
                                                                : sortedLeaderboardData
                                                                      ?.attributes
                                                                      ?.presale_points}
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
                                        // @ts-ignore
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
            </div>
        </HeroLayout>
    );
}
