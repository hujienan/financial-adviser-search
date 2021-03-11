import { useEffect, useState } from "react";
import Result from './Result';
import { debounce } from 'lodash';
function Search() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const hostUrl = "http://localhost:8000/search";
  
  const handleSearch = debounce((e) => {
    const value = e.target.value.trim();
    setQuery(value)
    if (value === "") {
      setResult([]);
    }
  }, 100)

  useEffect(() => {
    async function search() {
      let url = `${hostUrl}?q=${query}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      const hits = data.body.hits.hits;
        const reducer = (acc, cur) => {
          let target = cur.inner_hits.status_sorted.hits.hits[0]._source;
          acc.push({
            "name": target.name,
            "number": target.number,
            "status": target.status 
          });
          return acc;
        };
        let records = hits.reduce(reducer, []);
        console.log(records);
        setResult(records)
    }
    if (query !== "") {
      search();
      // fetch(`${hostUrl}?q=${query}`)
      // .then(response => response.json())
      // .then(data => {
      //   console.log(data);
      //   const hits = data.body.hits.hits;
      //   const reducer = (acc, cur) => {
      //     let target = cur.inner_hits.status_sorted.hits.hits[0]._source;
      //     acc.push({
      //       "name": target.name,
      //       "number": target.number,
      //       "status": target.status 
      //     });
      //     return acc;
      //   };
      //   let records = hits.reduce(reducer, []);
      //   console.log(records);
      //   setResult(records)
      // }).catch(e => console.log(e));
    }
  }, [query]);

  return ( 
    <div>
      <h1 className="text-center uppercase m-8 text-2xl font-light">Financial adviser search</h1>
      <div className="text-center m-10 p-10 bg-gray-800">
        <input className="w-1/2 text-center bg-transparent text-xl border-b border-white text-white p-4 font-light" placeholder="Search here..." onChange={handleSearch} />
        { result.length > 0 && <Result records={result} /> }
      </div>
    </div>
  );
}

export default Search;