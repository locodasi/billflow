import styled from "styled-components";

const COLORS = {
    default: "var(--Primary-500, #0166FF)",
    base: "var(--Foreground-Colors-foreground-01, #141C25)",
    error: "var(--Error-500, #FF4D4D)",
    success: "var(--Success-500, #10B978)",
}

interface Props {
    progress: number;
    color?: keyof typeof COLORS;
    otherColor?: string;
    
}

const ProgressBar = ({ progress, color = "default", otherColor }: Props) => {

    return(
        <Bar>
            <Bar style={{ width: `${progress}%`, background: otherColor || COLORS[color] }} />
        </Bar>
    )
}

export default ProgressBar;

const Bar = styled.div`
    width: 100%;
    height: 0.375rem;
    border-radius: var(--radius-max, 62.4375rem);
    background: var(--Background-Colors-bg-tertiary, #F2F4F7);
`;