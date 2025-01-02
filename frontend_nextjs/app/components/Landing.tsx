"use client"
import React,{ ChangeEvent, useRef } from 'react'
import Results from './Results';
import QueryForm from './queryForm'
import GenerateForm from './generateForm'

const Landing: React.FC = () => {
  const [isSql, setIsSql] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [result, setResult] = React.useState<any[]>([]);
  const [hasResult, setHasResult] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
    pageColor = "bg-gray-300"
    formElement =  (<QueryForm query={query} setQuery={setQuery} onSubmit={onSubmit} isLoading={isLoading} error={error} />);
  } else{
    //pageColor = "bg-gray-600 min-h-screen w-screen"
    formElement = (<GenerateForm query={query} setQuery={setQuery} onGenerate={onGenerate} isLoading={isLoading} error={error} />);
  } 

  if (hasResult && result.length > 0) {
    resultsElement = (<Results result={result} />);
    adjust = "flex h-screen"
  }
  
  return (
    <>
    <div>
    {resultsElement}
    <p className="text-xl max-w-lg m-auto p-2">Type in query:</p>
    {formElement} 

    <div className="max-w-lg m-auto p-2 w-full">
    <label className="inline-flex items-center mb-5 cursor-pointer">
    <input
      type="checkbox"
      checked={isSql}
      onChange={handleToggle}
      className="sr-only peer"
    />
    <div
      className={`
        relative w-9 h-5 
        bg-gray-200 
        peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
        dark:peer-focus:ring-blue-800 
        rounded-full 
        peer 
        dark:bg-gray-300 
        after:content-[''] after:absolute after:top-[2px] after:end-[2px] 
        after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-4 after:w-4 after:transition-all 
        dark:border-gray-600 
        peer-checked:after:start-[2px] 
        peer-checked:after:end-auto 
        peer-checked:bg-gray-600
      `}
    ></div>
    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
      Natural Language Mode
    </span>
    </label>
    </div>
    </div>
    </>
  );
};

export default Landing;