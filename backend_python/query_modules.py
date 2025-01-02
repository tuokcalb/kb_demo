from google.cloud import bigquery

# Queries database 
# Takes user query and returns dataframe 
# in form of dict; Also dumps table into execl file
def query_database(query):
    client = bigquery.Client(project='ethereal-orb-445410-r4')
    try:
        query_job = client.query(query)  

        results_df = query_job.result().to_dataframe()
        results_df.to_excel("output.xlsx") 

        return results_df.to_dict(orient='records') 
   
    except Exception as e:

        return { 'success': False, 'message': str(e) }
    
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
