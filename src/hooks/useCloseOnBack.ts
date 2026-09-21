import { useEffect, useRef } from "react";
import { useDevice } from "./useDevice";

export function useCloseOnBack(onClose: () => void) {
    const device = useDevice();
    const onCloseRef = useRef(onClose);

    useEffect(function syncOnClose() {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(function bindBackButton() {
        if (device !== "mobile") return;

        const modalId = Math.random().toString(36).slice(2);
        let pushed = false;

        function handlePopState() {
            // Si el estado actual es el de este modal, el back lo hizo otro modal apilado encima
            if (window.history.state?.modalId === modalId) return;

            pushed = false; // el back ya consumió nuestra entrada
            onCloseRef.current();
        }

        // setTimeout para que StrictMode (mount → unmount → mount) no duplique entradas
        const timer = setTimeout(function pushEntry() {
            window.history.pushState({ ...window.history.state, modalId }, "");
            pushed = true;
            window.addEventListener("popstate", handlePopState);
        }, 0);

        return function cleanup() {
            clearTimeout(timer);
            window.removeEventListener("popstate", handlePopState);

            if (pushed && window.history.state?.modalId === modalId) {
                window.history.back();
            }
        };
    }, [device]);
}