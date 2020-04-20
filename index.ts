import { of, Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { switchMap, catchError, map, tap, switchMapTo } from "rxjs/operators";
import { Cart, ExchangableValue, Rate, TotalPrice, Prices } from "./model";

const selectedCart: Cart[] = [
  { price: 20 },
  { price: 45 },
  { price: 67 },
  { price: 1305 },
];
const BASE_CURRENCY = "USD";

const getData$: Observable<ExchangableValue> = fromFetch(
  `https://api.exchangeratesapi.io/latest?base=${BASE_CURRENCY}`
).pipe(
  switchMap((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return of({ error: true, message: `Error ${response.status}` });
    }
  }),
  catchError((err) => {
    console.error(err);
    return of({ error: true, message: err.message });
  })
);

const getSum = (prices: number[]): number =>
  prices.reduce((acc, price) => acc + price, 0);
  
const convertValues = (rates: Rate, multValue: number = 1): TotalPrice =>
  (Object as any)
    .entries(Prices)
    .reduce(
      (acc, [key, value]) => ({ ...acc, [key]: rates[value] * multValue }),
      {}
    );

const convertPrices$ = (prices: Cart[]): Observable<TotalPrice> => {
  const sumValue = getSum(prices.map(({ price }) => price));
  return getData$.pipe(map((resp) => convertValues(resp.rates, sumValue)));
};

convertPrices$(selectedCart).subscribe({
  next: (result) => console.log(result),
  complete: () => console.log("done"),
});
