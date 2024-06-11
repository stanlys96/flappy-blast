import { HeroLayout } from "@/src/layouts/HeroLayout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import FlappyBird from "@/src/components/FlappyBird";
import TwitterIntentHandler from "@/src/components/TwitterIntentHandler";
import useSWR from "swr";
import Cookie from "js-cookie";
import { signIn, signOut, useSession } from "next-auth/react";
// import { getUsers } from "./api/strapi";
import { Button, Modal } from "antd";
import {
  ExportOutlined,
  CaretRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { axiosApi, fetcherStrapi } from "@/utils/axios";

export default function AirdropPage() {
  const { data: session, status } = useSession();
  const { address } = useAccount();
  const [isClientMobile, setIsClientMobile] = useState(false);
  const [currentState, setCurrentState] = useState<
    "index" | "flap" | "leaderboard"
  >("index");
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const [domLoaded, setDomLoaded] = useState(false);
  const ensAvatar = useEnsAvatar({ name: ensName ?? "" });
  const { open } = useWeb3Modal();
  const [data, setData] = useState(null);
  const { data: walletData, mutate: walletMutate } = useSWR(
    `/api/wallet-accounts?filters[wallet_address][$eq]=${address}`,
    fetcherStrapi
  );

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

  const [isTwitterModalOpen, setIsTwitterModalOpen] = useState(true);

  const [verificationStatus, setVerificationStatus] = useState({
    follow: "unopened",
    retweet: "unopened",
    like: "unopened",
    tweet: "unopened",
  });

  const handleOpenLink = (button: string) => {
    setTimeout(() => {
      setVerificationStatus((prevStatus) => ({
        ...prevStatus,
        [button]: "unverified",
      }));
    }, 1000);
  };

  const handleVerification = (button: string) => {
    setVerificationStatus((prevStatus) => ({
      ...prevStatus,
      [button]: "verifying",
    }));
    const randomDelay = Math.floor(Math.random() * 3000) + 1000; // Random delay between 1 to 4 seconds
    setTimeout(() => {
      setVerificationStatus((prevStatus) => ({
        ...prevStatus,
        [button]: "verified",
      }));
    }, randomDelay);
  };

  const [isAllVerifiedModalOpen, setIsAllVerifiedModalOpen] = useState(false);
  const [twitterAllVerified, setTwitterAllVerified] = useState(false);

  useEffect(() => {
    if (
      verificationStatus.follow === "verified" &&
      verificationStatus.retweet === "verified" &&
      verificationStatus.like === "verified" &&
      verificationStatus.tweet === "verified"
    ) {
      setTimeout(() => {
        setTwitterAllVerified(true);
        setIsAllVerifiedModalOpen(true);
        setIsTwitterModalOpen(false);
      }, 2000); // Delay in milliseconds
    }
  }, [verificationStatus]);

  useEffect(() => {
    if (address) {
      axiosApi
        .get(`/api/wallet-accounts?filters[wallet_address][$eq]=${address}`)
        .then((response) => {
          if (response?.data?.data.length === 0) {
            axiosApi
              .post("/api/wallet-accounts", {
                data: {
                  wallet_address: address,
                },
              })
              .then((response) => {
                walletMutate();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      Cookie.set("wallet_address", address as string, {
        expires: 1,
      });
    }
  }, [address, walletData]);

  if (!domLoaded) return <div></div>;

  return (
    <HeroLayout>
      <TwitterIntentHandler />
      <div
        style={{ zIndex: 119 }}
        className="flex justify-center items-center w-[80%] md:w-[60%] z-150 mx-auto relative h-[100vh]"
      >
        <div className="bg-white px-[30px] justify-center items-center md:px-[60px] py-[100px] rounded-[22px] mt-[30px] w-full flex flex-col gap-y-[15px] w-[1000px]">
          {/* <div className="flex flex-col gap-y-[20px] w-full">
						<div className="flex flex-col justify-start">
							{!session && (
								<>
									<div
										onClick={() => signIn()}
										className="border border-[#BDBDBD] py-[11px] px-[19px] rounded-[10px] flex gap-x-[10px] cursor-pointer items-center"
									>
										<p className="font-bold md:text-[16px] text-[12px]">Login to X</p>
									</div>
								</>
							)}
							{session && (
								<>
									<div className="flex flex-col w-fit gap-y-4">
										<div>Hi, {session.user?.name}</div>
										<div
											onClick={() => signOut()}
											className="border border-[#BDBDBD] py-[11px] px-[19px] rounded-[10px] flex gap-x-[10px] cursor-pointer items-center"
										>
											<p className="font-bold md:text-[16px] text-[12px]">Logout from X</p>
										</div>
									</div>

									<Modal
										centered
										title={
											<div style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
												X account not eligible yet
											</div>
										}
										open={isTwitterModalOpen && !twitterAllVerified}
										onCancel={() => setIsTwitterModalOpen(false)}
										footer={null}
										closable={false} // Remove the "X" button
										// maskClosable={false} // Prevent closing by clicking outside
									>
										<div className="flex flex-col gap-2">
											<div className="text-center flex flex-col gap-6 mb-6">
												<div>
													<p>To become eligible, please complete the one-time tasks.</p>
													<p>
														After that, you can play FlappyBlast and easily qualify for the
														airdrop!
													</p>
												</div>
												<div>
													<p>Step 2/2 - Social Campaign</p>
												</div>
											</div>
											<div className="flex justify-between">
												<a href="https://twitter.com/intent/follow?screen_name=flappyblast">
													<p className=" font-bold">
														1. <span className="underline">Follow @Flappyblast on X</span>
													</p>
												</a>
												{verificationStatus.follow === "unopened" ? (
													<a href="https://twitter.com/intent/follow?screen_name=flappyblast">
														<Button
															type="primary"
															onClick={() => handleOpenLink("follow")}
															icon={<ExportOutlined />}
															iconPosition={"end"}
														>
															Follow
														</Button>
													</a>
												) : (
													<Button
														type="primary"
														onClick={() => handleVerification("follow")}
														loading={
															verificationStatus.follow === "verifying" ? true : false
														}
														icon={
															verificationStatus.follow === "unverified" ? (
																<CaretRightOutlined />
															) : verificationStatus.follow === "verified" ? (
																<CheckOutlined />
															) : (
																false
															)
														}
														iconPosition={"end"}
													>
														{verificationStatus.follow === "verifying"
															? "Verifying..."
															: verificationStatus.follow === "verified"
															? "Verified"
															: "Verify"}
													</Button>
												)}
											</div>
											<div className="flex justify-between">
												<a href="https://twitter.com/intent/retweet?tweet_id=463440424141459456">
													<p className=" font-bold">
														2.{" "}
														<span className="underline">
															Retweet @Flappyblast's post on X
														</span>
													</p>
												</a>
												{verificationStatus.retweet === "unopened" ? (
													<a href="https://twitter.com/intent/retweet?tweet_id=463440424141459456">
														<Button
															type="primary"
															onClick={() => handleOpenLink("retweet")}
															icon={<ExportOutlined />}
															iconPosition={"end"}
														>
															Retweet
														</Button>
													</a>
												) : (
													<Button
														type="primary"
														onClick={() => handleVerification("retweet")}
														loading={
															verificationStatus.retweet === "verifying" ? true : false
														}
														icon={
															verificationStatus.retweet === "unverified" ? (
																<CaretRightOutlined />
															) : verificationStatus.retweet === "verified" ? (
																<CheckOutlined />
															) : (
																false
															)
														}
														iconPosition={"end"}
													>
														{verificationStatus.retweet === "verifying"
															? "Verifying..."
															: verificationStatus.retweet === "verified"
															? "Verified"
															: "Verify"}
													</Button>
												)}
											</div>
											<div className="flex justify-between">
												<a href="https://twitter.com/intent/like?tweet_id=463440424141459456">
													<p className=" font-bold">
														3.{" "}
														<span className="underline">Like @Flappyblast's post on X</span>
													</p>
												</a>
												{verificationStatus.like === "unopened" ? (
													<a href="https://twitter.com/intent/like?tweet_id=463440424141459456">
														<Button
															type="primary"
															onClick={() => handleOpenLink("like")}
															icon={<ExportOutlined />}
															iconPosition={"end"}
														>
															Like
														</Button>
													</a>
												) : (
													<Button
														type="primary"
														onClick={() => handleVerification("like")}
														loading={verificationStatus.like === "verifying" ? true : false}
														icon={
															verificationStatus.like === "unverified" ? (
																<CaretRightOutlined />
															) : verificationStatus.like === "verified" ? (
																<CheckOutlined />
															) : (
																false
															)
														}
														iconPosition={"end"}
													>
														{verificationStatus.like === "verifying"
															? "Verifying..."
															: verificationStatus.like === "verified"
															? "Verified"
															: "Verify"}
													</Button>
												)}
											</div>
											<div className="flex justify-between">
												<a href="https://twitter.com/intent/tweet?text=Hello%20world&hashtags=yrdy">
													<p className=" font-bold">
														4.{" "}
														<span className="underline">Tweet about @Flappyblast on X</span>
													</p>
												</a>
												{verificationStatus.tweet === "unopened" ? (
													<a href="https://twitter.com/intent/tweet?text=Hello%20world&hashtags=yrdy">
														<Button
															type="primary"
															onClick={() => handleOpenLink("tweet")}
															icon={<ExportOutlined />}
															iconPosition={"end"}
														>
															Tweet
														</Button>
													</a>
												) : (
													<Button
														type="primary"
														onClick={() => handleVerification("tweet")}
														loading={
															verificationStatus.tweet === "verifying" ? true : false
														}
														icon={
															verificationStatus.tweet === "unverified" ? (
																<CaretRightOutlined />
															) : verificationStatus.tweet === "verified" ? (
																<CheckOutlined />
															) : (
																false
															)
														}
														iconPosition={"end"}
													>
														{verificationStatus.tweet === "verifying"
															? "Verifying..."
															: verificationStatus.tweet === "verified"
															? "Verified"
															: "Verify"}
													</Button>
												)}
											</div>
										</div>
									</Modal>
									<Modal
										centered
										title={
											<div style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
												Your X account is eligible for airdrop 🎉
											</div>
										}
										open={!isTwitterModalOpen && isAllVerifiedModalOpen && twitterAllVerified}
										onCancel={() => setIsAllVerifiedModalOpen(false)}
										footer={null}
										closable={false}
									>
										<div className="text-center my-6">
											<p>
												Congrats! Just play Flappyblast and share your scores with us! Join our
												fun Discord community to share and compare.
												<span className="underline">Join here!</span>
											</p>
										</div>
									</Modal>
								</>
							)}
						</div>
					</div> */}
          {/* {currentState === "index" && (
						<div>
							<div className="flex flex-col gap-y-[20px]">
								<div className="flex gap-x-[10px] items-center">
									<p className="font-bold text-black md:text-[16px] text-[12px]">
										1. <span className="underline">complete zealy quests</span>
									</p>
									<div className="p-[5px] rounded-[6px] bg-[#FF6666]">
										<p className="text-[#560000] md:text-[12px] text-[10px]">REQUIRED</p>
									</div>
								</div>
								<div className="flex gap-x-[10px] items-center">
									<p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
										2. connect wallet and play flappyblast
									</p>
									<div className="p-[5px] rounded-[6px] bg-[#FF6666]">
										<p className="text-[#560000] md:text-[12px] text-[10px]">REQUIRED</p>
									</div>
								</div>
								<p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
									3. top 100 players will get extra allocation
								</p>
								<p className="md:text-left text-center font-bold md:text-[16px] text-[12px]">
									4. good luck and $FLAP up ;)
								</p>
							</div>
							<div className="flex md:flex-row flex-col gap-x-[40px] justify-center items-center">
								<div
									onClick={() => setCurrentState("flap")}
									className="md:block hidden relative mt-[25px] cursor-pointer"
								>
									<Image width={300} height={100} alt="button" src="/images/flap_button.png" />
								</div>
								<div
									onClick={() => setCurrentState("flap")}
									className="block md:hidden relative mt-[25px] cursor-pointer"
								>
									<Image width={150} height={100} alt="button" src="/images/flap_button.png" />
								</div>
								<div
									// onClick={() => setCurrentState("leaderboard")}
									className="md:block hidden relative mt-[25px] cursor-pointer"
								>
									<Image width={300} height={100} alt="button" src="/images/leaderbord_button.png" />
								</div>
								<div
									// onClick={() => setCurrentState("leaderboard")}
									className="block md:hidden relative mt-[25px] cursor-pointer"
								>
									<Image width={150} height={100} alt="button" src="/images/leaderbord_button.png" />
								</div>
							</div>
						</div>
					)}
					{currentState === "flap" && (
						<div className="flex flex-col gap-y-[20px] w-[1000px]">
							<div className="flex justify-start">
								{!address ? (
									<div
										onClick={() => open()}
										className="border border-[#BDBDBD] py-[11px] px-[19px] rounded-[10px] flex gap-x-[10px] cursor-pointer items-center"
									>
										<p className="font-bold md:text-[16px] text-[12px]">Connect Wallet</p>
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
											{address.slice(0, 5) + "..." + address.slice(address.length - 4)}
										</p>
										{ensName && <p className="font-bold md:text-[16px] text-[12px]">{ensName}</p>}
									</div>
								)}
							</div>
							<div
								className={`rounded-[8px] bg-[#F1F1F1] w-full ${
									!address ? "h-[400px]" : "h-[400px] md:h-[600px] md:pb-[500px] p-[30px]"
								} relative flex justify-center items-center`}
							>
								{!address ? (
									<p>Connect Wallet</p>
								) : isClientMobile ? (
									<p>Please use desktop to play the game.</p>
								) : (
									<FlappyBird />
								)}
							</div>
						</div>
					)} */}
          <p>Coming soon :)</p>
        </div>
      </div>
    </HeroLayout>
  );
}
