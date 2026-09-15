import { useEffect, useState } from "react";

export type DeviceType = "mobile" | "desktop";

const BREAKPOINTS = {
    mobile: "(max-width: 768px)",
};

const getDevice = (): DeviceType => {
    if (typeof window === "undefined") {
        return "desktop";
    }

    if (window.matchMedia(BREAKPOINTS.mobile).matches) {
        return "mobile";
    }

    return "desktop";
};

export const useDevice = (): DeviceType => {
    const [device, setDevice] = useState<DeviceType>(getDevice);

    useEffect(() => {
        const mediaQueries = Object.values(BREAKPOINTS).map((query) =>
            window.matchMedia(query)
        );

        const handleChange = () => {
            setDevice(getDevice());
        };

        mediaQueries.forEach((mediaQuery) => {
            mediaQuery.addEventListener("change", handleChange);
        });

        return () => {
            mediaQueries.forEach((mediaQuery) => {
                mediaQuery.removeEventListener("change", handleChange);
            });
        };
    }, []);

    return device;
};
