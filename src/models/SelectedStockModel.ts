import { Stock } from './OrderModel';

export interface SelectedStock {
  stockInfo: Stock;
  userPossession: UserStock;
}

export interface UserStock extends Stock {
  amountAvailableForSale: number;
}
