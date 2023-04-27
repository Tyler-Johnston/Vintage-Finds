import { createContext } from 'react';

export type Location = {
  latitude: number,
  longitude: number,
};

export default createContext<Location | null>(null);
