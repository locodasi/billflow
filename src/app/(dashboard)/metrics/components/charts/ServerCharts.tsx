// components/charts/ServerCharts.tsx
async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const ServerCharts = async () => {
    await sleep(10000); // simula latencia de red
    return (
        <div style={{ display: 'flex', gap: '1rem', flexDirection: "column" }}>
            <p>(cargado después de 10s)</p>
        </div>
    );
};

export default ServerCharts;