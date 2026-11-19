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
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function AppDropdown<T>({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchable = false,
  searchPlaceholder = "Поиск...",
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = searchable
    ? options.filter((opt) => {
      const query = search.trim().toLowerCase();
      if (!query) return true;
      return (
        opt.label.toLowerCase().includes(query) ||
        String(opt.value).toLowerCase().includes(query)
      );
    })
    : options;

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

  useEffect(() => {
    if (open) {
      updatePosition();
      setSearch("");
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
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
          type="button"
          ref={buttonRef}
          onClick={() => setOpen((prev) => !prev)}
          className={styles.input}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </button>
      </div>

      {open &&
        createPortal(
          <div
            className={styles.listBorder}
            ref={listRef}
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
            }}
          >
            {searchable && (
              <div style={{ padding: "6px" }}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  placeholder={searchPlaceholder}
                  style={{ width: "100%", padding: "6px 8px" }}
                  className={styles.input}
                />
              </div>
            )}
            <ul
              className={styles.list}
              style={{
                position: "static",
                width: "100%",
              }}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
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
                ))
              ) : (
                <li style={{ padding: "10px", opacity: 0.6 }}>
                  Ничего не найдено
                </li>
              )}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
}