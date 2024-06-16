import GoldmilioAbi from "./Goldmilio.json";
import BlastbirbsAbi from "./Blastbirbs.json";
import BlastrAbi from "./Blastr.json";
import BlastWolvesAbi from "./BlastWolves.json";
import ERC20Abi from "./ERC20.json";

export const partnershipData = [
    {
        id: 1,
        name: "Goldmilio",
        contractAddress: "f9d68fa74f506697ef70f6e1e09a75bc2394e662",
        isNft: true,
        abi: GoldmilioAbi,
    },
    {
        id: 2,
        name: "Blast Birbs",
        contractAddress: "b1fb5e2cd53166a0344f548a908c35b25491bd2d",
        isNft: true,
        abi: BlastbirbsAbi,
    },
    {
        id: 3,
        name: "BLASTR",
        contractAddress: "6600b28199bd808edc96111f0800a415fccaddc0",
        isNft: true,
        abi: BlastrAbi,
    },
    {
        id: 4,
        name: "Blast Hoges",
        contractAddress: "548a6fe792015dd2a7827659d3feb8cf88cf1c79",
        isNft: false,
        abi: ERC20Abi,
    },
    {
        id: 5,
        name: "Blast Wolves",
        contractAddress: "9b2ced8219bcf64cccaf69ed4c56aaf90e958a0b",
        isNft: true,
        abi: BlastWolvesAbi,
    },
    {
        id: 6,
        name: "Blade",
        contractAddress: "d1fedd031b92f50a50c05e2c45af1adb4cea82f4",
        isNft: false,
        abi: ERC20Abi,
    },
];
