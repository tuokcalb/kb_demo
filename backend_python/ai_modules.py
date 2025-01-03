from openai import OpenAI
import os
from key import OPEN_AI_KEY

client = OpenAI(api_key=OPEN_AI_KEY)

# Replaces natural language query with SQL query with GPT
# takes words as input and returns an SQL query to 
# be used with query_database(query)
def ask_gpt(prompt):
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
    # Prompt works well enough 
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