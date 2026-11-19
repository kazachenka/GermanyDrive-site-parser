import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  CustomProductState,
  CustomProductContextValue,
} from "./custom-product.types.ts";
import { CustomProductPostItemType } from "@site-parser/shared"
import { useError } from "../../error/error.context.tsx";
import { defaultCustomProductState, INITIAL_CUSTOM_PRODUCT_STATE } from "./custom-product.constants.ts";
import { customProductApi } from "../api/custom-product.api.ts";

const CustomProductContext = createContext<CustomProductContextValue | undefined>(
  undefined,
);

interface CustomProductProviderProps {
  children: ReactNode;
}

export function CustomProductProvider({ children }: CustomProductProviderProps): JSX.Element {
  const { showError } = useError();

  const [state, dispatchState] = useState(INITIAL_CUSTOM_PRODUCT_STATE);

  const verifyProductDataToSend = (state: CustomProductState): boolean =>{
    if (!(state.customProductData.title)) {
      showError('Необходимо задать название');

      return false;
    }

    return true;
  }

  useEffect(() => {
    if (state.error) {
      showError(state.error);
    }
  }, [state.error]);

  const reset = useCallback(() => {
    dispatchState(prevState => ({
      ...prevState,
      customProductData: structuredClone(defaultCustomProductState),
      imageUrls: [],
    }));
  }, []);

  const setData = useCallback((customProductData: CustomProductPostItemType) => {
    dispatchState(prevState => ({
      ...prevState,
      customProductData: customProductData,
    }));
  }, []);

  const updateImages = useCallback((imageUrls: string[]) => {
    dispatchState(prevState => ({
      ...prevState,
      imageUrls: prevState.imageUrls.concat(imageUrls)
    }));
  }, []);

  const setSelectedImages = useCallback((images: string[]) => {
    dispatchState(prevState => ({
      ...prevState,
      customProductData: {
        ...prevState.customProductData,
        imageUrls: images,
      }
    }));
  }, []);

  const sentToTelegramInTest = async () => {
    if (state.customProductData && verifyProductDataToSend(state)) {
      try {
        dispatchState(prevState => ({
          ...prevState,
          loading: true,
        }));

        await customProductApi.sentDataToTelegramTest(state.customProductData);
      } catch (error) {
        console.log(error);
      } finally {
        dispatchState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
    }
  }

  const sentToTelegramInProd = async () => {
    if (state.customProductData && verifyProductDataToSend(state)) {
      try {
        dispatchState(prevState => ({
          ...prevState,
          loading: true,
        }));

        await customProductApi.sentDataToTelegramProd(state.customProductData);

        reset();
      } catch (error) {
        console.log(error);
      } finally {
        dispatchState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
    }
  }

  const value = useMemo(
    () => ({
      state,
      reset,
      setData,
      setSelectedImages,
      updateImages,
      loading: state.loading,
      sentToTelegramInTest,
      sentToTelegramInProd
    }),
    [state, reset, setData, setSelectedImages, updateImages, sentToTelegramInProd, sentToTelegramInTest],
  );

  return (
    <CustomProductContext.Provider value={value}>
      {children}
    </CustomProductContext.Provider>
  );
}

export function useCustomProduct(): CustomProductContextValue {
  const context = useContext(CustomProductContext);

  if (!context) {
    throw new Error("useCustomProduct must be used within CustomProductProvider");
  }

  return context;
}