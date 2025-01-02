from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from query_modules import query_database, show_tables
from ai_modules import ask_gpt, get_table_information

app = FastAPI()

# Middleware to function on local network
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints for python functions
# Quick and dirty nothing special
@app.get("/query_database_api", response_model=list)
async def query_database_api(query : str):
    result = query_database(query)
    return result

@app.get("/download_csv_api")
async def download_csv_api():
    csv_file_path = "../output.xlsx"
    return FileResponse(
        path=csv_file_path,
        media_type="text/xlsx",
        filename="your_file.xlsx"  
    )

# From my understanding I can stream the response from here 
@app.get("/show_tables_api", response_model=list)
async def show_tables_api():
    tables = show_tables()
    return tables

@app.get("/ask_gpt_api", response_model=str)
async def ask_gpt_api(prompt : str):
    result = ask_gpt(prompt)
    return result

@app.get("/get_table_information_api", response_model=str)
async def get_table_information_api(database : str):
    result = get_table_information(database)
    return result

@app.get("/show_tables_api", response_model=list)
async def show_tables_api():
    return show_tables()