import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import SearchScreen from "./components/SearchScreen";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <div className="App">
        <SearchScreen />
        <Footer />
      </div>
    </>
  );
}

export default App;
