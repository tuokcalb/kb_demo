interface FormProps {
    query: any;
    setQuery: any;
    onSubmit: any;
    isLoading: any; 
    error: any;
}
const QueryForm: React.FC<FormProps> = (props) => {
  return (
    <div className="max-w-lg m-auto p-2 w-full">
        <div className="bg-gray-200 p-6 rounded-md text-black">
          <div>
            <textarea
              className = "bg-gray-100 rounded-md p-2 w-full"
              value={props.query}
              rows={1}
              onChange={(e) => props.setQuery(e.currentTarget.value)}
              style={{ color: 'black' }}
            />
          </div>
        </div>
        <button className="bg-gray-400 rounded-sm px-3 flex-1" onClick={props.onSubmit} disabled={props.isLoading}>Submit</button>
          {props.error && (
            <div style={{ color: 'red', marginTop: '1rem' }}>
              {props.error}
            </div>
          )}
          {props.isLoading && (
            <div style={{ color: 'black', marginTop: '1rem' }}>
              {'Loading...'}
            </div>
          )}
      </div>
    );
};

export default QueryForm;