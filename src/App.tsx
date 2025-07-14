import { useEffect, useState } from 'react';
import Graph from './components/Graph.tsx';
import './App.css';
import * as d3 from 'd3';


const filename: string = 'test.csv';


interface Data {
  name: string;
  type?: 'line';
  stack?: 'Total';
  values: Array<[timestamp: string, value: number]>;
}


const searchedValues: Set<string> = new Set([
  'ctOutdoorCoolRequestedDemand',
  'ctAHHeatRequestedDemand',
  'ctOutdoorHeatRequestedDemand',
  'ctIFCHeatRequestedDemandPercent',
  'ctIFCCoolRequestedDemandPercent',
  'ctOutdoorDeHumidificationRequestedDemand',
  'ctIFCHumRequestedDemandPercent'
]);


function App() {
  const [chartOption, setChartOption] = useState({});
  const [dataSets, setDataSets] = useState<Data[]>([]);


  useEffect(() => {
    d3.csv(filename).then((loadedData) => {
      const columns = loadedData.columns.filter((col) =>
        searchedValues.has(col)
      );


      const parsedData: Data[] = columns.map((name) => {
        const values: Array<[string, number]> = [];


        loadedData.forEach((row) => {
          const timeStamp = row['record_time'];
          const yValue = row[name];


          if (timeStamp && yValue) {
            values.push([timeStamp, parseFloat(yValue)]);
          }
        });


        return {
          name,
          type: 'line',
          stack: 'Total',
          values
        };
      });
      setDataSets(parsedData);
    });
  }, []);


  useEffect(() => {
    if (dataSets.length === 0) return;


    setChartOption({
      animation: false,
      tooltip: { trigger: 'axis' },
      legend: { data: dataSets.map((d) => d.name) },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          dataZoom: { yAxisIndex: 'none' },
          saveAsImage: {}
        }
      },
      xAxis: { type: 'time' },
      yAxis: { type: 'value', boundaryGap: [0, '100%'] },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          realtime: false
        }
      ],
      series: dataSets.map((obj) => ({
        name: obj.name,
        type: 'line',
        large: true,
        largeThreshold: 10000,
        data: obj.values,
        symbol: 'none'
      }))
    });
  }, [dataSets]);


  return (
    <>
      <div>
        <Graph option={chartOption} />
      </div>
    </>
  );
}


export default App;

