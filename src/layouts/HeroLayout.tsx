import { AbsoluteImagesComponent } from "@/src/components/AbsoluteImagesComponent";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const HeroLayout = ({ children }: Props) => {
  return (
    <div className="h-[100vh] hero-section">
      <AbsoluteImagesComponent />
      {children}
    </div>
  );
};
