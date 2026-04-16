import { getMobileDePageData } from "./parser-mobie-de-ru.ts";
import { getAutoscoutPageData } from "./parser.autoscout-ru.ts";
import { ProductPostItemType, SITE_LINK, SITE_TYPE, SiteLink, SiteType } from "@site-parser/shared"

const SITE_CONFIG = {
  [SITE_TYPE.MOBILE_DE_RU]: {
    link: SITE_LINK[SITE_TYPE.MOBILE_DE_RU],
    parser: getMobileDePageData,
  },
  [SITE_TYPE.AUTOSCOUT_RU]: {
    link: SITE_LINK[SITE_TYPE.AUTOSCOUT_RU],
    parser: getAutoscoutPageData,
  },
} satisfies Record<
  SiteType,
  {
    link: SiteLink,
    parser: (url: string | undefined) => ProductPostItemType | null
  }
>;

export const isString = (elem: unknown): boolean => typeof elem === 'string';

export const removeEmptySymbols = (str: string) => {
  if (!isString(str)) return str;

  return str.replace(/&nbsp;|\u00A0/g, '');
}

export const getParserByUrl = (url: string) => {
  const entry = Object.values(SITE_CONFIG).find(config =>
    url.includes(config.link)
  );

  return entry?.parser;
};