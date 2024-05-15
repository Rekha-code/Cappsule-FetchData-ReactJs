// src/SearchScreen.jsx
import React, { useState } from "react";
import axios from "axios";
import "./SearchScreen.css";
import { AiOutlineSearch } from "react-icons/ai";

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedStrength, setSelectedStrength] = useState(null);
  const [selectedPacking, setSelectedPacking] = useState(null);
  const [prices, setPrices] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://backend.cappsule.co.in/api/v1/new_search`,
        {
          params: {
            q: searchTerm,
            pharmacyIds: "1,2,3",
          },
        }
      );
      setData(response.data.data.saltSuggestions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFormSelect = (form) => {
    setSelectedForm(form);
    setSelectedStrength(null);
    setSelectedPacking(null);
    setPrices([]);
  };

  const handleStrengthSelect = (strength) => {
    setSelectedStrength(strength);
    setSelectedPacking(null);
    setPrices([]);
  };

  const handlePackingSelect = (packing) => {
    setSelectedPacking(packing);
    const selectedProduct = data.find(
      (item) => item.salt_forms_json[selectedForm][selectedStrength][packing]
    );
    const productIds = selectedProduct
      ? selectedProduct.salt_forms_json[selectedForm][selectedStrength][packing]
      : null;
    if (productIds) {
      let allPrices = [];
      Object.keys(productIds).forEach((productId) => {
        if (productIds[productId]) {
          allPrices = allPrices.concat(productIds[productId]);
        }
      });
      const lowestPrices = allPrices.map(
        (priceData) => priceData.selling_price
      );
      setPrices(lowestPrices);
    } else {
      setPrices([]);
    }
  };

  const renderForms = () => {
    if (!data.length) return null;
    const forms = data.reduce((acc, item) => {
      return [...acc, ...item.available_forms];
    }, []);
    return (
      <div className="container">
        <h4>Form:</h4>
        <div className="grid-container">
          {Array.from(new Set(forms)).map((form) => (
            <button
              key={form}
              onClick={() => handleFormSelect(form)}
              className={selectedForm === form ? "selected" : ""}
            >
              {form}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderStrengths = () => {
    if (!selectedForm) return null;
    const strengths = data.reduce((acc, item) => {
      return [...acc, ...Object.keys(item.salt_forms_json[selectedForm] || {})];
    }, []);
    return (
      <div className="container">
        <h4>Strength:</h4>
        <div className="grid-container">
          {Array.from(new Set(strengths)).map((strength) => (
            <button
              key={strength}
              onClick={() => handleStrengthSelect(strength)}
              className={selectedStrength === strength ? "selected" : ""}
            >
              {strength}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPackings = () => {
    if (!selectedStrength) return null;
    const packings = data.reduce((acc, item) => {
      return [
        ...acc,
        ...Object.keys(
          item.salt_forms_json[selectedForm][selectedStrength] || {}
        ),
      ];
    }, []);
    return (
      <div className="container">
        <h4>Packing:</h4>
        <div className="grid-container">
          {Array.from(new Set(packings)).map((packing) => (
            <button
              key={packing}
              onClick={() => handlePackingSelect(packing)}
              className={selectedPacking === packing ? "selected" : ""}
            >
              {packing}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="search-bar-container">
        <div className="searchbar-input">
          <AiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Type your medicine name here..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </div>
      <hr />
      {renderForms()}

      {selectedForm && renderStrengths()}

      {selectedStrength && renderPackings()}

      {selectedPacking && (
        <div className="container">
          <h3>Prices:</h3>
          {prices.length > 0 ? (
            <p>From {Math.min(...prices)}</p>
          ) : (
            <button className="sell-btn">
              No stores selling this
              <br /> product near you
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchScreen;
