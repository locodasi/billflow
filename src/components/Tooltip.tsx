"use client"

import Tippy from '@tippyjs/react/headless';
import { Placement } from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // o importá otro tema si querés

import React from 'react';


interface Props {
    content: React.ReactNode;
    children: React.ReactElement;
    position?: Placement;
    interactive?: boolean;
    theme?: "transparent" | "custom";
    delay?: [number, number];
    arrow?: boolean;
    offset?: [number, number];
}
const Tooltip = ({ content, children, position, interactive = false, theme = "custom", delay = [0, 0], arrow = true, offset = [0, 10] }: Props) => {
    return (
        <Tippy
            render={attrs => (
                <div className={`tippy-box`} data-theme={theme} {...attrs}>
                    <div className="tippy-content">{content}</div>
                    {arrow && <div className="tippy-arrow" />}
                </div>
            )}
            placement={position || "right"} appendTo={() => document.body} theme={theme} interactive={interactive} delay={delay} arrow={arrow} offset={offset}>
            <span>{children}</span>
        </Tippy>
    )
};

export default Tooltip;


import { useState, useCallback } from 'react';

interface ClickTooltipProps {
    content: (close: () => void) => React.ReactNode; // ← recibe fn para cerrar
    children: React.ReactElement;
    position?: Placement;
    interactive?: boolean;
    theme?: "transparent" | "custom";
    offset?: [number, number];
}

export const ClickTooltip = ({ content, children, position, interactive = true, theme = "custom", offset = [0, 10] }: ClickTooltipProps) => {
    const [visible, setVisible] = useState(false);

    const close = useCallback(() => setVisible(false), []);
    const toggle = useCallback(() => setVisible(v => !v), []);

    return (
        <Tippy
            render={attrs => (
                <div className="tippy-box" data-theme={theme} {...attrs}>
                    <div className="tippy-content">
                        {content(close)} {/* ← le pasás close al contenido */}
                    </div>
                </div>
            )}
            visible={visible}
            onClickOutside={close}
            placement={position || "bottom"}
            appendTo={() => document.body}
            interactive={interactive}
            offset={offset}
        >
            <span onClick={toggle}>{children}</span>
        </Tippy>
    );
};
