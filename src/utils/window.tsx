import { useSyncExternalStore } from 'react';

export function useWindowWidth() {
  const width = useSyncExternalStore(subscribe, getSnapshot);
  return width;
}

function subscribe(callback: any) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getSnapshot() {
  return window.innerWidth;
}
