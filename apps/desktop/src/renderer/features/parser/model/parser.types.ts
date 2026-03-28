export type SiteParserStatus = "idle" | "loading" | "success" | "error";

export interface MobileDeRuPostItemType {
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

export interface SiteParserState {
    status: SiteParserStatus;
    url: string | null;
    html: string | null;
    parsedData: MobileDeRuPostItemType | null;
    error: string | null;
    lastUpdatedAt: number | null;
}

export interface ParseSitePayload {
    url: string;
    force?: boolean;
}

export interface SiteParserContextValue {
    state: SiteParserState;
    parseSite: (payload: ParseSitePayload) => Promise<void>;
    reset: () => void;
    setParsedData: (data: MobileDeRuPostItemType | null) => void;
}