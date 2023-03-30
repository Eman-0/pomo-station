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
            <div style={{color :"white"}}>
            <p>{currTime?.toLocaleTimeString()}</p>
            </div>
        </>
    )
};

export default Clock;