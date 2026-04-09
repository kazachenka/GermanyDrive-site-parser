import React, { useState } from 'react';
import styles from "./AppUploader.module.css"

type Props = { onUpload: (images: string[]) => void }

export const AppUploader = ({ onUpload }: Props) => {
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await mainApiFetch<{ url: string }>("/files/upload", {
          method: "POST",
          body: formData,
        });
        return response.url;
      } catch (err) {
        console.error(`Ошибка загрузки ${file.name}:`, err);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((url): url is string => url !== null);

    onUpload(successfulUploads);
    setUploading(false);

    e.target.value = '';
  };

  return (
    <div className={styles.uploadContainer}>
      <input
        type="file"
        id="file-upload"
        multiple
        accept="image/*"
        onChange={uploadFiles}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      <label htmlFor="file-upload" className={`${styles.uploadLabel} ${uploading ? 'disabled' : ''}`}>
        {uploading ? 'Загрузка...' : 'Загрузить фото (можно несколько)'}
      </label>
    </div>
  );
};

async function mainApiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  const API_URL = import.meta.env.VITE_API_URL;

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      const data = await response.json();
      message = data.message ?? data.error ?? message;
    } catch {
      try {
        message = await response.text();
      } catch {
        message = "Request failed";
      }
    }

    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}