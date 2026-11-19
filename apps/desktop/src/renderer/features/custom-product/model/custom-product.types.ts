import { CustomProductPostItemType } from "@site-parser/shared"

export interface CustomProductState {
  loading: boolean;
  customProductData: CustomProductPostItemType;
  imageUrls: string[];
  error: null | string;
}

export interface CustomProductContextValue {
  state: CustomProductState;
  reset: () => void;
  setData: (data: CustomProductPostItemType) => void;
  setImages: (data: string[]) => void;
  setSelectedImages: (data: string[]) => void;
  loading: boolean;
  sentToTelegramInTest: (data?: CustomProductPostItemType) => void,
  sentToTelegramInProd: (data?: CustomProductPostItemType) => void,
}