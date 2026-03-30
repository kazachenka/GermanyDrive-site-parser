import { SiteParserState } from "./parser.types";
import { PARSER_ACTIONS } from "./parser.constants.ts";
import { MobileDeRuPostItemType } from "@site-parser/shared"

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
  | { type: typeof PARSER_ACTIONS.RESET }
  | { type: typeof PARSER_ACTIONS.SET_SELECTED_IMAGE_URLS, payload: { selectedImageUrls: string[] } }
  | { type: typeof PARSER_ACTIONS.SET_PRICE, payload: { price: string } }
  | { type: typeof PARSER_ACTIONS.SENT_TELEGRAM_FINISHED }
  | { type: typeof PARSER_ACTIONS.SENT_TELEGRAM_TEST }
  | { type: typeof PARSER_ACTIONS.SENT_TELEGRAM_PROD };


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
        siteParserLoading: true,
      };

    case PARSER_ACTIONS.PARSE_SUCCESS:
      return {
        ...state,
        status: "success",
        url: action.payload.url,
        html: action.payload.html,
        error: null,
        siteParserLoading: false,
      };

    case PARSER_ACTIONS.PARSE_ERROR:
      return {
        ...state,
        status: "error",
        error: action.payload.error,
        siteParserLoading: false,
      };

    case PARSER_ACTIONS.SET_PARSED_DATA:
      if (action.payload.parsedData) {
        return {
          ...state,
          parsedData: {
            ...action.payload.parsedData,
            price: state.price ?? action.payload.parsedData.price,
          },
        };
      }

      return {
        ...state,
        parsedData: action.payload.parsedData,
        siteParserLoading: false,
      };

    case PARSER_ACTIONS.SET_SELECTED_IMAGE_URLS:
      return {
        ...state,
        selectedImageUrls: action.payload.selectedImageUrls,
      }

    case PARSER_ACTIONS.SET_PRICE:
      return {
        ...state,
        parsedData: state.parsedData && {
          ...state.parsedData,
          price: action.payload.price,
        },
        price: action.payload.price,
      }

    case PARSER_ACTIONS.SENT_TELEGRAM_FINISHED:
      return {
        ...state,
        siteParserLoading: false,
      };

    case PARSER_ACTIONS.SENT_TELEGRAM_TEST:
      return {
        ...state,
        siteParserLoading: true,
      };

    case PARSER_ACTIONS.SENT_TELEGRAM_PROD:
      return {
        ...state,
        siteParserLoading: true,
      };

    case PARSER_ACTIONS.RESET:
      return {
        status: "idle",
        url: null,
        html: null,
        parsedData: null,
        error: null,
        price: '',
        siteParserLoading: false,
        selectedImageUrls: [],
      };

    default:
      return state;
  }
}