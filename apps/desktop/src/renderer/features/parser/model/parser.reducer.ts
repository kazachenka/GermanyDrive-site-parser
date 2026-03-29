import {MobileDeRuPostItemType, SiteParserState} from "./parser.types";
import {PARSER_ACTIONS} from "./parser.constants.ts";

type SiteParserAction =
  | { type: typeof PARSER_ACTIONS.PARSE_START; payload: { url: string } }
  | {
  type: typeof PARSER_ACTIONS.PARSE_SUCCESS;
  payload: {
    url: string;
    html: string;
  };
}
  | { type: typeof PARSER_ACTIONS.PARSE_ERROR; payload: { error: string } }
  | { type: typeof PARSER_ACTIONS.SET_PARSED_DATA; payload: { parsedData: MobileDeRuPostItemType | null } }
  | { type: typeof PARSER_ACTIONS.RESET };

export function siteParserReducer(
  state: SiteParserState,
  action: SiteParserAction,
): SiteParserState {
  switch (action.type) {
    case PARSER_ACTIONS.PARSE_START:
      return {
        ...state,
        status: "loading",
        url: action.payload.url,
        error: null,
      };

    case PARSER_ACTIONS.PARSE_SUCCESS:
      return {
        ...state,
        status: "success",
        url: action.payload.url,
        html: action.payload.html,
        error: null,
      };

    case PARSER_ACTIONS.PARSE_ERROR:
      return {
        ...state,
        status: "error",
        error: action.payload.error,
      };

    case PARSER_ACTIONS.SET_PARSED_DATA:
      return {
        ...state,
        parsedData: action.payload.parsedData,
      };

    case PARSER_ACTIONS.RESET:
      return {
        status: "idle",
        url: null,
        html: null,
        parsedData: null,
        error: null,
      };

    default:
      return state;
  }
}