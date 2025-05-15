import React from "react";

interface RoutePage {
    path: string;
    element: React.ComponentType
    label: string;
}

export const routePages: RoutePage[] = [];