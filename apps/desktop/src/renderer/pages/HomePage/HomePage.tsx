import {useNavigate} from "react-router-dom";
import {useAuth} from "../../features/auth/model/auth.context";
import {AppButton} from "../../shared/ui/AppButton/AppButton";
import {AppInput} from "../../shared/ui/AppInput/AppInput.tsx";
import {useState} from "react";
import {useSiteParser} from "../../features/parser/model/parser.context.tsx";
import styles from "./HomePage.module.css";
import {AppLoader} from "../../shared/ui/AppLoader/AppLoader.tsx";
import {useError} from "../../features/error/error.context.tsx";

export function HomePage() {
  const navigate = useNavigate();
  const { parseSite, setProductPrice } = useSiteParser();
  const { logout, isLoadingAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const { showError } = useError()

  const [siteUrl, setSiteUrl] = useState("");
  const [price, setPrice] = useState("");

  const handleLogout = async () => {
    try {
      setLoading(true);

      await logout();

      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const processUrl = async () => {
    try {
      setLoading(true);

      if (siteUrl && price) {
        await parseSite({url: siteUrl});

        setProductPrice(price);

        navigate("/product")
      } else {
        showError('Нужно ввести ссылку и цену');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
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
            placeholder="https://www.mobile.de/ru/"
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

          <AppButton
            onClick={handleLogout}
            variant="secondary"
            fullWidth
          >
            Выйти
          </AppButton>
        </div>
      </div>
    </div>
  )
}