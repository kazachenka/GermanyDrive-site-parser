export type SiteParserStatus = "idle" | "loading" | "success" | "error";
import { MobileDeRuPostItemType } from "@site-parser/shared"

export interface SiteParserState {
  status: SiteParserStatus;
  url: string | null;
  html: string | null;
  parsedData: MobileDeRuPostItemType | null;
  selectedImageUrls: string[];
  siteParserLoading: boolean;
  price: string;
  error: string | null;
}

export interface ParseSitePayload {
  url: string;
  force?: boolean;
}

export interface SiteParserContextValue {
  state: SiteParserState;
  parseSite: (payload: ParseSitePayload) => Promise<void>;
  setProductPrice: (price: string) => void;
  reset: () => void;
  setParsedData: (data: MobileDeRuPostItemType | null) => void;
  setSelectedImages: (data: string[]) => void;
  siteParserLoading: boolean;
  sentToTelegramInTest: () => void,
  sentToTelegramInProd: () => void,
}