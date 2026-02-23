"use client";

import { PrimaryOfferCardProps } from "./types";
import { ElevatedPrimaryOffer } from "./templates/ElevatedPrimaryOffer";
import { SplitPrimaryOffer } from "./templates/SplitPrimaryOffer";
import { MinimalPrimaryOffer } from "./templates/MinimalPrimaryOffer";
import { BannerPrimaryOffer } from "./templates/BannerPrimaryOffer";

export function PrimaryOfferRenderer(props: PrimaryOfferCardProps) {
    switch (props.template) {
        case "split":
            return <SplitPrimaryOffer {...props} />;
        case "minimal":
            return <MinimalPrimaryOffer {...props} />;
        case "banner":
            return <BannerPrimaryOffer {...props} />;
        case "elevated":
        default:
            return <ElevatedPrimaryOffer {...props} />;
    }
}
