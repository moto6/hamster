import React, {useState} from "react";

const SPEED_OF_LIGHT = 299792458; // m/s

const calculateWavelength = (frequencyMHz: number) => {
    const frequencyHz = frequencyMHz * 1_000_000;
    const wavelength = SPEED_OF_LIGHT / frequencyHz; // in meters
    return {
        full: wavelength,
        half: wavelength / 2,
        quarter: wavelength / 4,
        fiveEighths: wavelength * 0.625,
    };
};

const AntennaLengthPage = (): React.JSX.Element => {
    const [frequency, setFrequency] = useState<number>(144)
    const [result, setResult] = useState<ReturnType<typeof calculateWavelength> | null>(null);

    const handleCalculate = () => {
        if (frequency > 0) {
            setResult(calculateWavelength(frequency));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">📡 HAM 안테나 길이 계산기</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">주파수 (MHz)</label>
                    <input
                        type="number"
                        value={frequency}
                        onChange={(e) => setFrequency(parseFloat(e.target.value))}
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>
                <button
                    onClick={handleCalculate}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                    계산하기
                </button>

                {result && (
                    <div className="mt-6 space-y-2">
                        <p>🔸 1/4 파장: {result.quarter.toFixed(3)} m</p>
                        <p>🔸 1/2 파장: {result.half.toFixed(3)} m</p>
                        <p>🔸 5/8 파장: {result.fiveEighths.toFixed(3)} m</p>
                        <p>🔸 풀 웨이브: {result.full.toFixed(3)} m</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AntennaLengthPage;