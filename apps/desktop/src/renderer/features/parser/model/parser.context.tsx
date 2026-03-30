import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
  useState, useEffect,
} from "react";
import {parserApi} from "../api/parser.api";
import {normalizeParserError} from "../lib/normalize-parser-error";
import {validateUrl} from "../lib/validate-url";
import {INITIAL_SITE_PARSER_STATE, PARSER_ACTIONS} from "./parser.constants";
import {siteParserReducer} from "./parser.reducer";
import type {
  ParseSitePayload,
  SiteParserContextValue,
} from "./parser.types";
import { MobileDeRuPostItemType } from "@site-parser/shared"
import {useError} from "../../error/error.context.tsx";

const SiteParserContext = createContext<SiteParserContextValue | undefined>(
  undefined,
);

interface SiteParserProviderProps {
  children: ReactNode;
}

export function SiteParserProvider({ children }: SiteParserProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(
    siteParserReducer,
    INITIAL_SITE_PARSER_STATE,
  );
  const { showError } = useError();

  useEffect(() => {
    if (state.error) {
      showError(state.error);
    }
  }, [state.error]);

  const requestIdRef = useRef(0);

  const parseSite = useCallback(
    async ({url, force = false}: ParseSitePayload) => {
      const trimmedUrl = url.trim();

      if (!trimmedUrl) {
        dispatch({
          type: PARSER_ACTIONS.PARSE_ERROR,
          payload: {error: "URL is required"},
        });
        return;
      }

      if (!validateUrl(trimmedUrl)) {
        dispatch({
          type: PARSER_ACTIONS.PARSE_ERROR,
          payload: {error: "Invalid URL format"},
        });
        return;
      }

      if (
        !force &&
        state.status === "success" &&
        state.url === trimmedUrl &&
        state.parsedData
      ) {
        return;
      }

      const requestId = ++requestIdRef.current;

      dispatch({
        type: PARSER_ACTIONS.PARSE_START,
        payload: {url: trimmedUrl},
      });

      try {
        const result = await parserApi.getSiteByUrl(trimmedUrl);

        if (requestId !== requestIdRef.current) {
          return;
        }

        dispatch({
          type: PARSER_ACTIONS.PARSE_SUCCESS,
          payload: {
            url: trimmedUrl,
            html: result,
          },
        });
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        dispatch({
          type: PARSER_ACTIONS.PARSE_ERROR,
          payload: {
            error: normalizeParserError(error),
          },
        });
      }
    },
    [state.status, state.url, state.parsedData],
  );

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    dispatch({type: PARSER_ACTIONS.RESET});
  }, []);

  const setParsedData = useCallback((data: MobileDeRuPostItemType | null) => {
    dispatch({
      type: PARSER_ACTIONS.SET_PARSED_DATA,
      payload: {parsedData: data},
    });
  }, []);

  const setSelectedImages = useCallback((data: string[]) => {
    dispatch({
      type: PARSER_ACTIONS.SET_SELECTED_IMAGE_URLS,
      payload: { selectedImageUrls: data },
    });
  }, [])

  const setProductPrice = useCallback((price: string) => {
    dispatch({
      type: PARSER_ACTIONS.SET_PRICE,
      payload: { price: price },
    });
  }, [])

  const sentToTelegramInTest = async () => {
    if (state.parsedData && state.selectedImageUrls.length) {
      try {
        dispatch({
          type: PARSER_ACTIONS.SENT_TELEGRAM_TEST,
        });

        const dataForSent: MobileDeRuPostItemType = {
          ...state.parsedData,
          imageUrls: state.selectedImageUrls,
          price: state.price,
        };

        await parserApi.sentDataToTelegramTest(dataForSent);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch({
          type: PARSER_ACTIONS.SENT_TELEGRAM_FINISHED,
        });
      }
    } else {
      showError('Необходимо выбрать фото для отправки');
    }
  }

  const sentToTelegramInProd = async () => {
    if (state.parsedData && state.selectedImageUrls.length) {
      try {
        dispatch({
          type: PARSER_ACTIONS.SENT_TELEGRAM_PROD,
        });

        const dataForSent: MobileDeRuPostItemType = {
          ...state.parsedData,
          imageUrls: state.selectedImageUrls,
          price: state.price,
        };

        await parserApi.sentDataToTelegramProd(dataForSent);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch({
          type: PARSER_ACTIONS.SENT_TELEGRAM_FINISHED,
        });
      }
    } else {
      showError('Необходимо выбрать фото для отправки');
    }
  }

  const value = useMemo(
    () => ({
      state,
      parseSite,
      reset,
      setParsedData,
      setSelectedImages,
      setProductPrice,
      siteParserLoading: state.siteParserLoading,
      sentToTelegramInTest,
      sentToTelegramInProd
    }),
    [state, setProductPrice, parseSite, reset, setParsedData, setSelectedImages, sentToTelegramInProd, sentToTelegramInTest],
  );

  return (
    <SiteParserContext.Provider value={value}>
      {children}
    </SiteParserContext.Provider>
  );
}

export function useSiteParser(): SiteParserContextValue {
  const context = useContext(SiteParserContext);

  if (!context) {
    throw new Error("useSiteParser must be used within SiteParserProvider");
  }

  return context;
}