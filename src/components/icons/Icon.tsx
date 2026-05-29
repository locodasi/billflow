// src/components/icons/Icon.tsx
'use client'

import React, { useEffect, useState, JSX } from "react";
import styled from "styled-components";
import icons from "./icons";

export type Icons = keyof typeof icons;

// ─── Types ───────────────────────────────────────────

type IconProps = {
    icon: Icons;
    size?: number;
    iconColor?: string;
    fillColor?: string;
    className?: string;
    onlySvg?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    grab?: boolean;
    style?: React.CSSProperties;
};

type ReturnIconProps = {
    icon: JSX.Element | Icons;
    size?: number;
    iconColor?: string;
    fillColor?: string;
    grab?: boolean;
};

type IconWrapperProps = {
    $iconSize: number;
    $iconColor: string;
    $fillColor: string;
};

// ─── Cache ───────────────────────────────────────────

const svgCache = new Map<string, string>();

// ─── Styled ──────────────────────────────────────────

const IconWrapper = styled.div<IconWrapperProps>`
    width: ${({ $iconSize }) => $iconSize}px;
    height: ${({ $iconSize }) => $iconSize}px;

    svg {
        width: ${({ $iconSize }) => $iconSize}px;
        height: ${({ $iconSize }) => $iconSize}px;
    }

    path {
        stroke: ${({ $iconColor }) => $iconColor};
        fill: ${({ $fillColor }) => $fillColor};
    }
`;

// ─── Icon ────────────────────────────────────────────

const Icon = ({
    icon,
    size = 16,
    iconColor = "var(--Icons-icon-700)",
    fillColor = "none",
    className,
    onlySvg = false,
    onClick,
    grab,
    style = {},
}: IconProps) => {
    const [svgContent, setSvgContent] = useState<string>("");

    useEffect(() => {
        if (!icon) return;

        if (svgCache.has(icon)) {
            setSvgContent(svgCache.get(icon)!);
            return;
        }

        const fetchIcon = async () => {
            try {
                const iconUrl = icons[icon] ?? icons["home"];
                const res = await fetch(iconUrl);
                const svg = await res.text();
                svgCache.set(icon, svg);
                setSvgContent(svg);
            } catch (error) {
                console.error("Error fetching SVG:", error);
                setSvgContent("");
            }
        };

        fetchIcon();
    }, [icon]);

    if (onlySvg) {
        return (
            <div
                className={className}
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        );
    }

    return (
        <IconWrapper
            $iconSize={size}
            $iconColor={iconColor}
            $fillColor={fillColor}
            className={className}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            onClick={(e) => onClick?.(e)}
            style={{
                cursor: onClick || grab ? "pointer" : "default",
                ...style,
            }}
        />
    );
};

// ─── ReturnIcon ──────────────────────────────────────

export const ReturnIcon = ({
    icon,
    size,
    iconColor,
    grab,
    fillColor,
}: ReturnIconProps) => {
    if (typeof icon === "string") {
        return (
            <Icon
                icon={icon as Icons}
                size={size}
                fillColor={fillColor}
                iconColor={iconColor}
                grab={grab}
            />
        );
    }

    return icon;
};

export default Icon;