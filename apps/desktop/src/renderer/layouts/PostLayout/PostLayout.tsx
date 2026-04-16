import React, {useEffect, useMemo, useState} from "react";
import { ProductPostItemType } from "@site-parser/shared";
import styles from "./PostLayout.module.css";

type Props = {
  item: ProductPostItemType;
  onSelectedImagesChange?: (selectedImages: string[]) => void;
};

export const PostLayout: React.FC<Props> = ({item, onSelectedImagesChange}) => {
  const limitedImages = useMemo(() => {
    return item.imageUrls ?? [];
  }, [item.imageUrls]);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    onSelectedImagesChange?.(selectedImages);
  }, [selectedImages]);

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

      if (prev.length >= 10) {
        return prev;
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
                <span className={styles.priceInlineValue}>{item.price} €</span>
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
                Выбрано: {selectedImages.length} / 10
              </span>
            </div>

            <div className={styles.thumbs}>
              {limitedImages.map((img, i) => {
                const selectedIndex = selectedImages.indexOf(img);
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
          {isSelected ? `Выбрано: ${selectedIndex + 1}` : "Сохранить"}
        </span>
                    </div>
                  </div>
                );
              })}
              <div className={styles.empty}></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};