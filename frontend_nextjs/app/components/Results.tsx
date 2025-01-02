import Table from './Table';

interface ResultsProps {
    result: any;
}

const Results: React.FC<ResultsProps> = (props) => {
    return (
        <div className="resize max-w-md m-auto p-2">
        <div className="bg-gray-200 p-6 rounded-md text-black">
          <p className="text-xl">Here are your results:</p>
          <Table data={props.result} />
          <div className="bg-gray-300 rounded-sm p-0.5 w-20 text-center">
            <a href="http://localhost:8000/download_csv_api" download="brother.xlsx">
              Download
            </a>
          </div>
        </div>
      </div>
    );
};

export default Results;