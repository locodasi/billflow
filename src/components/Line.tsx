interface LineProps {
    width?: string;
    background?: string;
    height?: string;
    vertical?: boolean;
}

const Line = ({ width = "100%", background = "var(--Border-Colors-border-secondary, #27313F)", height = "0.0625rem", vertical = false }: LineProps) => {

    return(
        <div style={{ width: vertical ? height : width, background, height: vertical ? width : height}} />
    )
}

export default Line;