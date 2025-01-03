'use client';

import React, { useEffect, useState, useCallback } from 'react';
import styles from './ScrollableOptions.module.css';

interface ScrollableOptionsProps {
  setIsSelected: (isSelected: boolean) => void;
}

interface InfoCache {
  [key: string]: string;
}

// Custom hook to fetch options
const useFetchOptions = (url: string) => {
  const [options, setOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch, status: ${res.status}`);
        }
        const data = await res.json();
        setOptions(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [url]);

  return { options, error, isLoading };
};

// Custom hook to fetch information based on option
const useFetchInformation = (
  option: string | null,
  cache: InfoCache,
  setCache: React.Dispatch<React.SetStateAction<InfoCache>>
) => {
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!option) {
      setInfo(null);
      return;
    }

    if (cache[option]) {
      setInfo(cache[option]);
      return;
    }

    const fetchInfo = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/get_table_information_api?database=${option}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch information, status: ${res.status}`);
        }
        const description = await res.json();
        setInfo(description);
        setCache(prev => ({ ...prev, [option]: description }));
      } catch (error: any) {
        setError(error.message);
        setInfo('Failed to load information.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfo();
  }, [option, cache, setCache]);

  return { info, error, isLoading };
};

const ScrollableOptions: React.FC<ScrollableOptionsProps> = ({ setIsSelected }) => {
  const { options, error: optionsError, isLoading: optionsLoading } = useFetchOptions('http://localhost:8000/show_tables_api');
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [infoCache, setInfoCache] = useState<InfoCache>({});
  
  const currentOption = selectedOption || hoveredOption;
  const { info: optionInformation, error: infoError, isLoading: infoLoading } = useFetchInformation(currentOption, infoCache, setInfoCache);

  const handleMouseEnter = useCallback((option: string) => {
    if (!selectedOption) {
      setHoveredOption(option);
    }
  }, [selectedOption]);

  const handleMouseLeave = useCallback(() => {
    if (!selectedOption) {
      setHoveredOption(null);
    }
  }, [selectedOption]);

  const handleClick = useCallback((option: string) => {
    if (selectedOption === option) {
      setSelectedOption(null);
      setIsSelected(false);
      console.log(`Deselected option: ${option}`);
    } else {
      setSelectedOption(option);
      setIsSelected(true);
      console.log(`Selected option: ${option}`);
    }
  }, [selectedOption, setIsSelected]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Publicly Available Databases</h1>

      {optionsError && <p className={styles.error}>Error: {optionsError}</p>}

      <div className={styles.optionsList}>
        {options.map((option, idx) => (
          <div
            key={idx}
            className={`${styles.optionItem} ${
              hoveredOption === option ? styles.optionItemHovered : ''
            } ${selectedOption === option ? styles.optionItemSelected : ''}`}
            onMouseEnter={() => handleMouseEnter(option)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(option)}
          >
            {option}
          </div>
        ))}
        {optionsLoading && <p>Loading options...</p>}
      </div>

      {currentOption && (
        <div className={styles.infoBox}>
          <h2>Details for {currentOption}</h2>
          {infoLoading ? (
            <p>Loading...</p>
          ) : infoError ? (
            <p className={styles.error}>Error: {infoError}</p>
          ) : (
            <p>{optionInformation}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScrollableOptions;