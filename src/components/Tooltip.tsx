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