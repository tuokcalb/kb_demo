from google.cloud import bigquery
from openai import OpenAI
import os

# Queries database 
# Takes user query and returns dataframe 
# in form of dict; Also dumps table into execl file
def query_database(query):
    client = bigquery.Client(project='ethereal-orb-445410-r4')
    query_job = client.query(query)  

    results_df = query_job.result().to_dataframe()
    results_df.to_excel("output.xlsx") 

    return results_df.to_dict(orient='records')

# Provides a list of all public databases hosted on big 
# query; Slow needs to be streamed ???how though
def show_tables():
    client = bigquery.Client(project='ethereal-orb-445410-r4')
    public_project = "bigquery-public-data"
    datasets = client.list_datasets(public_project)
    id_list = list()

    for data in datasets:
        id_list.append(data.dataset_id)

    return id_list

# Replaces natural language query with SQL query with GPT
# takes words as input and returns an SQL query to 
# be used with query_database(query)
def ask_gpt(prompt):
    client = OpenAI(api_key="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")

    # Prompt Could be fixed 
    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful Big Query assistant. "
                "The user will provide a request about a public dataset, "
                "and you will return a valid SQL query that retrieves the request. "
                "Only one provide the SQL query, nothing else."
            )
        },
        {
            "role": "user",
            "content": prompt
        }
    ]

    try:
        response = client.chat.completions.create(model="gpt-3.5-turbo",  
        messages=messages,
        temperature=0.0,       
        max_tokens=256)

        sql_query = response.choices[0].message.content.strip('`')
        return sql_query[3:].strip()

    except Exception as e:
        print(f"Error occurred while fetching SQL from ChatGPT: {e}")
        return ""

# Gets description of database on big query but not really
# database id provided to GPT and GPT response sent back
def get_table_information(database):
    client = OpenAI(api_key="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")

    # Prompt works well enought 
    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful Big Query assistant. "
                "The user will provide a name of a public database on google big query servers, "
                "and you will explain the database and what it contains. "
            )
        },
        {
            "role": "user",
            "content": database
        }
    ]

    try:
        response = client.chat.completions.create(model="gpt-3.5-turbo",  
        messages=messages,
        temperature=0.0,       
        max_tokens=256)

        # Some cleanup useful but functions for demonstration
        sql_query = response.choices[0].message.content.strip('`')
        return sql_query[3:].strip()

    except Exception as e:
        print(f"Error occurred while fetching SQL from ChatGPT: {e}")
        return ""