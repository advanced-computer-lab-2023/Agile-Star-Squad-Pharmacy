import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLegend, VictoryLine } from 'victory';

const RevenueChart = ({ currentWeekSales, prevWeekSales }) => {
  const yAxisTicks = [0, 5000, 10000, 15000, 20000, 25000];
  const barWidth = 10; // Adjust the bar width
  const barOffset = 2.5; // Adjust the offset between the bars

  // Function to transform data to match VictoryBar expectations
  const transformData = (weekSales, offset) => {
    return weekSales.map((value, index) => ({ x: index * (barWidth + barOffset) + offset, y: value }));
  };

  return (
    <VictoryChart domainPadding={40} width={600}>
      {/* X-axis (days of the week) */}
      <VictoryAxis
        tickValues={currentWeekSales.map((_, index) => index * (barWidth + barOffset))}
        tickFormat={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']}
        style={{
          color: "grey",
          axis: { stroke: 'none' }, // Remove X-axis line
          tickLabels: { padding: 5 },
        }}
      />

      {/* Y-axis (revenue) */}
      <VictoryAxis
        dependentAxis
        tickFormat={(x) => `$${x / 1000}k`}
        tickValues={[0, 5000, 10000, 15000, 20000, 25000]}
        style={{
          axis: { stroke: 'none' }, // Remove X-axis line
          tickLabels: { padding: 5 },
        }}
      />

      {/* Faint horizontal grid lines */}
      {yAxisTicks.map((tick) => (
        <VictoryLine
          key={tick}
          data={[{ x: 1, y: tick }]}
          style={{ data: { stroke: 'rgba(0, 0, 0, 0.1)', strokeWidth: 1 } }}
        />
      ))}

      {/* Bar chart for this week's revenue */}
      <VictoryBar
        data={transformData(currentWeekSales, 0)}
        barWidth={barWidth}
        cornerRadius={{ top: 3, bottom: 3 }}
        style={{
          data: { fill: '#0095FF' },
        }}
      />

      {/* Bar chart for last week's revenue */}
      <VictoryBar
        data={transformData(prevWeekSales, barOffset)}
        barWidth={barWidth}
        cornerRadius={{ top: 3, bottom: 3 }}
        style={{
          data: { fill: '#00E096' },
        }}
      />

      {/* Legend */}
      <VictoryLegend
        data={[
          { name: 'This Week', symbol: { fill: '#0095FF' } },
          { name: 'Previous Week', symbol: { fill: '#00E096' } },
        ]}
        x={250}
        y={280}
        orientation="horizontal"
      />
    </VictoryChart>
  );
};

export default RevenueChart;
