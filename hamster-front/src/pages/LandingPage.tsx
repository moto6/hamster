import React, {useEffect, useState} from "react";
import {fetchLandingInfo, type LandingInfo} from "../hooks/useUserInfo.ts";
import {Link} from "react-router-dom";
import {fetchLandingCards, type LandingCard} from "../hooks/useLandingCards.ts";

const LandingPage = (): React.JSX.Element => {

    const [data, setData] = useState<LandingInfo>();
    const [cards, setCardData] = useState<LandingCard[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchLandingCards()
            .then(setCardData)
    }, []);
    useEffect(() => {
        fetchLandingInfo()
            .then(setData)
            .catch(error => setError(error))
            .finally(() => setLoading(false))
    }, [])

    // const targetPath: string = "target-path"
    // const description: string = "description"
    // const title : string = "title"
    return (
        <div className="container mt-4">
            <h3 className="mb-4">Dashboard</h3>
            {loading && <p>로딩 중...</p>}
            {error && <p className="text-danger">에러 발생: {error.message}</p>}
            {data && (

                <div className="row">

                    {cards.map((card) => (
                        <div className="col-md-3 mb-3">
                            <Link to={card.targetPath} className="text-decoration-none">
                                <div className="card text-white bg-dark">
                                    <div className="card-body">
                                        <p className="card-text">{card.description}</p>
                                        <h5 className="card-title display-6">{card.title}</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}

                    {/*<p className="text-white">*/}
                    {/*    API ENDPOINT: {import.meta.env.VITE_API_BASE_URL}*/}
                    {/*</p>*/}
                    {/*<p className="text-white">*/}
                    {/*    ENV: {import.meta.env.VITE_ENV}*/}
                    {/*</p>*/}

                    {/*<p className="text-white">*/}
                    {/*    API ENDPOINT: {import.meta.env.VITE_API_BASE_URL}*/}
                    {/*</p>*/}
                    {/*<p className="text-white">*/}
                    {/*    ENV: {import.meta.env.VITE_ENV}*/}
                    {/*</p>*/}

                </div>
            )}
        </div>
    );
};

export default LandingPage;
