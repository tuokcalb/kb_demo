'use client';
import { useEffect, useState } from 'react';

const ScrollableRows: React.FC = () => {
  const [options, setOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [optionInformation, setOptionInformation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [infoCache, setInfoCache] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('http://localhost:8000/show_tables_api');
        if (!res.ok) {
          throw new Error(`Failed to fetch, status: ${res.status}`);
        }
        const data = await res.json();
        setOptions(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchInformation = async (option: string) => {
      if (infoCache[option]) {
        setOptionInformation(infoCache[option]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/get_table_information_api?database=${option}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch information, status: ${res.status}`);
        }

        const description = await res.json();

        setOptionInformation(description);

        setInfoCache(prevCache => ({
          ...prevCache,
          [option]: description,
        }));
      } catch (error: any) {
        setError(error.message);
        setOptionInformation('Failed to load information.');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedOption) {
      fetchInformation(selectedOption);
    } else if (hoveredOption) {
      fetchInformation(hoveredOption);
    } else {
      setOptionInformation(null);
    }
  }, [hoveredOption, selectedOption, infoCache]);

  const handleMouseEnter = (option: string) => {

    if (!selectedOption) {
      setHoveredOption(option);
    }
  };

  const handleMouseLeave = () => {
    if (!selectedOption) {
      setHoveredOption(null);
      setOptionInformation(null);
    }
  };

  const handleClick = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-xl max-w-lg p-2">Publicly Available Databases</h1>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div
        style={{
          color: 'black',
          width: '300px',
          height: '200px',
          overflowY: 'auto',
        }}
      >
        {options.map((option, idx) => (
          <div
            key={idx}
            style={{
              padding: '0.5rem',
              cursor: 'pointer',
              backgroundColor: hoveredOption === option ? '#f0f8ff' : 'transparent',
              fontWeight: selectedOption === option ? 'bold' : 'normal', 
              transition: 'background-color 0.3s, font-weight 0.3s',
            }}
            onMouseEnter={() => handleMouseEnter(option)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(option)}
          >
            {option}
          </div>
        ))}
      </div>

      {(selectedOption || hoveredOption) && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            border: '1px solid #0070f3',
            borderRadius: '4px',
            backgroundColor: '#e6f7ff',
            color: '#005bb5',
          }}
        >
          <h2>Details for {selectedOption || hoveredOption}</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <p>{optionInformation}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScrollableRows;