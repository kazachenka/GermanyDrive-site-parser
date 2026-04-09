import {useSiteParser} from "../../features/parser/model/parser.context.tsx";
import {useEffect, useMemo, useRef, useState} from "react";
import {getMobileDePageData} from "../../features/parser/lib/parser.utils.ts";
import {AppButton} from "../../shared/ui/AppButton/AppButton.tsx";
import {PostLayout} from "../../layouts/PostLayout/PostLayout.tsx";
import {useNavigate} from "react-router-dom";
import styles from "./ProductPage.module.css";
import {AppLoader} from "../../shared/ui/AppLoader/AppLoader.tsx";
import AppModal from "../../shared/ui/AppModal/AppModal.tsx";

export function sanitizeHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("script").forEach((el) => el.remove());

  return doc.body.innerHTML;
}

export function ProductPage() {
  const { siteParserLoading, state, reset, setParsedData, setSelectedImages, sentToTelegramInTest, sentToTelegramInProd } = useSiteParser();
  const navigate = useNavigate();
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const onSelectedImagesChange = (images: string[]) => {
    setSelectedImages(images);
  }

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

  const clickBack = async () => {
    reset();
    navigate('/parser');
  }

  const sanitizedHtml = useMemo(() => {
    if (!state.html) return "";
    return sanitizeHtml(state.html);
  }, [state.html]);

  useEffect(() => {
    if (!hiddenRef.current) return;
    if (!sanitizedHtml) return;

    const result = getMobileDePageData(String(state.url));

    setParsedData(result);

  }, [sanitizedHtml]);

  if (siteParserLoading){
    return (
      <AppLoader />
    )
  }

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
        <PostLayout
          item={state.parsedData}
          onSelectedImagesChange={onSelectedImagesChange}
        />}

      <div className={styles.buttonWrapper}>
        <AppButton onClick={clickBack}>
          Назад
        </AppButton>

        {state.parsedData &&
          <AppButton onClick={sentToTelegramTestMode}>
            Тестовая отправка
          </AppButton>
        }

        {state.parsedData &&
          <AppButton onClick={openConfirmSendToTelegram}>
            Отправка в группу
          </AppButton>
        }
      </div>

      <AppModal isOpen={isOpenModal} onClose={() => setOpenModal(false)}>
        <p className={styles.modalText}>Вы действительно желаете отправить в группу?</p>
        <div className={styles.buttonWrapper}>
          <AppButton onClick={() => setOpenModal(false)}>Отмена</AppButton>
          <AppButton onClick={() => sentToTelegramProdMode()}>Отправить</AppButton>
        </div>

      </AppModal>

    </div>
  );
}