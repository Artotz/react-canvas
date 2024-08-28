import { useState, useEffect, useCallback } from "react";

export function useLocalStorage(key: any, defaultValue: any) {
  return useStorage(key, defaultValue, window.localStorage);
}

export function useSessionStorage(key: any, defaultValue: any) {
  return useStorage(key, defaultValue, window.sessionStorage);
}

function useStorage(key: any, defaultValue: any, storageObject: Storage) {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);
    if (typeof defaultValue === "function") {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });
  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);
  const remove = useCallback(() => {
    setValue(undefined);
  }, []);
  return [value, setValue, remove];
}
