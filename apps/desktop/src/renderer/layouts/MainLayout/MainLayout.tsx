import {AppFooter} from "../../components/AppFooter/AppFooter.tsx";
import {AppHeader} from "../../components/AppHeader/AppHeader.tsx";
import type {PropsWithChildren} from "react";
import styles from "./MainLayout.module.css";

export default function MainLayout({children}: PropsWithChildren) {
  return (
    <div className={styles.mainLayout}>
      <AppHeader />
      <main className={styles.mainLayout}>
        {children}
       </main>
      <AppFooter />
    </div>
  );
}