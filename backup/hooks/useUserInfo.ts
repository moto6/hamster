export interface LandingInfo {
    cancelCount: number;
    installCount: number;
    onboardingCount: number;
}

export const fetchLandingInfo = async (): Promise<LandingInfo> => {
    return {
        cancelCount: 0,
        installCount: 0,
        onboardingCount: 0,
    }
    // const response = await axios.get<DashboardInfo>(`${endpoint}/api/v0/dashboard-info`);
    // return response.data;
};

