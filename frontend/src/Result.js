import { debounce } from "lodash";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import AdviserDetails from "./AdviserDetails";

function Result({ records }) {
  const hostUrl = "http://localhost:8000/search-number";
  const [number, setNumber] = useState("");
  const [hits, setHits] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const handleSelect = debounce(number => {
    setNumber(number);
  }, 200);

  useEffect(() => {
    async function search() {
      let url = `${hostUrl}?number=${number}`;
      const response = await fetch(url);
      const data = await response.json();
      setHits(data.body.hits.hits);
      setIsOpen(true);
    }
    if (number !== "") {
      search();
    }
  }, [number])

  const closeModal = () => {
    setNumber("");
    setHits(null);
    setIsOpen(false);
  };
  const tableItems = records.map((record) =>
    <tr key={record.number} className="cursor-pointer hover:bg-gray-200" onClick={(e) => handleSelect(record.number)}>
      <td className="p-2 underline">{record.name}</td>
      <td className="p-2">{record.number}</td>
      <td className={`p-2 uppercase ${record.status === 'Current' ? "text-blue-700" : ""}`} >{record.status}</td>
    </tr>
  );
  return (
    <div className="overflow-auto">
      <table className="table-auto w-full bg-white my-10 ">
        <thead className="text-white bg-blue-600 text-xl">
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tableItems}
        </tbody>
      </table>
      <Modal modalIsOpen={modalIsOpen} closeModal={closeModal}>
        { hits && <AdviserDetails hits={hits} />}
      </Modal>
    </div>
  );
}

export default Result;