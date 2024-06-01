import { AbsoluteImagesComponent } from "@/src/components/AbsoluteImagesComponent";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const HeroLayout = ({ children }: Props) => {
  return (
    <div className="min-h-[100vh] hero-section overflow-scroll">
      <AbsoluteImagesComponent />
      {children}
    </div>
  );
};
