import React, { useState, useRef } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import Planet from "./Planet";
import City from "./City";
import Storage from "./Storage";


const App = (props) => {
  const refCity = useRef(null);
  const refPlanet = useRef(null);
  const refStorage = useRef(null);
  const [delLike, setDelLike] = useState(null);
  const [addOrDel, setAddorDel] = useState(null);

  window.onbeforeunload = function() {
    localStorage.clear();
 }
  

  document.body.style.overflow='hidden'

  const pageCity = () => {
    refCity.current?.scrollIntoView({ behavior: "smooth" });
    setAddorDel(false);
  };

  const pagePlanet = () => {
    refPlanet.current?.scrollIntoView({ behavior: "smooth" });
  };

  const pageStorage = () => {
    refStorage.current?.scrollIntoView({ behavior: "smooth" });
    setAddorDel(true);
  };

      return (
        <div className="container">
            <Planet GN={props.GN} pageCity={pageCity} refPlanet={refPlanet}/>
            <City refCity={refCity} pagePlanet={pagePlanet} pageStorage={pageStorage} globalName={props.globalName} delLike={delLike} setAddorDel={setAddorDel}/>
            <Storage refStorage={refStorage} pageCity={pageCity} globalName={props.globalName} setDelLike={setDelLike} addOrDel={addOrDel} setAddorDel={setAddorDel}/>
        </div>
      );

    };
export default App;