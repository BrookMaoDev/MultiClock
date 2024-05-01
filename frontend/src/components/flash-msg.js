import React, { useEffect, useState } from "react";

export default function Msg({ message, success }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const gradient = success
        ? "bg-gradient-to-r from-lime-400 to-lime-500"
        : "bg-gradient-to-r from-red-500 to-orange-500";

    if (!visible) {
        return null;
    }

    return (
        <div
            className={`absolute w-full top-0 h-12 flex items-center justify-center text-white font-bold ${gradient}`}
        >
            {message}
        </div>
    );
}
