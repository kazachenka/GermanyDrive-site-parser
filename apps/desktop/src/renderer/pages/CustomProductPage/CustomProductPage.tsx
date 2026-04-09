import {useSiteParser} from "../../features/parser/model/parser.context.tsx";
import {AppUploader} from "../../shared/ui/AppUploader/AppUploader.tsx";
import styles from "./CustomProductPage.module.css";
import {AppButton} from "../../shared/ui/AppButton/AppButton.tsx";
import AppModal from "../../shared/ui/AppModal/AppModal.tsx";
import React, {useEffect, useState} from "react";
import {AppInput} from "../../shared/ui/AppInput/AppInput.tsx";
import { MobileDeRuPostItemType } from "@site-parser/shared"
import {AppLoader} from "../../shared/ui/AppLoader/AppLoader.tsx";

export function CustomProductPage() {
  const { state, siteParserLoading ,setSelectedImages ,setProductPrice, setParsedData ,sentToTelegramInTest, sentToTelegramInProd } = useSiteParser();

  const [stateData, setStateData] = useState<MobileDeRuPostItemType>(state.parsedData ?? {
    url: '',
    imageUrls: [],
    title: '',
    register: '',
    engine: '',
    transmission: '',
    power: '',
    distance: '',
    fuel: '',
    price: ''
  });

  useEffect(() => {
    setParsedData(stateData);
    setProductPrice(String(stateData.price));
  }, [stateData]);

  const toggleImageSelection = (imageUrl: string) => {
      if (state.selectedImageUrls.includes(imageUrl)) {
        return setSelectedImages(state.selectedImageUrls.filter((img) => img !== imageUrl));
      }

      if (state.selectedImageUrls.length >= 10) {
        return setSelectedImages(state.selectedImageUrls);
      }

      return setSelectedImages([...state.selectedImageUrls, imageUrl]);
  };

  const updateProductSettings = (data: Partial<MobileDeRuPostItemType>) => {
    setStateData({
      ...stateData,
      ...data,
    });
  }

  const uploadImages = (images: string[]) => {
    updateProductSettings({
      imageUrls: stateData.imageUrls.concat(images),
    })
  }

  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const sentToTelegramTestMode = async () => {
    sentToTelegramInTest();
  }

  const sentToTelegramProdMode = async () => {
    sentToTelegramInProd();
    setOpenModal(false);
  }

  const openConfirmSendToTelegram = async () => {
    setOpenModal(true);
  }

  if (siteParserLoading) {
    return <AppLoader />
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.productWrapper}>
        <AppInput
          label="Название авто"
          value={stateData.title}
          placeholder="Название"
          onChange={(e) => updateProductSettings({
            title: e.target.value,
          })}
        />
        <AppInput
          label="Цена €"
          type="number"
          value={stateData.price}
          placeholder="Цена"
          onChange={(e) => updateProductSettings({
            price: e.target.value,
          })}
        />

        <AppInput
          label="Регистрация"
          value={stateData.register}
          placeholder="Регистрация"
          onChange={(e) => updateProductSettings({
            register: e.target.value,
          })}
        />

        <AppInput
          label="Двигатель"
          value={stateData.engine}
          placeholder="**** куб. cм"
          onChange={(e) => updateProductSettings({
            engine: e.target.value,
          })}
        />

        <AppInput
          label="КПП"
          value={stateData.transmission}
          placeholder="КПП"
          onChange={(e) => updateProductSettings({
            transmission: e.target.value,
          })}
        />

        <AppInput
          label="Мощность"
          value={stateData.power}
          placeholder="Мощность"
          onChange={(e) => updateProductSettings({
            power: e.target.value,
          })}
        />

        <AppInput
          label="Пробег"
          value={stateData.distance}
          placeholder="Пробег"
          onChange={(e) => updateProductSettings({
            distance: e.target.value,
          })}
        />

        <AppInput
          label="Топливо"
          value={stateData.fuel}
          placeholder="Топливо"
          onChange={(e) => updateProductSettings({
            fuel: e.target.value,
          })}
        />

        <AppInput
          label="Ссылка на продукт"
          value={stateData.url}
          placeholder="https://....."
          onChange={(e) => updateProductSettings({
            url: e.target.value,
          })}
        />

        <div className={styles.sectionHeader}>
          <span>Фото для постинга (загружено {stateData.imageUrls.length})</span>
           <span className={styles.counter}>
            Выбрано: {state.selectedImageUrls.length} / 10
           </span>
        </div>

          {stateData.imageUrls.length > 0 && (
            <div className={styles.thumbs}>
              {stateData.imageUrls.map((img, i) => {
                const selectedIndex = state.selectedImageUrls.indexOf(img);
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