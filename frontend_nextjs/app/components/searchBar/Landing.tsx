'use client'
import React,{ useState, ChangeEvent, useRef } from 'react'
import Results from './Results';
import QueryForm from './queryForm'
import GenerateForm from './generateForm'
import Toggle from '../Toggle'
import styles from "../Home.module.css"

/**
 * Main querying component retrieves result 
 * Displays result in tables and offers
 * download as csv
 * @returns 
 */
const Landing: React.FC = () => {
  // All constants needed to keep track of needed variables
  // query: user query; result: table as list;
  const [isSql, setIsSql] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<any[]>([]);
  const [hasResult, setHasResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle mechanics 
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSql(event.target.checked);
  };

  // Fetch from api when query is submitted 
  // Return or Error 
  const onSubmit = async () => {
    console.log("Submitting: " + query);
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/query_database_api?query=${encodeURI(query)}`);
      if (!response.ok) {
        throw new Error(`Server responded with a ${response.status} status`);
      }
      const data = await response.json();
      onResult(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setIsLoading(false);
    }
  };

  const onResult = (data: any) => {
    console.log(data);
    setResult(data);
    setHasResult(true);
    setIsLoading(false);
  };

  // Replace query with sql statement 
  // Directly generates in input box 
  // Could be Improved
  const onGenerate = async () => {
    console.log("Generating: " + query);
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/ask_gpt_api?prompt=${encodeURI(query)}`);
      if (!response.ok) {
        throw new Error(`Server responded with a ${response.status} status`);
      }
      const data = await response.json();
      onQuery(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message);
      setIsLoading(false);
      setIsSql(true);
    }
  };
  
  const onQuery = (data: any) => {
    console.log(data);
    setQuery(data);
    setIsLoading(false);
  }

  // Display Elements 
  let resultsElement = null;
  let formElement = null;

  // Stub for future
  if (isSql) {
    formElement = (<QueryForm query={query} setQuery={setQuery} onSubmit={onSubmit} isLoading={isLoading} error={error} />);
  } else{
    formElement = (<GenerateForm query={query} setQuery={setQuery} onGenerate={onGenerate} isLoading={isLoading} error={error} />);
  } 

  if (hasResult && result.length > 0) {
    resultsElement = (<Results result={result} />);
  }
  
  // Actual display
  return (
    <div className = {styles.parent}>
      <div className = {styles.child}>
        <p className="text-xl max-w-lg p-2">Type in query:</p>
        {formElement} 
        <Toggle isSql={isSql} handleToggle={handleToggle} />
        </div>
      <div className = {styles.child}>
        {resultsElement}
      </div>
    </div>
  );
};

export default Landing;