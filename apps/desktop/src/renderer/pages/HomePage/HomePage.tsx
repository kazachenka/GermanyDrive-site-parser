import {useNavigate} from "react-router-dom";
import {useAuth} from "../../features/auth/model/auth.context";
import {AppButton} from "../../shared/ui/AppButton/AppButton";
import {AppInput} from "../../shared/ui/AppInput/AppInput.tsx";
import {useState} from "react";
import {useSiteParser} from "../../features/parser/model/parser.context.tsx";
import styles from "./HomePage.module.css";
import {AppLoader} from "../../shared/ui/AppLoader/AppLoader.tsx";
import {useError} from "../../features/error/error.context.tsx";
import { getParserByUrl } from "../../features/parser/lib/parser.utils.ts";

export function HomePage() {
  const navigate = useNavigate();
  const { parseSite, setProductPrice } = useSiteParser();
  const { isLoadingAuth } = useAuth();
  const { showError } = useError()

  const [loading, setLoading] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");
  const [price, setPrice] = useState("");

  const processUrl = async () => {
    try {
      setLoading(true);

      if (siteUrl && price) {
        const parserFunction = getParserByUrl(String(siteUrl));

        if (!parserFunction) {
          showError('Данная ссылка не поддерживается.');

          return;
        }

        await parseSite({ url: siteUrl });

        setProductPrice(price);

        navigate("/parser/product")
      } else {
        showError('Нужно ввести ссылку и цену');
      }
    } catch (error) {
      console.log(error);

      showError('Что то пошло не так');
    } finally {
      setLoading(false);
    }
  }

  if (loading || isLoadingAuth) {
    return (
      <AppLoader />
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Обработка сайта</h2>

        <div className={styles.inputs}>
          <AppInput
            label="Site Url"
            type="text"
            value={siteUrl}
            placeholder="https://link"
            onChange={(e) => setSiteUrl(e.target.value)}
          />

          <AppInput
            label="Цена €"
            type="number"
            value={price}
            placeholder="Цена"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <AppButton onClick={processUrl} loading={isLoadingAuth} fullWidth>
            Обработать
          </AppButton>
        </div>
      </div>
    </div>
  )
}