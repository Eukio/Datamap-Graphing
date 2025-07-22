import { useEffect, useState} from 'react';
import React from 'react'
import EChartsComponent from './EChartsComponent';
import * as d3 from 'd3';


const filename: string = 'test.csv';


interface Data {
  name: string;
  values: Array<[timestamp: string, value: number]>;
}


interface PreformanceChartProps {
  selectedValues: Set<string>;
}


export function PreformanceChart({ selectedValues }: PreformanceChartProps) {
  const [chartOption, setChartOption] = useState({});
  const [dataSets, setDataSets] = useState<Data[]>([]);


  useEffect(() => {
    d3.csv(filename).then((loadedData: { columns: any[]; forEach: (arg0: (row: any) => void) => void; }) => {
      const columns = loadedData.columns.filter((col: string) =>
        selectedValues.has(col)
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
  }, [selectedValues]);


  useEffect(() => {
    if (dataSets.length === 0) return;
   
    setChartOption({
      animation: false,
      tooltip: { trigger: 'axis' },
      legend: {
          bottom:  '0px',
          orient:'horizontal',
         data: dataSets.map((d) => d.name)},
      grid: {
        left: '16px',
        right: '16px',
        bottom: '140px',
     
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
          bottom: '100px'
        }
      ],
      series: dataSets.map((obj, i) => ({
        name: obj.name,
        type: 'line',
        large: true,
        largeThreshold: 10000,
        data: obj.values,
        symbol: 'none',
        yAxisIndex: i%2
      }))
    });
  }, [dataSets]);


  return (
    <>
      <div>
        <EChartsComponent option={chartOption} />
      </div>
    </>
  );
}


export default PreformanceChart;



