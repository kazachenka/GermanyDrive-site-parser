import { FC, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./AppModal.module.css"

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const AppModal: FC<AppModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null; // защита от null

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
          e.stopPropagation()
        }
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default AppModal;