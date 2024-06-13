import { HeroLayout } from "@/src/layouts/HeroLayout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import FlappyBird from "@/src/components/FlappyBird";
import TwitterIntentHandler from "@/src/components/TwitterIntentHandler";
import useSWR from "swr";
import Cookie from "js-cookie";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Modal, Avatar, Icon, Popover } from "antd";
import { ExportOutlined, CaretRightOutlined, CheckOutlined, LeftOutlined } from "@ant-design/icons";
import { axiosApi, fetcherStrapi } from "@/utils/axios";

export default function AirdropPage() {
	const { data: session, status } = useSession();
	console.log(session);
	const [userData, setUserData] = useState(null);
	const { address, chain } = useAccount();
	const [isClientMobile, setIsClientMobile] = useState(false);
	const [currentState, setCurrentState] = useState<"index" | "flap" | "leaderboard">("index");
	const { disconnect } = useDisconnect();
	const { data: ensName } = useEnsName({ address });
	const [domLoaded, setDomLoaded] = useState(false);
	const ensAvatar = useEnsAvatar({ name: ensName ?? "" });
	const { open } = useWeb3Modal();
	const { open: web3ModalOpen, selectedNetworkId } = useWeb3ModalState();
	const [data, setData] = useState(null);
	const { data: walletData, mutate: walletMutate } = useSWR(
		`/api/wallet-accounts?filters[wallet_address][$eq]=${address}`,
		fetcherStrapi
	);

	useEffect(() => {
		setDomLoaded(true);
		if (typeof window !== "undefined") {
			const userAgent = navigator.userAgent.toLowerCase();
			const isMobileDevice = /mobile|android|iphone|ipad|tablet/.test(userAgent);
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
			return { ...socialActionButtonStyles.base, ...socialActionButtonStyles.verifying };
		} else if (verificationStatus[action] === "verified") {
			return { ...socialActionButtonStyles.base, ...socialActionButtonStyles.verified };
		}
		return socialActionButtonStyles.base;
	};

	// 0 connect wallet, 1 twitter social action, 2 congrats, 3 finished, 10 hide
	const [modalStep, setModalStep] = useState(10);
	const [walletPopup, setIsWalletPopup] = useState(false);
	const [checkingWallet, setCheckingWallet] = useState(false);
	const [isBlast, setIsBlast] = useState(true);
	const [checkingSocialAction, setCheckingSocialAction] = useState(false);

	const [verificationStatus, setVerificationStatus] = useState({
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

	useEffect(() => {
		if (walletPopup === true && web3ModalOpen === false) {
			// Change this to blast
			if (chain?.name === "Ethereum") {
				setIsWalletPopup(false);
			} else {
				setIsBlast(false);
				setIsWalletPopup(false);
			}
		}
	}, [web3ModalOpen]);

	useEffect(() => {
		if (!isBlast) {
			setModalStep(0);
		}
	}, [isBlast]);

	useEffect(() => {
		if (!walletPopup) {
			// Get Twitter data
			axiosApi.get(`/api/twitter-accounts?filters[twitter_id][$eq]=${session?.user.id}`).then((response) => {
				if (response.data.data.length != 0 && userData === null) {
					const accountData = response.data.data[0];
					const { id, attributes } = accountData;
					// Merge id into attributes
					const userDataWithId = { ...attributes, id };
					setUserData(userDataWithId);
				}
			});

			if (userData) {
				// Get Wallet data
				axiosApi
					.get(`/api/wallet-accounts?filters[twitter_account][twitter_id][$eq]=${session?.user.id}`)
					.then((response) => {
						if (response.data.data.length != 0) {
							const wallet_address = response.data.data[0].attributes.wallet_address;
							Cookie.set(wallet_address, address as string, {
								expires: 1,
							});
							if (userData!["is_wallet"] != true) {
								axiosApi
									.put(`/api/twitter-accounts/${userData["id"]}`, {
										data: {
											is_wallet: true,
										},
									})
									.then((response) => {
										if (response.status == 200) {
											const updatedUserData = { ...userData, is_wallet: true };
											setUserData(updatedUserData);
										}
									})
									.catch((err) => {
										console.log(err);
									});
							}
						}
					});

				if (userData["is_wallet"] != true) {
					setModalStep(0);
				} else if (userData["is_socialaction"] != true && !checkingSocialAction) {
					setModalStep(1);
				} else if (userData["is_wallet"] === true && userData["is_socialaction"] === true && modalStep != 2) {
					setModalStep(3);
				}
			}
		}
	}, [session?.user.id, userData, modalStep, walletPopup]);

	useEffect(() => {
		if (
			verificationStatus.follow === "verified" &&
			verificationStatus.retweet === "verified" &&
			verificationStatus.like === "verified" &&
			verificationStatus.tweet === "verified"
		) {
			setCheckingSocialAction(true);
			setModalStep(2);
			if (userData!["is_socialaction"] != true) {
				axiosApi
					.put(`/api/twitter-accounts/${userData!["id"]}`, {
						data: {
							is_socialaction: true,
						},
					})
					.then((response) => {
						if (response.status == 200) {
							setCheckingSocialAction(false);
							const updatedUserData = { ...userData, is_socialaction: true };
							setUserData(updatedUserData);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}
	}, [verificationStatus]);

	useEffect(() => {
		// Change this to blast
		if (address && chain?.name === "Ethereum" && userData) {
			axiosApi.get(`/api/wallet-accounts?filters[wallet_address][$eq]=${address}`).then((response) => {
				if (response?.data?.data.length === 0) {
					axiosApi
						.post("/api/wallet-accounts", {
							data: {
								wallet_address: address,
								twitter_account: userData!["id"],
							},
						})
						.then((response) => {
							walletMutate();
							setCheckingWallet(false);
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
				<div className="bg-white px-6 justify-center items-center md:px-12 py-6 md:py-12 rounded-[22px] mt-[30px] w-full flex flex-col gap-y-[15px] w-[1000px]">
					{currentState === "index" && (
						<div>
							<div className="flex flex-col items-center md:items-start gap-y-[20px]">
								<div className="flex gap-x-[10px] items-center">
									<p className="font-bold text-black md:text-[16px] text-[12px]">
										1. <span className="underline">complete zealy quests</span>
									</p>
									<div className="p-[5px] rounded-[6px] bg-[#FF6666]">
										<p className="text-[#560000] md:text-[12px] text-[10px]">REQUIRED</p>
									</div>
								</div>
								<div className="flex gap-x-[10px] items-center">
									<p className="font-bold md:text-left text-center md:text-[16px] text-[12px]">
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
									onClick={() => setCurrentState("leaderboard")}
									className="md:block hidden relative mt-[25px] cursor-pointer"
								>
									<Image width={300} height={100} alt="button" src="/images/leaderbord_button.png" />
								</div>
								<div
									onClick={() => setCurrentState("leaderboard")}
									className="block md:hidden relative mt-[25px] cursor-pointer"
								>
									<Image width={150} height={100} alt="button" src="/images/leaderbord_button.png" />
								</div>
							</div>
						</div>
					)}
					{currentState === "flap" && (
						<div className="flex flex-col gap-y-[20px] w-full">
							<div className="flex justify-start">
								{!session && (
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
											<img alt="X" className="w-4 h-4" src="/assets/x-logo-black.png" />
											<p>Login to X</p>
										</Button>
									</>
								)}
								{session && (
									<>
										<div className="flex flex-wrap gap-4 justify-between w-full">
											<Popover
												content={
													<a className="text-red-500 font-bold" onClick={() => signOut()}>
														Logout
													</a>
												}
												placement="bottomLeft"
												trigger="click"
											>
												<Button
													type="primary"
													style={{
														border: "2px solid #000",
														borderRadius: "0px",
														backgroundColor: "#fff",
														color: "#000",
														fontWeight: "bold",
													}}
												>
													<img alt="X" className="w-4 h-4" src="/assets/x-logo-black.png" />
													<p>@{session.username}</p>
												</Button>
											</Popover>
											<Button
												type="primary"
												onClick={() => setCurrentState("leaderboard")}
												style={{
													border: "1px solid #BDBDBD",
													borderRadius: "6px",
													backgroundColor: "#fff",
													color: "#000",
												}}
											>
												Leaderboards
											</Button>
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
														<p>To become eligible, please complete the one-time tasks.</p>
														<p>
															After that, you can play FlappyBlast and easily qualify for
															the airdrop!
														</p>
													</div>
													<div>
														<p>Step 1/2 - Connect Wallet</p>
													</div>
												</div>
												<div className="flex flex-col justify-center items-center w-full gap-2">
													<div className="w-fit">
														<Button
															type="primary"
															onClick={() => handleConnectWallet()}
															style={{
																border: "2px solid #000",
																borderRadius: "0px",
																backgroundColor: "#fff",
																color: "#000",
															}}
															icon={<ExportOutlined style={{ color: "#000" }} />}
															iconPosition={"end"}
															className="font-bold"
														>
															Connect Wallet
														</Button>
													</div>
													{!isBlast && (
														<p className="text-red-500">
															*Please switch your network to Blast and try again.
														</p>
													)}
												</div>
												<div className="text-center bg-[#F0F0F0] p-4 font-bold mx-6 mt-4">
													NOTICE: This action can only be done once, you will not able to
													change your wallet address connected with you X account with us
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
														<p>To become eligible, please complete the one-time tasks.</p>
														<p>
															After that, you can play FlappyBlast and easily qualify for
															the airdrop!
														</p>
													</div>
													<div>
														<p>Step 2/2 - Social Campaign</p>
													</div>
												</div>
												<div className="flex justify-between">
													<a
														href="https://twitter.com/intent/follow?screen_name=flappyblast"
														onClick={() => handleOpenLink("follow")}
													>
														<p className="">
															1.{" "}
															<span className="underline">Follow @Flappyblast on X</span>
														</p>
													</a>
													{verificationStatus.follow === "unopened" ? (
														<a href="https://twitter.com/intent/follow?screen_name=flappyblast">
															<Button
																type="primary"
																onClick={() => handleOpenLink("follow")}
																icon={<ExportOutlined style={{ color: "#000" }} />}
																iconPosition={"end"}
																style={{
																	border: "2px solid #000",
																	borderRadius: "0px",
																	backgroundColor: "#fff",
																	color: "#000",
																}}
															>
																Follow
															</Button>
														</a>
													) : (
														<Button
															type="primary"
															onClick={() => handleVerification("follow")}
															style={getSocialActionButtonStyles("follow")}
															icon={
																verificationStatus.follow === "unverified" ? (
																	<CaretRightOutlined style={{ color: "#000" }} />
																) : (
																	false
																)
															}
															iconPosition={"end"}
														>
															{verificationStatus.follow === "verifying"
																? "Verifying..."
																: verificationStatus.follow === "verified"
																? "Done"
																: "Verify"}
														</Button>
													)}
												</div>
												<div className="flex justify-between">
													<a
														href="https://twitter.com/intent/retweet?tweet_id=463440424141459456"
														onClick={() => handleOpenLink("retweet")}
													>
														<p className="">
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
																style={{
																	border: "2px solid #000",
																	borderRadius: "0px",
																	backgroundColor: "#fff",
																	color: "#000",
																}}
																icon={<ExportOutlined style={{ color: "#000" }} />}
																iconPosition={"end"}
															>
																Retweet
															</Button>
														</a>
													) : (
														<Button
															type="primary"
															onClick={() => handleVerification("retweet")}
															style={getSocialActionButtonStyles("retweet")}
															icon={
																verificationStatus.retweet === "unverified" ? (
																	<CaretRightOutlined style={{ color: "#000" }} />
																) : (
																	false
																)
															}
															iconPosition={"end"}
														>
															{verificationStatus.retweet === "verifying"
																? "Verifying..."
																: verificationStatus.retweet === "verified"
																? "Done"
																: "Verify"}
														</Button>
													)}
												</div>
												<div className="flex justify-between">
													<a
														href="https://twitter.com/intent/like?tweet_id=463440424141459456"
														onClick={() => handleOpenLink("like")}
													>
														<p className="">
															3.{" "}
															<span className="underline">
																Like @Flappyblast's post on X
															</span>
														</p>
													</a>
													{verificationStatus.like === "unopened" ? (
														<a href="https://twitter.com/intent/like?tweet_id=463440424141459456">
															<Button
																type="primary"
																onClick={() => handleOpenLink("like")}
																style={{
																	border: "2px solid #000",
																	borderRadius: "0px",
																	backgroundColor: "#fff",
																	color: "#000",
																}}
																icon={<ExportOutlined style={{ color: "#000" }} />}
																iconPosition={"end"}
															>
																Like
															</Button>
														</a>
													) : (
														<Button
															type="primary"
															onClick={() => handleVerification("like")}
															style={getSocialActionButtonStyles("like")}
															icon={
																verificationStatus.like === "unverified" ? (
																	<CaretRightOutlined style={{ color: "#000" }} />
																) : (
																	false
																)
															}
															iconPosition={"end"}
														>
															{verificationStatus.like === "verifying"
																? "Verifying..."
																: verificationStatus.like === "verified"
																? "Done"
																: "Verify"}
														</Button>
													)}
												</div>
												<div className="flex justify-between">
													<a
														href="https://twitter.com/intent/tweet?text=Hello%20world&hashtags=yrdy"
														onClick={() => handleOpenLink("tweet")}
													>
														<p className="">
															4.{" "}
															<span className="underline">
																Tweet about @Flappyblast on X
															</span>
														</p>
													</a>
													{verificationStatus.tweet === "unopened" ? (
														<a href="https://twitter.com/intent/tweet?text=Hello%20world&hashtags=yrdy">
															<Button
																type="primary"
																onClick={() => handleOpenLink("tweet")}
																style={{
																	border: "2px solid #000",
																	borderRadius: "0px",
																	backgroundColor: "#fff",
																	color: "#000",
																}}
																icon={<ExportOutlined style={{ color: "#000" }} />}
																iconPosition={"end"}
															>
																Tweet
															</Button>
														</a>
													) : (
														<Button
															type="primary"
															onClick={() => handleVerification("tweet")}
															style={getSocialActionButtonStyles("tweet")}
															icon={
																verificationStatus.tweet === "unverified" ? (
																	<CaretRightOutlined style={{ color: "#000" }} />
																) : (
																	false
																)
															}
															iconPosition={"end"}
														>
															{verificationStatus.tweet === "verifying"
																? "Verifying..."
																: verificationStatus.tweet === "verified"
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
													Your X account is eligible for airdrop 🎉
												</div>
											}
											open={modalStep == 2}
											onCancel={() => setModalStep(3)}
											footer={null}
											closable={false}
										>
											<div className="text-center my-6">
												<p>
													Congrats! Just play Flappyblast and share your scores with us! Join
													our fun Discord community to share and compare. &nbsp;
													<span className="underline font-bold">Join here!</span>
												</p>

												<div className="flex justify-center w-full">
													<div
														onClick={() => setModalStep(3)}
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
														onClick={() => setModalStep(3)}
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
									modalStep < 3 || modalStep == 10 || !session ? "bg-[#F1F1F1]" : ""
								}`}
							>
								<div
									className={`flex flex-col justify-center${
										modalStep < 3 || modalStep == 10 || !session ? "mx-6 my-12" : ""
									}`}
								>
									{modalStep === 0 || !session ? (
										<p className="text-center">Login to Twitter to play FlappyBlast</p>
									) : (modalStep > 0 && modalStep < 3) || modalStep == 10 ? (
										<p className="text-center">Complete tasks to play FlappyBlast</p>
									) : (
										<FlappyBird />
									)}
								</div>
							</div>
						</div>
					)}
					{currentState === "leaderboard" && (
						<>
							<div className="flex flex-col gap-4 md:gap-0 md:flex-row items-center justify-between w-full">
								<div className="pixel-caps text-md md:text-2xl">LEADERBOARDS</div>
								<Button
									type="primary"
									onClick={() => setCurrentState("flap")}
									style={{
										border: "2px solid #000",
										borderRadius: "0px",
										backgroundColor: "#fff",
										color: "#000",
									}}
									icon={<LeftOutlined style={{ color: "#000" }} />}
									iconPosition={"start"}
								>
									Return to the game
								</Button>
							</div>

							<div className="overflow-y-auto max-h-96 w-full mt-6">
								<table className="w-full">
									<thead className="pixel-caps bg-white sticky top-0 z-20">
										<tr className="table-header">
											<th className="py-2 md:px-4 text-xs md:text-base">RANK</th>
											<th className="py-2 md:px-4 text-xs md:text-base hidden md:table-cell">
												PP
											</th>
											<th className="py-2 md:px-4 text-xs md:text-base">USERNAME</th>
											<th className="py-2 md:px-4 text-xs md:text-base">POINTS</th>
										</tr>
									</thead>
									<tbody className="overflow-x-auto">
										{Array.from({ length: 50 }, (_, index) => (
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
															src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
															alt="avatar"
														/>
													</div>
												</td>
												<td className="py-4 px-2 whitespace-nowrap text-sm md:text-base">
													@{session?.username}
												</td>
												<td className="py-4 px-2 whitespace-nowrap text-sm md:text-base">
													Data 4
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</>
					)}
				</div>
			</div>
		</HeroLayout>
	);
}
