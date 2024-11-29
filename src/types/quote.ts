export interface CabinetItem {
  id: string;
  productId?: string;
  material?: string;
  width: number;
  height: number;
  depth: number;
  price: number;
}

export interface Space {
  id: string;
  name: string;
  items: CabinetItem[];
}