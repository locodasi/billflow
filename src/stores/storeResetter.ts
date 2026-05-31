// src/stores/storeResetter.ts
type ResetFn = () => void;

const storeResetters = new Set<ResetFn>();

export const registerStoreReset = (reset: ResetFn) => {
    storeResetters.add(reset);
};

export const resetAllStores = () => {
    storeResetters.forEach((reset) => reset());
};