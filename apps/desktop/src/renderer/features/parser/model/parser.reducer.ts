import { MobileDeRuPostItemType, SiteParserState } from "./parser.types";

type SiteParserAction =
    | { type: "PARSE_START"; payload: { url: string } }
    | {
    type: "PARSE_SUCCESS";
    payload: {
        url: string;
        html: string;
        parsedData: MobileDeRuPostItemType | null;
    };
}
    | { type: "PARSE_ERROR"; payload: { error: string } }
    | { type: "SET_PARSED_DATA"; payload: { parsedData: MobileDeRuPostItemType | null } }
    | { type: "RESET" };

export function siteParserReducer(
    state: SiteParserState,
    action: SiteParserAction,
): SiteParserState {
    switch (action.type) {
        case "PARSE_START":
            return {
                ...state,
                status: "loading",
                url: action.payload.url,
                error: null,
            };

        case "PARSE_SUCCESS":
            return {
                ...state,
                status: "success",
                url: action.payload.url,
                html: action.payload.html,
                parsedData: action.payload.parsedData,
                error: null,
                lastUpdatedAt: Date.now(),
            };

        case "PARSE_ERROR":
            return {
                ...state,
                status: "error",
                error: action.payload.error,
            };

        case "SET_PARSED_DATA":
            return {
                ...state,
                parsedData: action.payload.parsedData,
                lastUpdatedAt: Date.now(),
            };

        case "RESET":
            return {
                status: "idle",
                url: null,
                html: null,
                parsedData: null,
                error: null,
                lastUpdatedAt: null,
            };

        default:
            return state;
    }
}