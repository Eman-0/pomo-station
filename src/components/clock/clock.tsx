import { useEffect, useState } from "react";

const Clock = () => {
    const [currTime, setCurrTime] = useState<Date>(new Date());

    useEffect(() => {
        setInterval(() => {
            setCurrTime(new Date())
        },1 * 1000);
    }, [])

    return (
        <>
            <div style={{color :"white"}}>
            <p>{currTime?.toLocaleTimeString()}</p>
            </div>
        </>
    )
};

export default Clock;