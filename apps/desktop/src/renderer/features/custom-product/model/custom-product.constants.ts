import type { CustomProductState } from "./custom-product.types.ts";
import { CustomProductPostItemType } from "@site-parser/shared"

export const defaultCustomProductState: CustomProductPostItemType = {
  imageUrls: [],
  title: '',
  register: '',
  engine: '',
  transmission: 'механика',
  power: '',
  distance: '',
  packageContents: '',
  drive: 'задний',
  comment: '',
  color: '',
  flag: null,
  price: ''
}

export const INITIAL_CUSTOM_PRODUCT_STATE: CustomProductState = {
  loading: false,
  customProductData: structuredClone(defaultCustomProductState),
  imageUrls: [],
  error: null,
};