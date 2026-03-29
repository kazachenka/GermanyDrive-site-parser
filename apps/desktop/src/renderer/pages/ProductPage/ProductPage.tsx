import {useSiteParser} from "../../features/parser/model/parser.context.tsx";
import {useEffect, useMemo, useRef, useState} from "react";
import {getMobileDePageData} from "../../features/parser/lib/parser.utils.ts";
import {MobileDeRuPostItemType} from "../../features/parser/model/parser.types.ts";
import {AppButton} from "../../shared/ui/AppButton/AppButton.tsx";
import {PostLayout} from "../../layouts/PostLayout/PostLayout.tsx";
import {useNavigate} from "react-router-dom";
import styles from "./ProductPage.module.css";

export function sanitizeHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("script").forEach((el) => el.remove());

  return doc.body.innerHTML;
}

export function ProductPage() {
  const {state, reset, setParsedData} = useSiteParser();
  const navigate = useNavigate();
  const hiddenRef = useRef<HTMLDivElement>(null);

  const sentToTelegram = async () => {

  }

  const clickBack = async () => {
    reset();
    navigate('/');
  }

  const sanitizedHtml = useMemo(() => {
    if (!state.html) return "";
    return sanitizeHtml(state.html);
  }, [state.html]);

  useEffect(() => {
    if (!hiddenRef.current) return;
    if (!sanitizedHtml) return;

    const result = getMobileDePageData('http://test.com');

    setParsedData(result);

  }, [sanitizedHtml]);

  return (
    <div className={styles.wrapper}>
      <div
        ref={hiddenRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <div dangerouslySetInnerHTML={{__html: sanitizedHtml}}/>
      </div>

      {state.parsedData &&
        <PostLayout item={state.parsedData}
                    onSelectedImagesChange={(images) => {
                      console.log("Выбранные картинки для постинга:", images);
                    }}
        />}

      <div className={styles.buttonWrapper}>
        <AppButton onClick={clickBack}>
          Назад
        </AppButton>

        {state.parsedData &&
          <AppButton onClick={sentToTelegram}>
            Отправить сообщение
          </AppButton>
        }
      </div>

    </div>
  );
}