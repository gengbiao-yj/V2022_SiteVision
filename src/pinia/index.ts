import basicPinia from '@/pinia/storagePinia';

export let basicStore: ReturnType<typeof basicPinia>;

const setupPiniaStore = () => {
  basicStore = basicPinia();
};

export default setupPiniaStore;
