import type { SiteParserState } from "./parser.types";

export const INITIAL_SITE_PARSER_STATE: SiteParserState = {
    status: "idle",
    url: null,
    html: null,
    parsedData: null,
    error: null,
    lastUpdatedAt: null,
};