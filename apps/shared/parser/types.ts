import { COUNTRIES } from "../countries";

export interface ProductPostItemType {
  url: string;
  imageUrls: string[];
  title: string;
  register: string;
  engine: string;
  transmission: string;
  power: string;
  distance: string;
  fuel: string;
  price: string | null;
}

export interface CustomProductPostItemType {
  imageUrls: string[];
  title: string;
  price: string;
  packageContents: string;
  register: string;
  distance: string;
  engine: string;
  power: string;
  transmission: string;
  drive: string;
  color: string;
  comment: string;
  flag: COUNTRIES | null;
}

export type SiteType = typeof SITE_TYPE[keyof typeof SITE_TYPE];

export type SiteLink = typeof SITE_LINK[keyof typeof SITE_LINK];

export const SITE_TYPE = {
  MOBILE_DE_RU: 'MOBILE_DE_RU',
  AUTOSCOUT_RU: 'AUTOSCOUT_RU',
} as const;

export const SITE_LINK = {
  [SITE_TYPE.MOBILE_DE_RU]: 'mobile.de/ru',
  [SITE_TYPE.AUTOSCOUT_RU]: 'autoscout24.ru',
} satisfies Record<SiteType, string>;
