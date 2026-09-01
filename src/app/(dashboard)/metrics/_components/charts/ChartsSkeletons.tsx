"use client";

import Skeleton from "@/components/Skeleton";

const ChartsSkeletons = () => {

    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Skeleton customStyles={{flex: "1", height: "20rem", borderRadius: "0.5rem"}} />
            <Skeleton customStyles={{flex: "1", height: "20rem", borderRadius: "0.5rem"}} />
        </div>
    )
}

export default ChartsSkeletons;