"use client";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
type OverviewGraphProps = {
  data: any[] | null ;
};
const OverviewGraph = ({ data }: OverviewGraphProps) => {
  if(!data) return null
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis
        dataKey="name"
        stroke="#888888"
        fontSize={12}
        tickLine={false}
        axisLine = {false} />
        <YAxis
        stroke="#888888"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value)=>`$${value}`}
        />
        <Bar dataKey="total" fill=" #ff80ff" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OverviewGraph;
