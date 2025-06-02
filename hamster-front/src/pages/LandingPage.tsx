import {useEffect, useState} from "react";
import {fetchLandingInfo, type LandingInfo} from "../hooks/useUserInfo.ts";

const LandingPage = (): React.JSX.Element => {

    const [data, setData] = useState<LandingInfo>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchLandingInfo()
            .then(setData)
            .catch(error => setError(error))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Dashboard</h3>

            {loading && <p>로딩 중...</p>}
            {error && <p className="text-danger">에러 발생: {error.message}</p>}
            {data && (

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <div className="card text-white bg-danger">
                            <div className="card-body">
                                <h5 className="card-title">11111</h5>
                                <p className="card-text display-6">{data.cancelCount}건</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card text-white bg-success">
                            <div className="card-body">
                                <h5 className="card-title">22222</h5>
                                <p className="card-text display-6">{data.installCount}건</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card text-white bg-primary">
                            <div className="card-body">
                                <h5 className="card-title">33333</h5>
                                <p className="card-text display-6">{data.onboardingCount}건</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-white">
                        API ENDPOINT: {import.meta.env.VITE_API_BASE_URL}
                    </p>
                    <p className="text-white">
                        ENV: {import.meta.env.VITE_ENV}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
