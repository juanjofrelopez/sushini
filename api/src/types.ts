export interface SushiOrder {
  product_code: string;
  quantity: number;
}

export interface StockResponse {
  inStock: boolean;
  message: string;
}

export interface ChatRequest {
  message: string;
}

export type Embedding = number[];
