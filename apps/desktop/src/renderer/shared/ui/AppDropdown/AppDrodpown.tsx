import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./AppDropdown.module.css";

export type DropdownOption<T> = {
  label: string;
  value: T;
};

interface DropdownProps<T> {
  options: DropdownOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
}

export function AppDropdown<T>({
                                 options,
                                 value,
                                 onChange,
                                 placeholder = "Select...",
                               }: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const selectedOption = options.find((o) => o.value === value);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  // при открытии — вычислить позицию
  useEffect(() => {
    if (open) {
      updatePosition();
    }
  }, [open]);

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target) // ← добавили!
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div ref={wrapperRef} className={styles.wrapper}>
        <button
          ref={buttonRef}
          onClick={() => setOpen((prev) => !prev)}
          className={styles.input}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </button>
      </div>

      {open &&
        createPortal(
          <ul
            className={styles.list}
            ref={listRef}
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
            }}
          >
            {options.map((opt) => (
              <li
                key={String(opt.value)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </>
  );
}