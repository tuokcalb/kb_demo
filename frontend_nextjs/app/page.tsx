"use client"
import Landing from "./components/Landing"
import ScrollableOptions from "./components/ScrollableOptions"
import Styles from "./Home.module.css"
import './globals.css'
 
export default function Home() {
  return (
    <div className={Styles.container}>
      <Landing />
      <ScrollableOptions />

      <div className = "flex">
      <button className="bg-gray-400 rounded-lg px-3 m-auto">Spawn</button>
      </div>
      </div>
  );
}
