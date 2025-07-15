import { useEffect, useState, useTransition } from 'react';
import Graph from './components/Graph.tsx';
import './App.css';
import * as d3 from 'd3';


const filename: string = 'test.csv';

interface Data {
  name: string;
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
  const[isLoading, startTransition] = useTransition();



  useEffect(() => {
   
    d3.csv(filename).then((loadedData: { columns: any[]; forEach: (arg0: (row: any) => void) => void; }) => {
      const columns = loadedData.columns.filter((col: string) =>
        searchedValues.has(col)
      );

      const parsedData: Data[] = columns.map((name:string) => {
        const values: Array<[string, number]> = [];
      
        loadedData.forEach((row: { [x: string]: any; }) => {
          const timeStamp = row['record_time'];
          const yValue = row[name];
          if (timeStamp && yValue) {
            values.push([timeStamp, parseFloat(yValue)]);
          }
        });

        return {
          name,
          values
        };
      });
      setDataSets(parsedData);
    });

  }, []);



  useEffect(() => {
    if (dataSets.length === 0) return;
     startTransition(() =>{
    setChartOption({
      animation: false,
      tooltip: { trigger: 'axis' },
      legend: {
          bottom: 0,
          orient:'horizontal',
         data: dataSets.map((d) => d.name)},
      grid: {
        left: '10%',
        right: '10%',
        bottom: '30%',
        containLabel: true
      },
      toolbox: {
        feature: {
          dataZoom: { yAxisIndex: 'none' },
          saveAsImage: {}
        }
      },
      xAxis: { type: 'time' },
      yAxis: [
        { type: 'value',
           position: 'left',
           yAxisIndex: 0
        },
        { type: 'value',
           position: 'right',
           yAxisIndex: 1
        }
  ],
      dataZoom: [
        {
          type: 'slider',
          show: true,
          realtime: false,
          bottom:60
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
      });
  }, [dataSets]);


  return (
    <>
      <div>
        {isLoading && <p>Loading Graph...</p>}
        <Graph option={chartOption} />
      </div>
    </>
  );
}


export default App;

