import { HeroLayout } from "@/src/layouts/HeroLayout";
import { useState, useEffect } from "react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button, Divider, Radio, RadioChangeEvent } from "antd";
import { PresaleTitle } from "@/src/components/PresaleTitle";
import Image from "next/image";

export default function PresalePage() {
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
    const [refferalRadioValue, setRefferalRadioValue] = useState("flappyblast");
    const onRefferalChange = (e: RadioChangeEvent) => {
        setRefferalRadioValue(e.target.value);
    };
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    if (!domLoaded) return <div></div>;
    return (
        <HeroLayout>
            <div className="pt-[20vh] md:pt-0 flex w-full h-[100vh] justify-center items-start md:items-center">
                <div
                    className="flex flex-col items-center gap-8"
                    style={{ zIndex: 110, position: "relative" }}
                >
                    <PresaleTitle />
                    <div className="flex gap-4 justify-center items-stretch">
                        <Image
                            width={250}
                            height={35}
                            alt="blade"
                            src="/images/blade.png"
                        />
                        <div className="h-[37px] flex justify-center items-center border-2 border-[#FCFC03] text-[#FCFC03] px-4">
                            Buy on Bladeswap
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col md:flex-row">
                        <div className="px-6 py-2 bg-white border-4 border-black font-bold">
                            Presale ends in: 00:00:00
                        </div>
                        <div className="px-6 py-2 bg-white border-4 border-black font-bold">
                            Total Raised: 100 ETH / 200 ETH
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col md:flex-row">
                        <div className="bg-[#ddd894] p-4">
                            <div className="flex justify-between mb-4">
                                <div className="text-xl font-bold">Sale</div>
                                <div>
                                    <Button
                                        style={{
                                            border: "2px solid",
                                            backgroundColor: "#FFFF95",
                                        }}
                                        className="w-fit font-bold"
                                        onClick={() => {}}
                                    >
                                        Connect your wallet
                                    </Button>
                                </div>
                            </div>
                            {/* Presale ongoing */}
                            <div className="my-2">
                                <p className="text-sm">Amount</p>
                                <div className="flex justify-between gap-4 flex-col md:flex-row">
                                    <div>
                                        <div className="bg-white border-4 border-black flex justify-between py-1 pl-4 pr-1 items-center">
                                            <input
                                                aria-label="flap-amount"
                                                placeholder="0.00"
                                                type="text"
                                            ></input>
                                            <div>
                                                <Button
                                                    style={{
                                                        border: "0px solid",
                                                    }}
                                                    className="w-fit font-bold"
                                                    onClick={() => {}}
                                                >
                                                    MAX
                                                </Button>
                                            </div>
                                        </div>
                                        {/* <p className="text-red-500 text-sm mb-2 mt-1">
													*transaction failed. please try again
												</p> */}
                                        <p className="text-sm">
                                            Balance: 0.00 ETH
                                        </p>
                                    </div>
                                    {/* button enabled */}
                                    <div>
                                        <Image
                                            width={150}
                                            height={0}
                                            style={{ height: "auto" }}
                                            alt="buy-flap"
                                            src="/images/BuyFlap_Btn.png"
                                        />
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
                            <Divider />
                            <div className="flex justify-between mt-4">
                                <div className="text-xl font-bold">
                                    Refferal
                                </div>
                                <div>
                                    <Button
                                        style={{
                                            border: "2px solid",
                                            backgroundColor: "#FFFF95",
                                        }}
                                        className="w-fit font-bold"
                                        onClick={() => {}}
                                    >
                                        Login to X
                                    </Button>
                                </div>
                            </div>
                            <div className="my-2">
                                <div className="text-sm mb-2">
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
                                <div className="bg-white border-4 border-black flex justify-between py-1 pl-4 pr-1 items-center">
                                    <input
                                        aria-label="flap-amount"
                                        placeholder="0.00"
                                        type="text"
                                    ></input>
                                    <div>
                                        <Button
                                            type="primary"
                                            style={{
                                                border: "0px solid",
                                            }}
                                            className="w-fit font-bold"
                                            onClick={() => {}}
                                        >
                                            copy link
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#ddd894] p-4">
                            <div className="text-xl font-bold mb-4">
                                Sale Info
                            </div>
                            <div className="px-6 py-2 mb-2 bg-[#FEF9C0]">
                                <p>Total Participation</p>
                                <p className="text-md font-bold">0.000 ETH</p>
                            </div>
                            <div className="my-2">
                                <p className="text-sm">Start Sale</p>
                                <p className="font-semibold">
                                    June 21 2024,00:00 UTC
                                </p>
                            </div>
                            <div className="my-2">
                                <p className="text-sm">End of Sale</p>
                                <p className="font-semibold">
                                    June 23 2024,00:00 UTC
                                </p>
                            </div>
                            <div className="flex gap-6 my-2">
                                <div>
                                    <p className="text-sm whitespace-nowrap">
                                        Sale Type
                                    </p>
                                    <p className="font-semibold whitespace-nowrap">
                                        Fairlaunch
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm whitespace-nowrap">
                                        Method
                                    </p>
                                    <p className="font-semibold whitespace-nowrap">
                                        Overflow
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm whitespace-nowrap">
                                        Claim Token
                                    </p>
                                    <p className="font-semibold whitespace-nowrap">
                                        via Bladeswap
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm">Hard Cap</p>
                                <p className="font-semibold">200 ETH</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HeroLayout>
    );
}
