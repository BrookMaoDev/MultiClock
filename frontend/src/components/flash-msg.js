import React, { useEffect, useState } from "react";

export default function Msg({ message, success }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    if (success) {
        return visible ? (
            <div
                class={`absolute w-full top-0 h-12 flex items-center justify-center font-semibold text-white bg-green-500`}
            >
                {message}
            </div>
        ) : null;
    } else {
        return visible ? (
            <div
                class={`absolute w-full top-0 h-12 flex items-center justify-center font-semibold text-white bg-red-500`}
            >
                {message}
            </div>
        ) : null;
    }
}
