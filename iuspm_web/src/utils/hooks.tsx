import { useState } from "react";

export const usePagination = <T,>(
  datas: Array<T>,
  nbrePerPage: number,
  total?: number
) => {
  const nbrePage = Math.ceil((total ? total : datas.length) / nbrePerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const goTo = async (page: number) => {
    if (page >= 1 && page <= nbrePage) {
      setCurrentPage(page);
    }
  };

  const results = datas.filter(
    (_, i) =>
      i >= (currentPage - 1) * nbrePerPage && i <= currentPage * nbrePerPage - 1
  );

  return { results, nbrePage, goTo, currentPage };
};

export const useLoading = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  return { loading, setLoading, error, setError };
};

export const useLocalStorage = <T,>(keyName: string, defaultValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue: T) => {
    try {
      localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };
  return { storedValue, setValue };
};
