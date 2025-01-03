/**
 * isSql boolean 
 * handleToggle 
 */
interface ToggleProps {
    isSql: any;
    handleToggle: any;
}

/**
 * Toggle code: literally just a toggle to turn on generative mode for query box
 * Its just a whole bucket so seperate file it goes into
 * Boilerplater toggle ;)
 * @param props 
 * @returns 
 */
const Toggle: React.FC<ToggleProps> = (props) => {
    return (
    <div className="max-w-lg p-2 w-full">
        <label className="inline-flex items-center mb-5 cursor-pointer">
        <input
        type="checkbox"
        checked={props.isSql}
        onChange={props.handleToggle}
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
    );
};

export default Toggle;