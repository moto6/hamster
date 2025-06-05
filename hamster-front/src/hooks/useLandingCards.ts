export interface LandingCard {
    targetPath: string,
    description: string,
    title: string,
}

export const fetchLandingCards = async (): Promise<LandingCard[]> => {
    return [
        {
            targetPath: "target-path",
            description: "description",
            title: "title",
        },
    ];


    // const response = await axios.get<DashboardInfo>(`${endpoint}/api/v0/dashboard-info`);
    // return response.data;
};