import { useEffect } from 'react';
import ReactToolTip from 'react-tooltip';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
function AdviserDetails({ hits }) {
  const firstHit = hits[0]._source;
  const name = firstHit.name;
  const summary = {
    first_provided_advice: firstHit.first_provided_advice,
    name,
    number: firstHit.number,
    abn: firstHit.abn
  };
  const datasets = hits.reduce((acc, cur) => {
    acc.push(cur._source);
    return acc;
  }, []);
  datasets.sort((a, b) => {
    if (moment(a.start_date, 'DD-MM-YYYY').isAfter(moment(b.start_date, 'DD-MM-YYYY'))) {
      return 1;
    } else {
      return -1;
    }
  })
  let chartData = [], currentDatasets = [], ceasedDatasets = [];
  datasets.forEach((dataset, index) => {
    if (dataset.status !== 'Current') {
      ceasedDatasets.push(dataset);
      chartData.push({
        label: `dataset-${index}`,
        data: [{
          x: dataset.start_date,
          y: 1
        }, {
          x: dataset.end_date,
          y: 1
        }],
        borderColor: "gray"
      });
    } else {
      currentDatasets.push(dataset);
      chartData.push({
        label: `dataset-${index}`,
        data: [{
          x: dataset.start_date,
          y: 2
        }, {
          x: moment().format('DD/MM/YYYY'),
          y: 2
        }],
        borderColor: "blue",
      });
    }
  });
  let currentAppointment, ceasedAppointment, current = false;
  if (currentDatasets.length <= 0) {
    currentAppointment = <p className="text-xl">Not currently appointed as an adviser.</p>;
  } else {
    current = true;
    currentAppointment = currentDatasets.map(dataset => {
      return <div className="border mb-2">
        <p className="bg-blue-600 text-white pl-2 text-xl py-2">{dataset.start_date} - ongoing</p>
        <div className="flex justify-between p-2">
          <div className="w-1/2">
            <p className="text-blue-600">Appointment type <span className="bg-blue-700 text-white inline-block w-6 h-6 text-center rounded-full font-light cursor-pointer" data-effect="solid" data-multiline="true" data-tip="A financial adviser is authorised to <br> advise retail clients. A provisional <br> adviser must be supervised by a <br> financial adviser. A time-share <br> adviser may advise about time-<br>share investments only.">?</span></p>
            <p>Financial Adviser</p>
          </div>
          <div className="w-1/2">
            <p>Principal place of business </p>
            <p>Lvl 17
120 COLLINS St
MELBOURNE VIC 3000</p>
          </div>
        </div>
        <p>{dataset.licence_name}(licence holder)</p>
        <p className="table-row"><span className="table-cell font-bold pr-4">Number:</span><a title="Licensee details on ASIC Connect" href={`https://connectonline.asic.gov.au/RegistrySearch/faces/landing/panelSearch.jspx?searchNumber=${dataset.licence_number}&searchType=PRAFSLicsee&searchName=`} target="_blank" rel="noopener noreferrer" className="underline">{dataset.licence_number}</a></p>
        <p className="table-row"><span className="table-cell font-bold pr-4">ABN:</span><a title="ABN details on Australian Business Register" href={`http://abr.business.gov.au/SearchByAbn.aspx?abn=${dataset.licence_abn}`} target="_blank" rel="noopener noreferrer" className="underline">{dataset.licence_abn}</a></p>
        <p className="table-row"><span className="table-cell font-bold pr-4">Controlled by: <span className="bg-blue-700 text-white inline-block w-6 h-6 text-center rounded-full font-light cursor-pointer" data-effect="solid" data-multiline="true" data-tip="The company(ies) or people who <br> control the licensee's business. <br> They can sometimes be a <br> majority shareholder or able to <br> control votes at meetings or <br> board composition.">?</span></span>{dataset.licence_controlled_by ? dataset.licence_controlled_by : '-'}</p>
      </div>;
    })
  }

  if (ceasedDatasets.length <= 0) {
    ceasedAppointment = <p className="text-xl">No history recorded.</p>;
  } else {
    ceasedAppointment = ceasedDatasets.map(dataset => {
      return <div>
        <p>{dataset.start_date} - {dataset.end_date}</p>
        <div className="flex justify-between">
          <div className="w-48">
            <p>Appointment type</p>
            <p>Financial Adviser</p>
          </div>
          <div className="w-48">
            <p>Principal place of business</p>
            <p>Lvl 17
120 COLLINS St
MELBOURNE VIC 3000</p>
          </div>
        </div>
        <p>{dataset.licence_name}(licence holder)</p>
        <p className="table-row"><span className="table-cell font-bold pr-4">Number:</span><a title="Licensee details on ASIC Connect" href={`https://connectonline.asic.gov.au/RegistrySearch/faces/landing/panelSearch.jspx?searchNumber=${dataset.licence_number}&searchType=PRAFSLicsee&searchName=`} target="_blank" rel="noopener noreferrer" className="underline">{dataset.licence_number}</a></p>
        <p className="table-row"><span className="table-cell font-bold pr-4">ABN:</span><a title="ABN details on Australian Business Register" href={`http://abr.business.gov.au/SearchByAbn.aspx?abn=${dataset.licence_abn}`} target="_blank" rel="noopener noreferrer" className="underline">{dataset.licence_abn}</a></p>
        <p className="table-row"><span className="table-cell font-bold pr-4">Controlled by: <span className="bg-blue-700 text-white inline-block w-6 h-6 text-center rounded-full font-light cursor-pointer" data-effect="solid" data-multiline="true" data-tip="The company(ies) or people who <br> control the licensee's business. <br> They can sometimes be a <br> majority shareholder or able to <br> control votes at meetings or <br> board composition.">?</span></span>{dataset.licence_controlled_by ? dataset.licence_controlled_by : '-'}</p>
      </div>;
    })
  }


  const data = {
    datasets: chartData
  };
  const options = {
    elements: {
      line: {
        fill: false,
        borderWidth: 6
      },
    },
    tooltips: {
      callbacks: {
        beforeLabel: function (tooltipItem, data) {
          return "";
        },
        label: function (tooltipItem, data) {
          return "";
        },
        title: function (tooltipItem, data) {
          if (tooltipItem[0]['label'] === moment().format('DD/MM/YYYY')) {
            return "Current";
          }
          return tooltipItem[0]['label'];
        },
      }
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'year',
          displayFormats: {
            year: 'YYYY'
          },
          parser: 'DD/MM/YYYY'
        },
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        ticks: {
            callback: function(value, index, values) {
                if (value === 1) {
                  return "Previous";
                }
                if (value === 2 && current) {
                  return "Current";
                }
                return "";
            }
        },
        gridLines: {
          display: false
        }
      }]
    }
  };

  useEffect(() => {
    ReactToolTip.rebuild();
  });
  return (
    <div>
      <p className="py-4 text-3xl bg-blue-600 text-white pl-4">Details: {name}</p>
      <div className="p-4">
        <p className="text-3xl font-light">Summary</p>
        <div className="p-2 border flex flex-col md:flex-row-reverse mb-4">
          <div>
            <p className="font-bold">Status:</p>
            <p className={`text-3xl md:text-5xl pl-4 md:pl-0 ${current ? 'text-blue-600' : 'text-gray-600'}`}>{current ? 'Current' : 'Ceased'}</p>
          </div>
          <div className="flex-grow">
            <p className="table-row"><span className="table-cell font-bold pr-4">First provided advice:</span>{summary.first_provided_advice}</p>
            <p className="table-row"><span className="table-cell font-bold pr-4">Name:</span>{summary.name}</p>
            <p className="table-row"><span className="table-cell font-bold pr-4">Number: <span className="bg-blue-700 text-white inline-block w-6 h-6 text-center rounded-full font-light cursor-pointer" data-effect="solid" data-multiline="true" data-tip="Financial adviser/authorised <br> representative number <br> given by ASIC.">?</span></span>{summary.number}</p>
            <p className="table-row"><span className="table-cell font-bold pr-4">ABN:</span>{summary.abn ? summary.abn : '-'}</p>
          </div>
        </div>
        <p className="text-3xl font-light">Appointment timeline</p>
        <p className="text-sm italic font-extralight">Summary of financial adviser's appointments. See below for further details.</p>
        <div className="p-2 border mb-4">
          <Line data={data} options={options} height={80} />
        </div>
        <p className="text-3xl font-light">Current appointment(s)</p>
        <p className="text-sm italic font-extralight">Financial adviser's current appointment details, including product areas the financial adviser can provide advice on.</p>
        <p className="text-sm italic font-extralight">For business name details, click on the Australian Business Register (ABN).</p>
        <div className="mb-4">
          {currentAppointment}
        </div>
        <p className="text-3xl font-light">Previous appointment(s)</p>
        <p className="text-sm italic font-extralight">This section provides the financial adviser's appointment history back to March 2010.</p>
        <p className="text-sm italic font-extralight">For business name details, click on the ABN to go to the Australian business register and view any related business names.</p>
        <div className="p-2 border mb-4">
          {ceasedAppointment}
        </div>
      </div>
    </div>
  )
}

export default AdviserDetails;