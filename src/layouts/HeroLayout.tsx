import { AbsoluteImagesComponent } from "@/src/components/AbsoluteImagesComponent";
import React, { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export const HeroLayout = ({ children }: Props) => {
    return (
        <div className="h-[120vh] md:h-[100vh] hero-section overflow-hidden w-[100vw] relative">
            <AbsoluteImagesComponent />
            {children}
        </div>
    );
};
