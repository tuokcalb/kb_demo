"use client"
import React,{ useState, ChangeEvent, useRef } from 'react'
import Results from './Results';
import QueryForm from './queryForm'
import GenerateForm from './generateForm'
import Toggle from './Toggle'
import styles from "../Home.module.css"

const Landing: React.FC = () => {
  const [isSql, setIsSql] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<any[]>([]);
  const [hasResult, setHasResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  var pageColor = "border-gray-200";
  var adjust = "";

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSql(event.target.checked);
  };

  const onSubmit = () => {
    console.log("Submitting: " + query);
    setError(null);
    setIsLoading(true);
    fetch(`http://localhost:8000/query_database_api?query=${query}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with a ${res.status} status`);
        }
        return res.json();
      })
      .then(onResult)
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  const onGenerate = () => {
    console.log("Generating: " + query);
    setError(null);
    setIsLoading(true);
    fetch(`http://localhost:8000/ask_gpt_api?prompt=${query}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with a ${res.status} status`);
        }
        return res.json();
      })
      .then(onQuery)
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setIsLoading(false);
        setIsSql(true);
      });
  }

  const onResult = (data: any) => {
    console.log(data);
    setResult(data);
    setHasResult(true);
    setIsLoading(false);
  };
  
  const onQuery = (data: any) => {
    console.log(data);
    setQuery(data);
    setIsLoading(false);
  }
  let resultsElement = null;
  let formElement = null;

  if (isSql) {
    formElement = (<QueryForm query={query} setQuery={setQuery} onSubmit={onSubmit} isLoading={isLoading} error={error} />);
  } else{
    formElement = (<GenerateForm query={query} setQuery={setQuery} onGenerate={onGenerate} isLoading={isLoading} error={error} />);
  } 

  if (hasResult && result.length > 0) {
    resultsElement = (<Results result={result} />);
    adjust = "flex h-screen"
  }
  
  return (
    <>
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
    </>
  );
};

export default Landing;