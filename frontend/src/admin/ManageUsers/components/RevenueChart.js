import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryLegend, VictoryLine } from 'victory';

const RevenueChart = ({ currentWeekSales, prevWeekSales }) => {
    const yAxisTicks = [0, 5000, 10000, 15000, 20000, 25000];
  return (
    <VictoryChart domainPadding={40} width={600}>
      {/* X-axis (days of the week) */}
      <VictoryAxis
        tickValues={currentWeekSales.map((data) => data.day)}
        tickFormat={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']}
        style={{
            color: "var(--Primary-200, #7B91B0)",
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
        data={currentWeekSales}
        x={(d) => d.day - 0.3} // Adjust the x-value to shift the bar to the left
        y="totalSales"
        barWidth={13}
        cornerRadius={{ top: 3, bottom: 3 }}
        style={{
          data: { fill: '#0095FF' },
        }}
      />

      {/* Bar chart for last week's revenue */}
      <VictoryBar
        data={prevWeekSales}
        x="day"
        y="totalSales"
        barWidth={13}
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
