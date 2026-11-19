import { AppUploader } from "../../shared/ui/AppUploader/AppUploader.tsx";
import styles from "./CustomProductPage.module.css";
import { AppButton } from "../../shared/ui/AppButton/AppButton.tsx";
import AppModal from "../../shared/ui/AppModal/AppModal.tsx";
import React, { useEffect, useState } from "react";
import { AppInput } from "../../shared/ui/AppInput/AppInput.tsx";
import { CustomProductPostItemType } from "@site-parser/shared"
import { AppLoader } from "../../shared/ui/AppLoader/AppLoader.tsx";
import { AppDropdown } from "../../shared/ui/AppDropdown/AppDrodpown.tsx";
import { countryOptions, driveOptions, transmissionOptions } from "./constants.ts";
import { useCustomProduct } from "../../features/custom-product/model/custom-product.context.tsx";
import { defaultCustomProductState } from "../../features/custom-product/model/custom-product.constants.ts";

export function CustomProductPage() {
  const { state, updateImages, setSelectedImages, setData, sentToTelegramInTest, sentToTelegramInProd } = useCustomProduct();

  const [stateData, setStateData] = useState<CustomProductPostItemType>(defaultCustomProductState);

  useEffect(() => {
    setData(stateData);
  }, [stateData]);

  const toggleImageSelection = (imageUrl: string) => {
    if (state.customProductData.imageUrls.includes(imageUrl)) {
      return setSelectedImages(state.customProductData.imageUrls.filter((img) => img !== imageUrl));
    }

    if (state.customProductData.imageUrls.length >= 10) {
      return setSelectedImages(state.customProductData.imageUrls);
    }

    return setSelectedImages([...state.customProductData.imageUrls, imageUrl]);
  };

  const updateProductSettings = (data: Partial<CustomProductPostItemType>) => {
    setStateData({
      ...stateData,
      ...data,
    });
  }

  const uploadImages = (images: string[]) => {
    updateImages(images);
  }

  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const sentToTelegramTestMode = async () => {
    sentToTelegramInTest(stateData);
  }

  const sentToTelegramProdMode = async () => {
    try {
      sentToTelegramInProd(stateData);
      setOpenModal(false);
      setStateData(defaultCustomProductState)
    } catch (error) {
      console.error(error);
    }
  }

  const openConfirmSendToTelegram = async () => {
    setOpenModal(true);
  }

  if (state.loading) {
    return <AppLoader />
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.productWrapper}>
        <AppInput
          label="Название авто *"
          value={stateData.title}
          placeholder="Название"
          onChange={(e) => updateProductSettings({
            title: e.target.value,
          })}
        />

        <p className={styles.label}>Страна</p>
        <AppDropdown
          options={countryOptions}
          searchable={true}
          value={stateData.flag}
          onChange={(flag) => updateProductSettings({
            flag: flag,
          })}
        >
        </AppDropdown>

        <AppInput
          label="Цена"
          value={stateData.price}
          placeholder="Цена"
          onChange={(e) => updateProductSettings({
            price: e.target.value,
          })}
        />

        <AppInput
          label="Комплектация"
          value={stateData.packageContents}
          placeholder="Комплектация"
          onChange={(e) => updateProductSettings({
            packageContents: e.target.value,
          })}
        />

        <AppInput
          label="Регистрация"
          value={stateData.register}
          placeholder="мм/гггг"
          onChange={(e) => updateProductSettings({
            register: e.target.value,
          })}
        />

        <AppInput
          label="Пробег"
          value={stateData.distance}
          placeholder="**** км"
          onChange={(e) => updateProductSettings({
            distance: e.target.value,
          })}
        />

        <AppInput
          label="Двигатель"
          value={stateData.engine}
          placeholder="**** см³, бензин"
          onChange={(e) => updateProductSettings({
            engine: e.target.value,
          })}
        />

        <AppInput
          label="Мощность"
          value={stateData.power}
          placeholder="**** л.с."
          onChange={(e) => updateProductSettings({
            power: e.target.value,
          })}
        />

        <p className={styles.label}>Коробка</p>
        <AppDropdown
          options={transmissionOptions}
          value={stateData.transmission}
          onChange={(transmission) => updateProductSettings({
            transmission: transmission,
          })}
        >
        </AppDropdown>

        <p className={styles.label}>Привод</p>
        <AppDropdown
          options={driveOptions}
          value={stateData.drive}
          onChange={(drive) => updateProductSettings({
            drive: drive,
          })}
        >
        </AppDropdown>

        <AppInput
          label="Цвет"
          value={stateData.color}
          placeholder="Цвет"
          onChange={(e) => updateProductSettings({
            color: e.target.value,
          })}
        />

        <AppInput
          label="Коментарий"
          value={stateData.comment}
          placeholder="Коментарий"
          onChange={(e) => updateProductSettings({
            comment: e.target.value,
          })}
        />

        <div className={styles.sectionHeader}>
          <span>Фото для постинга (загружено {state.imageUrls.length})</span>
          <span className={styles.counter}>
            Выбрано: {state.customProductData.imageUrls.length} / 10
           </span>
        </div>

        {state.imageUrls.length > 0 && (
          <div className={styles.thumbs}>
            {state.imageUrls.map((img, i) => {
              const selectedIndex = state.customProductData.imageUrls.indexOf(img);
              const isSelected = selectedIndex !== -1;

              return (
                <div
                  key={`${img}-${i}`}
                  className={`${styles.thumbCard} ${isSelected ? styles.thumbCardSelected : ""}`}
                  onClick={() => toggleImageSelection(img)}
                >
                  <button
                    type="button"
                    className={`${styles.thumbButton} ${isSelected ? styles.thumbButtonSelected : ""}`}
                  >
                    <img
                      src={img}
                      alt={`car-${i + 1}`}
                      className={`${styles.thumb} ${isSelected ? styles.thumbSelected : ""}`}
                    />

                    {isSelected && (
                      <div className={styles.selectedBadge}>
                        {selectedIndex + 1}
                      </div>
                    )}
                  </button>

                  <div className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      className={styles.checkbox}
                      readOnly
                    />
                    <span className={styles.checkboxText}>
                        {isSelected ? `Выбрано: ${selectedIndex + 1}` : "Выбрать"}
                      </span>
                  </div>
                </div>
              );
            })}
            <div className={styles.empty}></div>
          </div>
        )}
      </div>

      <AppUploader
        onUpload={uploadImages}
      />

      <div className={styles.buttonWrapper}>
        <AppButton onClick={sentToTelegramTestMode}>
          Тестовая отправка
        </AppButton>

        <AppButton onClick={openConfirmSendToTelegram}>
          Отправка в группу
        </AppButton>
      </div>

      <AppModal isOpen={isOpenModal} onClose={() => setOpenModal(false)}>
        <p className={styles.modalText}>Вы действительно желаете отправить в группу?</p>
        <div className={styles.buttonWrapper}>
          <AppButton onClick={() => setOpenModal(false)}>Отмена</AppButton>
          <AppButton onClick={() => sentToTelegramProdMode()}>Отправить</AppButton>
        </div>
      </AppModal>
    </div>
  )
}