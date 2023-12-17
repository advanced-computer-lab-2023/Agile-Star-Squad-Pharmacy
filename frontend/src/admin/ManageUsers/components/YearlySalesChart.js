import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLegend, VictoryLine } from 'victory';

const YearlySalesChart = ({ currentYearSales, prevYearSales }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const yAxisTicks = [0, 50000, 100000, 150000, 200000, 250000];
  const barWidth = 15; // Adjust the bar width
  const barOffset = 4; // Adjust the offset between the bars

  // Function to transform data to match VictoryBar expectations
  const transformData = (yearSales, offset) => {
    return yearSales.map((value, index) => ({ x: index * (barWidth + barOffset) + offset, y: value }));
  };

  return (
    <VictoryChart domainPadding={40} width={900}>
      {/* X-axis (months of the year) */}
      <VictoryAxis
        tickValues={currentYearSales.map((_, index) => index * (barWidth + barOffset))}
        tickFormat={(tick) => monthNames[tick / (barWidth + barOffset)]}
        style={{
          color: "grey",
          axis: { stroke: 'none' }, // Remove X-axis line
          tickLabels: { padding: 5 },
        }}
      />

     

      
      {/* Bar chart for this year's revenue */}
      <VictoryBar
        data={transformData(currentYearSales, 0)}
        barWidth={barWidth}
        cornerRadius={{ top: 3, bottom: 3 }}
        style={{
          data: { fill: '#FF7A00' },
        }}
      />

      {/* Bar chart for last year's revenue */}
      <VictoryBar
        data={transformData(prevYearSales, barOffset)}
        barWidth={barWidth}
        cornerRadius={{ top: 3, bottom: 3 }}
        style={{
          data: { fill: '#32383F' },
        }}
      />

      
    </VictoryChart>
  );
};

export default YearlySalesChart;
