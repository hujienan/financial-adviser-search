import { useEffect } from 'react';
import ReactToolTip from 'react-tooltip';
import { Line, Bar } from 'react-chartjs-2';
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
  const current = datasets.some(dataset => dataset.status === 'Current');
  
  // const items = hits.map((hit, index) => {
  //   const source = hit._source;
  //   return (
  //     <li key={index}>
  //       {source.name} {source.start_date} {source.end_date}
  //     </li>
  //   );
  // })
  let chartData = [];

  datasets.forEach((dataset, index) => {
    if (dataset.status !== 'Current') {
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
  })



  useEffect(() => {
    ReactToolTip.rebuild();
  });
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
            // Include a dollar sign in the ticks
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

  return (
    <div>
      <p className="py-4 text-3xl bg-blue-600 text-white pl-4">Details: {name}</p>
      <div className="px-4 py-4">
        <p className="text-3xl font-light">Summary</p>
        <div className="p-2 border flex flex-col md:flex-row-reverse">
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
        <div className="p-2 border">
          <Line data={data} options={options} height={80} />
        </div>
      </div>
    </div>
  )
}

export default AdviserDetails;