import { useEffect } from "react";
import ReactToolTip from "react-tooltip";
function AdviserDetails({ hits }) {
  const firstHit = hits[0]._source;
  const name = firstHit.name;
  const summary = {
    first_provided_advice: firstHit.first_provided_advice,
    name,
    number: firstHit.number,
    abn: firstHit.abn
  };
  const current = hits.some(hit => hit._source.status === 'Current');
  // const items = hits.map((hit, index) => {
  //   const source = hit._source;
  //   return (
  //     <li key={index}>
  //       {source.name} {source.start_date} {source.end_date}
  //     </li>
  //   );
  // })
  useEffect(() => {
    ReactToolTip.rebuild();
});
  return (
    <div>
      <p className="py-4 text-3xl bg-blue-600 text-white pl-4">Details: {name}</p>
      <div className="px-4 py-4">
        <p className="text-3xl font-light">Summary</p>
        <div className="p-2 border flex flex-col md:flex-row-reverse">
          <div>
            <p className="font-bold">Status:</p>
            <p className={`text-3xl md:text-5xl pl-4 md:pl-0 ${current ? 'text-blue-600' : 'text-blue-900'}`}>{current ? 'Current' : 'Ceased'}</p>
          </div>
          <div className="flex-grow">
            <p className="table-row"><span className="table-cell font-bold pr-4">First provided advice:</span>{summary.first_provided_advice}</p>
            <p className="table-row"><span className="table-cell font-bold pr-4">Name:</span>{summary.name}</p>
            <p className="table-row"><span className="table-cell font-bold pr-4">Number: <span className="bg-blue-700 text-white inline-block w-6 h-6 text-center rounded-full font-light" data-effect="solid" data-multiline="true"	 data-tip="Financial adviser/authorised <br> representative number <br> given by ASIC.">?</span></span>{summary.number}</p>
            <p className="table-row"><span className="table-cell font-bold pr-4">ABN:</span>{summary.abn ? summary.abn : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdviserDetails;