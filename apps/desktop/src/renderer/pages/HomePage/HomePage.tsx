import {useNavigate} from "react-router-dom";
import {useAuth} from "../../features/auth/model/auth.context";
import {AppButton} from "../../shared/ui/AppButton/AppButton";
import {AppInput} from "../../shared/ui/AppInput/AppInput.tsx";
import {useEffect, useState} from "react";
import {useSiteParser} from "../../features/parser/model/parser.context.tsx";

export function HomePage() {
  const navigate = useNavigate();
  const { parseSite, setProductPrice } = useSiteParser();
  const { logout, isLoading } = useAuth();

  const [siteUrl, setSiteUrl] = useState("");
  const [price, setPrice] = useState("");

  const handleLogout = async () => {
    await logout();

    navigate("/login");
  };

  const processUrl = async () => {
    try {
      await parseSite({url: siteUrl});

      setProductPrice(price);

      navigate("/product")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      style={{padding: 24, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
      <div style={{width: 500, marginBottom: 20}}>
        <AppInput
          label="Site Url"
          type="text"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
        />

        <AppInput
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>


      <AppButton onClick={processUrl} loading={isLoading}>
        Обработать
      </AppButton>

      {/*<AppButton onClick={handleLogout} loading={isLoading}>*/}
      {/*    Выйти*/}
      {/*</AppButton>*/}
    </div>
  );
}