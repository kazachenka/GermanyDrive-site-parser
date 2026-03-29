import type {SiteParserState} from "./parser.types";

export const INITIAL_SITE_PARSER_STATE: SiteParserState = {
  status: "idle",
  url: null,
  html: null,
  parsedData: null,
  error: null,
  selectedImageUrls: [],
};

export const PARSER_ACTIONS = {
  PARSE_START: "PARSE_START",
  PARSE_SUCCESS: "PARSE_SUCCESS",
  PARSE_ERROR: "PARSE_ERROR",

  SET_SELECTED_IMAGE_URLS: "SET_SELECTED_IMAGE_URLS",
  SET_PARSED_DATA: "SET_PARSED_DATA",
  RESET: "RESET",

  SENT_TELEGRAM_TEST: "SENT_TELEGRAM_TEST",
  SENT_TELEGRAM_PROD: "SENT_TELEGRAM_PROD",
} as const;