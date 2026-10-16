"use client";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { calibration, importance, methodsData, trendData, weightClassData } from "@/lib/mock";

const COLORS = ["#f5b942", "#ef4444", "#3b82f6", "#64748b"];
const tip = { contentStyle: { background: "#141821", border: "1px solid #232938", borderRadius: 8 } };
const axis = { stroke: "#64748b", fontSize: 12 };

export function MethodsPie() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={methodsData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {methodsData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip {...tip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function WeightBars() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={weightClassData}>
        <CartesianGrid stroke="#232938" vertical={false} />
        <XAxis dataKey="name" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tip} />
        <Bar dataKey="fights" name="Combates" fill="#f5b942" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLine() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={trendData}>
        <CartesianGrid stroke="#232938" vertical={false} />
        <XAxis dataKey="year" {...axis} />
        <YAxis domain={[0.5, 0.75]} {...axis} />
        <Tooltip {...tip} />
        <Line dataKey="acc" name="Accuracy" stroke="#3b82f6" strokeWidth={2} dot />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CalibrationChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={calibration}>
        <CartesianGrid stroke="#232938" />
        <XAxis dataKey="predicted" {...axis} domain={[0, 1]} />
        <YAxis domain={[0, 1]} {...axis} />
        <Tooltip {...tip} />
        <Line dataKey="predicted" name="Ideal" stroke="#64748b" strokeDasharray="4 4" dot={false} />
        <Line dataKey="observed" name="Observado" stroke="#f5b942" strokeWidth={2} />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ImportanceBars() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={importance} layout="vertical" margin={{ left: 40 }}>
        <CartesianGrid stroke="#232938" horizontal={false} />
        <XAxis type="number" {...axis} />
        <YAxis type="category" dataKey="feature" width={150} {...axis} />
        <Tooltip {...tip} />
        <Bar dataKey="value" name="Importancia" fill="#3b82f6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function FactorBars({ data }: { data: { name: string; v: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
        <CartesianGrid stroke="#232938" horizontal={false} />
        <XAxis type="number" {...axis} />
        <YAxis type="category" dataKey="name" width={70} {...axis} />
        <Tooltip {...tip} formatter={(v: number) => v.toFixed(2)} />
        <Bar dataKey="v" name="Contribución (+ favorece al rojo)">
          {data.map((d, i) => <Cell key={i} fill={d.v >= 0 ? "#ef4444" : "#3b82f6"} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
