import React, {useEffect, useMemo, useState} from "react";
import {MobileDeRuPostItemType} from "../../features/parser/model/parser.types.ts";
import styles from "./PostLayout.module.css";

type Props = {
  item: MobileDeRuPostItemType;
  onSelectedImagesChange?: (selectedImages: string[]) => void;
};

export const PostLayout: React.FC<Props> = ({item, onSelectedImagesChange}) => {
  const limitedImages = useMemo(() => {
    return (item.imageUrls ?? []).slice(0, 10);
  }, [item.imageUrls]);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    onSelectedImagesChange?.(selectedImages);
  }, [selectedImages, onSelectedImagesChange]);

  const specs = [
    {label: "Пробег", value: item.distance},
    {label: "Регистрация", value: item.register},
    {label: "Двигатель", value: item.engine},
    {label: "КПП", value: item.transmission},
    {label: "Мощность", value: item.power},
    {label: "Топливо", value: item.fuel},
  ];

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageUrl)) {
        return prev.filter((img) => img !== imageUrl);
      }

      return [...prev, imageUrl];
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h3 className={styles.title}>{item.title}</h3>
            {!!item.price && (
              <div className={styles.priceInline}>
                <span className={styles.priceInlineLabel}>Цена</span>
                <span className={styles.priceInlineValue}>{item.price}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.specs}>
          {specs.map((spec) => (
            <div key={spec.label} className={styles.spec}>
              <div className={styles.specLabel}>{spec.label}</div>
              <div className={styles.specValue}>{spec.value || "—"}</div>
            </div>
          ))}
        </div>

        {limitedImages.length > 0 && (
          <>
            <div className={styles.sectionHeader}>
              <span>Фото для постинга</span>
              <span className={styles.counter}>
                Выбрано: {selectedImages.length} / {limitedImages.length}
              </span>
            </div>

            <div className={styles.thumbs}>
              {limitedImages.map((img, i) => {
                const isSelected = selectedImages.includes(img);

                return (
                  <div key={`${img}-${i}`} className={styles.thumbCard}>
                    <button
                      type="button"
                      className={styles.thumbButton}
                      onClick={() => setMainImage(img)}
                    >
                      <img
                        src={img}
                        alt={`car-${i + 1}`}
                        className={styles.thumb}
                      />
                    </button>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleImageSelection(img)}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxText}>Сохранить</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};