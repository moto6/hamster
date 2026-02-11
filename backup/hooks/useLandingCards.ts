import {routePages} from "../layout/RoutePages.ts";

export interface LandingCard {
    targetPath: string,
    description: string,
    title: string,
}

export const fetchLandingCards = async (): Promise<LandingCard[]> => {
    // return [
    //     {
    //         targetPath: "target-path",
    //         description: "description",
    //         title: "title",
    //     },
    // ];
    return routePages.map((page) => ({
        targetPath: page.path,
        title: page.label,
        description: page.description,
    }))

};
/*

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
 */
// const response = await axios.get<DashboardInfo>(`${endpoint}/api/v0/dashboard-info`);
// return response.data;