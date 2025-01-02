import Landing from "./components/Landing"
import ScrollableOptions from "./components/ScrollableOptions"

export default function Home() {
  return (
    <div className= "container">
      <Landing />
      <ScrollableOptions />

      <div className = "flex">
      <button className="bg-gray-400 rounded-lg px-3 m-auto">Spawn</button>
      </div>
      </div>
  );
}
