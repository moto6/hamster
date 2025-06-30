import React from "react";
import LandingPage from "../pages/LandingPage.tsx";
import AntennaLengthPage from "../pages/AntennaLengthPage.tsx";
import LicenseInfoPage from "../pages/LicenseInfoPage.tsx";
import FrequencyBandPage from "../pages/FrequencyBandPage.tsx";
import CallSignLookupPage from "../pages/CallSignLookupPage.tsx";
import SdrViewerPage from "../pages/SdrViewerPage.tsx";

interface RoutePage {
    path: string;
    element: React.ComponentType
    label: string;
    description: string;
}

export const routePages: RoutePage[] = [
    {
        path: "/",
        element: LandingPage,
        label: "landing",
        description: "LandingPage",
    },
    {
        path: "/antenna-length",
        element: AntennaLengthPage,
        label: "antenna",
        description: "calculate antenna length",
        //description: "📡 calculate antenna length",
    },
    {
        path: "license",
        element: LicenseInfoPage,
        label: "License",
        description: "대한민국 HAM 자격증 정보",
    },
    {
        path: "frequency",
        element: FrequencyBandPage,
        label: "Frequency Band",
        description: "Frequency Band Info Chart",
    },
    {
        path: "call-sign",
        element: CallSignLookupPage,
        label: "call sign",
        description: "Call Sign Lookup",
    },
    {
        path: "sdr-viewer",
        element: SdrViewerPage,
        label: "SDR Viewer",
        description: "SDR Viewer",
    },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    //     description: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    //     description: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    //     description: "",
    // },
];