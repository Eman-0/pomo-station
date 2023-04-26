import { useEffect, useState } from "react";

const Clock = () => {
    const [isClockInitiated, setIsClockInitiated] = useState(false);
    const [currTime, setCurrTime] = useState<Date>(new Date());

    useEffect(() => {
        setIsClockInitiated(true)
        setInterval(() => {
            setCurrTime(new Date())
        },1 * 1000);
    }, [])

    if (!isClockInitiated) {
        return null;
    }

    return (
        <>
            <div className="h-32 lg:w-3/4 lg:max-w-lg bg-[#eadfb5] text-5xl">
                <div className="">
                <p>{currTime?.toLocaleTimeString()}</p>
                </div>
            
            </div>
        </>
    )
};

export default Clock;