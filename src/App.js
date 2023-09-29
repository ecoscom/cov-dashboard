import './App.css';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Card from './SummaryCard';


function App() {

  const locationList = [
    { value: "AB", label: "Alberta" },
    { value: "BC", label: "British Columbia" },
    { value: "MB", label: "Manitoba" },
    { value: "NB", label: "New Brunswick" },
    { value: "NL", label: "Newfoundland and Labrador" },
    { value: "NT", label: "Northwest Territories" },
    { value: "NS", label: "Nova Scotia" },
    { value: "NU", label: "Nunavut" },
    { value: "ON", label: "Ontario" },
    { value: "PE", label: "Prince Edward Island" },
    { value: "QC", label: "Quebec" },
    { value: "SK", label: "Saskatchewan" },
    { value: "YT", label: "Yukon" },
  ];

  const [activeLocation, setActiveLocation] = useState("AB");
  const [lastUpdated, setLastUpdated] = useState("");
  const [summaryData, setSummaryData] = useState({})

  const baseUrl = "https://api.opencovid.ca";
  const getVersion = async () => {
    const res = await fetch(`${baseUrl}/version`);
    const data = await res.json();
    setLastUpdated(data.timeseries);
  }
  const getSummaryData = async (location) => {
    if (activeLocation === "canada") {
      return;
    }
    let res = await fetch(`${baseUrl}/summary?loc=${activeLocation}`);
    let resData = await res.json();
    let summaryData = resData.data[0];
    let formattedData = {};

    Object.keys(summaryData).map(
      (key) => (formattedData[key] = summaryData[key].toLocaleString())
    );
    console.log(formattedData);
    setSummaryData(formattedData);
  }

  

  useEffect(() => {
    getSummaryData();
    getVersion();
  }, [activeLocation]);

 

  return (
    <div className="App">
      <h1>Covid 19 Dashboard</h1>
      <div className='dashboard-container'>
        <div className='dashboard-menu'>
          <Select 
            options={locationList}
            onChange={(selectedOption) =>
              setActiveLocation(selectedOption.value)
            }
            defaultValue={locationList.filter(
              (options) => options.value === activeLocation
            )}
            className='dashboard-select'
          />
          <p className='update-date'>Last update: {lastUpdated}</p>
        </div>
        <div className='dashboard-summary'>
          <Card title="Total Cases" value={summaryData.cases} />
          <Card
              title="Total Tests"
              value={summaryData.tests_completed}
            />
            <Card title="Total Deaths" value={summaryData.deaths} />
            <Card
              title="Total Vaccinated"
              value={summaryData.vaccine_administration_total_doses}
            />
        </div>
      </div>
    </div>
  );
}

export default App;
