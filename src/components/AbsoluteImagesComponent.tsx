import Image from "next/image";
import { BlastSVG } from "./BlastSvg";

export const AbsoluteImagesComponent = () => {
  return (
    <div>
      <Image
        style={{ position: "absolute", top: "13%", left: "5%" }}
        src="/cloud.png"
        width={150}
        height={150}
        alt="cloud"
      />
      <Image
        style={{ position: "absolute", top: "15%", right: "8%" }}
        src="/cloud.png"
        width={150}
        height={150}
        alt="cloud"
      />
      <Image
        style={{ position: "absolute", top: "1%", left: "45%" }}
        src="/cloud.png"
        width={150}
        height={150}
        alt="cloud"
      />
      <div style={{ zIndex: 100 }} className="w-full absolute bottom-0 z-100">
        <Image
          style={{ zIndex: 100 }}
          className="z-100"
          src="/ground.png"
          width={2232}
          height={100}
          alt="ground"
        />
      </div>
      <Image
        className="absolute top-0"
        src="/top-bottom.png"
        width={110}
        height={110}
        alt="greenbin"
      />
      <Image
        className="absolute top-1/2 z-50"
        src="/top-top.png"
        width={110}
        height={110}
        alt="greenbin"
      />
      <Image
        className="absolute top-0 right-0"
        src="/top-bottom-side.png"
        width={110}
        height={110}
        alt="greenbin"
      />
      <Image
        className="absolute top-1/2 z-50 right-0"
        src="/top-top-side.png"
        width={110}
        height={110}
        alt="greenbin"
      />
      <BlastSVG
        onClick={() => {}}
        className="absolute top-[5%] z-50 right-[2%] cursor-pointer"
      />
    </div>
  );
};
