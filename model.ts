export interface TotalPrice {
   rubles: number;
   euros: number;
   usd: number;
   pounds: number;
   yens: number;
};

export interface ExchangableValue {
  rates: Rate,
  base?: string,
  date: string
}

export interface Rate {
  [curency: string]: number
}

export interface Cart {
  price: number;
}

export enum Currency {
  rubles = 'RUB',
  euros = 'EUR',
  usdollars = 'USD',
  pounds = 'GBP',
  yens = 'JPY'
}