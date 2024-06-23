import GoldmilioAbi from "./Goldmilio.json";
import BlastbirbsAbi from "./Blastbirbs.json";
import BlastrAbi from "./Blastr.json";
import BlastWolvesAbi from "./BlastWolves.json";
import ERC20Abi from "./ERC20.json";
import BlastPugsAbi from "./BlastPugs.json";
import BlastariansAbi from "./Blastarians.json";
import NewBlastCityAbi from "./NewBlastCity.json";
import GenesisPugsAbi from "./GenesisPugs.json";

export type Attributes = {
  createdAt: string;
  updatedAt: string;
  is_wallet: boolean;
  is_socialaction: boolean;
  twitter_name: string;
  twitter_pic: string;
  twitter_id: string;
  twitter_username: string;
  wallet_address: string;
  high_score: number;
  referral_code: string;
  presale_points: number;
  boosted: boolean;
  boost_multiplier: number;
};

export type DataObject = {
  id: number;
  attributes: Attributes;
};

export const partnershipData = [
  {
    id: 1,
    name: "Goldmilio",
    contractAddress: "f9d68fa74f506697ef70f6e1e09a75bc2394e662",
    isNft: true,
    abi: GoldmilioAbi,
    minValue: 1,
    minValue2: 1,
  },
  {
    id: 2,
    name: "Pug Life",
    contractAddress: "D1C8DB73efb18d6f3f0c0D095092D7Dc75cC7121",
    isNft: true,
    abi: BlastPugsAbi,
    minValue: 1,
    minValue2: 1,
    contractAddress2: "10181e47B0C6B3482DEE641605CC1019c9D65206",
    abi2: GenesisPugsAbi,
    multiple: true,
  },
  {
    id: 3,
    name: "Blast Birbs",
    contractAddress: "b1fb5e2cd53166a0344f548a908c35b25491bd2d",
    isNft: true,
    abi: BlastbirbsAbi,
    minValue: 1,
    minValue2: 1,
  },
  {
    id: 4,
    name: "BLASTR",
    contractAddress: "6600b28199bd808edc96111f0800a415fccaddc0",
    isNft: true,
    abi: BlastrAbi,
    minValue: 1,
    minValue2: 1,
  },
  {
    id: 5,
    name: "Blast Hoges",
    contractAddress: "548a6fe792015dd2a7827659d3feb8cf88cf1c79",
    isNft: false,
    abi: ERC20Abi,
    minValue: 500000,
    minValue2: 500000,
  },
  {
    id: 6,
    name: "Up up meme",
    contractAddress: "2d4b554c0596c7b77eaedf3e732ce93ba968b23d",
    isNft: false,
    abi: ERC20Abi,
    minValue: 300,
    minValue2: 300,
  },
  {
    id: 7,
    name: "Captain Company",
    contractAddress: "15d24de366f69b835be19f7cf9447e770315dd80",
    isNft: false,
    abi: ERC20Abi,
    minValue: 50,
    minValue2: 50,
  },
  {
    id: 8,
    name: "Blastarians",
    contractAddress: "c6f85c3768beb29a715e1eb7b44b1b1c8d84b202",
    isNft: true,
    abi: BlastariansAbi,
    minValue: 1,
    minValue2: 1,
  },
  {
    id: 9,
    name: "Blast Wolves",
    contractAddress: "9b2ced8219bcf64cccaf69ed4c56aaf90e958a0b",
    isNft: true,
    abi: BlastWolvesAbi,
    minValue: 1,
    minValue2: 1,
  },
  {
    id: 10,
    name: "New Blast City",
    contractAddress: "06a347a6f4994fcca0c91e4261c603d8ff954242",
    isNft: true,
    abi: NewBlastCityAbi,
    minValue: 1,
    minValue2: 1,
  },
  {
    id: 11,
    name: "Bladeswap",
    contractAddress: "d1fedd031b92f50a50c05e2c45af1adb4cea82f4",
    isNft: false,
    abi: ERC20Abi,
    minValue: 100,
    minValue2: 100,
    contractAddress2: "F8f2ab7C84CDB6CCaF1F699eB54Ba30C36B95d85",
    abi2: ERC20Abi,
    multiple: true,
  },
  {
    id: 12,
    name: "Andy",
    contractAddress: "d43D8aDAC6A4C7d9Aeece7c3151FcA8f23752cf8",
    isNft: false,
    abi: ERC20Abi,
    minValue: 10,
    minValue2: 10,
  },
];

export const filterAndSortByHighScore = (data: DataObject[]): DataObject[] => {
  // Filter data to include only those with a high_score greater than 0
  const filteredData = data?.filter((item) => item.attributes.high_score > 0);

  // Sort the filtered data by high_score in descending order
  const sortedData = filteredData?.sort(
    (a, b) => b.attributes.high_score - a.attributes.high_score
  );

  return sortedData;
};

export function stringToBytes32(str: string) {
  if (!str) {
    return "0x7878787878787878787878780000000000000000000000000000000000000000";
  }
  // Convert the string to a byte array
  let utf8 = new TextEncoder().encode(str);

  // Ensure the byte array is exactly 32 bytes long
  if (utf8.length > 32) {
    throw new Error("String is too long to convert to bytes32");
  }

  // Create a 32-byte array filled with zeros
  let bytes32 = new Uint8Array(32);

  // Copy the utf8 byte array into the 32-byte array
  bytes32.set(utf8);

  // Convert the byte array to a hexadecimal string
  return (
    "0x" +
    Array.from(bytes32)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
  );
}
