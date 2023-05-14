export interface Antique {
    id: string;
    name: string;
    description: string;
    url: string;
    condition: string;
    price: number;
    sale?: boolean;
  }
  export interface AntiqueProp {
    antique: Antique;
  }
