import React from "react";
import LandingPage from "../pages/LandingPage.tsx";
import AntennaLengthPage from "../pages/AntennaLengthPage.tsx";

interface RoutePage {
    path: string;
    element: React.ComponentType
    label: string;
}

export const routePages: RoutePage[] = [
    {
        path: "/",
        element: LandingPage,
        label: "landing",
    },
    {
        path: "/antenna",
        element: AntennaLengthPage,
        label: "antenna",
    },
    // {
    //     path: "",
    //     element:,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element:,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    // },
    // {
    //     path: "",
    //     element: ,
    //     label: "",
    // },
];