import styled from "styled-components";

interface SwitchComponentsProps {
    isOn: boolean
}

interface CircleProps extends SwitchComponentsProps {
    isOn: boolean;
    size: "small" | "medium"
}

const Circle = styled.div<CircleProps>`
    width: ${(props) => SIZE[props.size].circle};
    height: ${(props) => SIZE[props.size].circle};
    border-radius: 50%;
    background-color: var(--Base-0-White, #FFF);
`;

interface SwitchProps {
    isOn: boolean,
    handleToggle: () => void
    type?: "default" | "primary" | "red-green"
    size?: "small" | "medium"
    right?:boolean
    disabled?: boolean
    children?: React.ReactNode
    styles?: React.CSSProperties
}

const COLORS = {
    "default":{
        falseBg: "var(--Foreground-Colors-foreground-06, #97A1AF)",
        trueBg: "var(--Base-600, #414E62)",
        disabledBg: "var(--Background-Colors-bg-disabled, #E4E7EC)"
    },
    "primary":{
        falseBg: "var(--Foreground-Colors-foreground-06, #97A1AF)",
        trueBg: "var(--Components-Buttons-button-brand-bg, #0166FF)",
        disabledBg: "var(--Background-Colors-bg-disabled, #E4E7EC)"
    },
    "red-green":{
        falseBg: "var(--Error-500, #FF4D4D)",
        trueBg: "var(--Success-500, #10B978)",
        disabledBg: "var(--Background-Colors-bg-disabled, #E4E7EC)"
    }
}

const SIZE = {
    "small":{ 
        circle: "1rem",
        width: "2.25rem",
        height: "1.25rem"
    },
    "medium":{ 
        circle: "1.25rem",
        width: "2.75rem",
        height: "2.75rem"
    }
}

const Switch: React.FC<SwitchProps> = ({ 
    isOn, 
    handleToggle,
    type = "default",
    size = "small",
    right = true,
    disabled = false,
    styles,
    children
}) => {
    const {falseBg, trueBg, disabledBg} = COLORS[type];

    const Wrapper = size === "small" ? Small : Medium;
    const bg = disabled ? disabledBg : isOn ? trueBg : falseBg;

    return (
        <FullWrapper style={styles}>
            {!right && children}
                <Wrapper on={isOn} onClick={handleToggle} bg={bg} style={{pointerEvents: disabled ? "none" : "auto"}}>
                    <Circle isOn={isOn} size={size} className="circle"/>
                </Wrapper>
            {right && children}
        </FullWrapper>
    );
};

export default Switch;

const FullWrapper = styled.div`
    display: inline-flex;
    align-items: flex-start;
    gap: var(--padding-10, 1rem);
    align-items: center;
`;

const Medium = styled.div<{on:boolean, bg:string}>`
    position: relative;
    cursor: pointer;

    display: flex;
    width: 2.75rem;
    height: 1.5rem;
    ${props => props.on ? "padding: 0.125rem 0.125rem 0.125rem 0.5rem;" : "padding: 0.125rem 0.5rem 0.125rem 0.125rem;"}
    
    .circle {
        transform: translateX(${props => props.on ? "0.85rem" : "0"});
        transition: transform 0.2s;
    }

    align-items: center;

    border-radius: 31.25rem;
    background: ${(props) => props.bg};

    transition: background-color 0.2s;
`;

const Small = styled.div<{on:boolean, bg:string}>`
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s;
    transition: justify-content 0.2s;

    display: flex;
    width: 2.25rem;
    height: 1.25rem;
    align-items: center;
    flex-shrink: 0;

    ${props => props.on ? "padding: 0.125rem 0.125rem 0.125rem 0.5rem;" : "padding: 0.125rem 0.5rem 0.125rem 0.125rem;"}

    border-radius: 31.25rem;
    background: ${(props) => props.bg};

    .circle {
        transform: translateX(${props => props.on ? "0.60rem" : "0"});
        transition: transform 0.2s;
    }
`;

export const TextWrapper = styled.div`
    display: flex;
    padding-top: var(--padding-2, 0.125rem);
    flex-direction: column;
    align-items: flex-start;
`;

export const Title = styled.p`
    color: var(--Text-text-secondary, #344051);
    text-shadow: 0 1px 2px rgba(20, 28, 36, 0.04);

    /* Paragraph S/Medium */
    font-family: Inter;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem; /* 142.857% */
`;

export const Subtitle = styled.p`
    color: var(--Text-text-tertiary, #637083);
    text-shadow: 0 1px 2px rgba(20, 28, 36, 0.04);

    /* Paragraph S/Regular */
    font-family: Inter;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.25rem; /* 142.857% */
`;