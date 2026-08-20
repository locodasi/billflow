"use client";



import InvoicesPerState from "./charts/InvoicesPerState";
import InvoicesVsPayments from "./charts/InvoicesVsPayments";



const Auxiliar = () => {

    return (
        <>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                

                <div style={{ display: 'flex', gap: '1rem', width: '100%', flexWrap: 'nowrap' }}>

                    <InvoicesPerState data={[
                        { mes: "Enero", pagado: 2400, adeudado: 400 },
                        { mes: "Febrero", pagado: 1398, adeudado: 300 },
                        { mes: "Marzo", pagado: 9800, adeudado: 200 },
                        { mes: "Abril", pagado: 3908, adeudado: 100 },
                        { mes: "Mayo", pagado: 4800, adeudado: 50 },
                        { mes: "Junio", pagado: 3800, adeudado: 20 },
                    ]} />

                    <InvoicesVsPayments data={[
                        { mes: "Enero", ventas2024: 4000, ventas2025: 3500 },
                        { mes: "Febrero", ventas2024: 3000, ventas2025: 2800 },
                        { mes: "Marzo", ventas2024: 2000, ventas2025: 2500 },
                        { mes: "Abril", ventas2024: 2780, ventas2025: 3000 },
                        { mes: "Mayo", ventas2024: 1890, ventas2025: 2000 },
                        { mes: "Junio", ventas2024: 2390, ventas2025: 2200 },
                    ]} />
                </div>
            </div>


        </>
    )
}

export default Auxiliar;



