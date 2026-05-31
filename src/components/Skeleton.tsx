import styled from "styled-components";

interface SkeletonProps {
    backgroundColor?: string;
    customStyles?: React.CSSProperties;
    animationSpeed?: number;
}

const Skeleton = ({ backgroundColor = "var(--Background-Colors-bg-disabled, #E4E7EC)", customStyles = {}, animationSpeed = 2 }: SkeletonProps) => {

    return(
        <SkeletonStyle $bg={backgroundColor} style={customStyles} $animationSpeed={animationSpeed} />
    )
}

export default Skeleton;

const SkeletonStyle = styled.div<{ $bg: string, $animationSpeed: number }>`
    display: flex;
    height: 1.25rem;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
    width: 100%;

    border-radius: 0.1875rem;

    background: linear-gradient(90deg, ${({ $bg }) => $bg} 25%, var(--Background-Colors-bg-primary, #27313F) 75%);
    background-size: 200% 100%;
    animation: skeleton-animation ${({ $animationSpeed }) => $animationSpeed}s infinite ease-in-out;

    @keyframes skeleton-animation {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
`;