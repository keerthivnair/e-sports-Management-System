import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const Rankings = () => {
 let {id} = useParams();
 const region = id || "na";
  const [rankingsData, setRankingsData] = useState([]);

  async function fetchRankings() {
    console.log("fetching data");
    const url = `https://vlrggapi.vercel.app/rankings?region=${region}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      console.log(json);
      setRankingsData(json.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRankings();
  }, [region]);

  return (
    <div>
      {rankingsData.length <= 0 ? (
        <h1>Loading...</h1>
      ) : (
        rankingsData.map(({rank,team})=> (
          <h1>{team}</h1>
        ))
      )}
    </div>
  );
};

export default Rankings;
