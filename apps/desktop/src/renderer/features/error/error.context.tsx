import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from "react";

type ToastItem = {
  id: number;
  message: string;
};

type ErrorContextType = {
  showError: (message: string) => void;
  removeError: (id: number) => void;
};

const ErrorContext = createContext<ErrorContextType | null>(null);

export const useError = () => {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error("useError must be used within ErrorProvider");
  }

  return context;
};

type ErrorProviderProps = {
  children: ReactNode;
};

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const [errors, setErrors] = useState<ToastItem[]>([]);

  const showError = useCallback((message: string) => {
    const id = Date.now() + Math.random();

    setErrors((prev) => [...prev, { id, message }]);
  }, []);

  const removeError = useCallback((id: number) => {
    setErrors((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      showError,
      removeError,
    }),
    [showError, removeError]
  );

  return (
    <ErrorContext.Provider value={value}>
      {children}

      <div style={styles.container}>
        {errors.map((error) => (
          <ErrorToast
            key={error.id}
            id={error.id}
            message={error.message}
            onClose={removeError}
            duration={3000}
          />
        ))}
      </div>
    </ErrorContext.Provider>
  );
};

type ErrorToastProps = {
  id: number;
  message: string;
  onClose: (id: number) => void;
  duration?: number;
};

const ErrorToast = ({
                      id,
                      message,
                      onClose,
                      duration = 3000,
                    }: ErrorToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div style={styles.toast}>
      <div style={styles.header}>
        <span style={styles.title}>Ошибка</span>
        <button onClick={() => onClose(id)} style={styles.closeButton}>
          ×
        </button>
      </div>
      <div style={styles.message}>{message}</div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "fixed",
    top: 20,
    right: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    zIndex: 9999,
  },
  toast: {
    minWidth: 320,
    maxWidth: 420,
    background: "#fff",
    border: "1px solid #f5c2c7",
    borderLeft: "6px solid #dc3545",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    padding: 16,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontWeight: 700,
    color: "#842029",
  },
  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: 22,
    cursor: "pointer",
    lineHeight: 1,
  },
  message: {
    fontSize: 14,
    color: "#444",
  },
};