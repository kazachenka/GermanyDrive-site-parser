import React from "react";
import { MobileDeRuPostItemType } from "../../features/parser/model/parser.types.ts";
import styles from "./PostLayout.module.css";

type Props = {
    item: MobileDeRuPostItemType;
};

export const PostLayout: React.FC<Props> = ({ item }) => {
    const mainImage =
        item.imageUrls?.[0] ||
        "https://via.placeholder.com/600x400?text=No+Image";

    const specs = [
        { label: "Пробег", value: item.distance },
        { label: "Регистрация", value: item.register },
        { label: "Двигатель", value: item.engine },
        { label: "КПП", value: item.transmission },
        { label: "Мощность", value: item.power },
        { label: "Топливо", value: item.fuel },
    ];

    return (
        <div className={styles.root}>
            <div className={styles.imageWrapper}>
                <img
                    src={mainImage}
                    alt={item.title}
                    className={styles.image}
                />

                {item.price && (
                    <div className={styles.price}>
                        <div className={styles.priceLabel}>Цена</div>
                        <div className={styles.priceValue}>{item.price}</div>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{item.title}</h3>

                <div className={styles.specs}>
                    {specs.map((spec) => (
                        <div key={spec.label} className={styles.spec}>
                            <div className={styles.specLabel}>{spec.label}</div>
                            <div className={styles.specValue}>
                                {spec.value || "—"}
                            </div>
                        </div>
                    ))}
                </div>

                {item.imageUrls?.length > 1 && (
                    <div className={styles.thumbs}>
                        {item.imageUrls.slice(0, 5).map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt=""
                                className={styles.thumb}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};