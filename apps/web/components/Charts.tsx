"use client";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const RED = "#d20a0a";
const COLORS = [RED, "#ffffff", "#71717a", "#3f3f46"];
const tip = { contentStyle: { background: "#09090b", border: "1px solid #3f3f46" }, labelStyle: { color: "#fff" } };
const axis = { stroke: "#a1a1aa", fontSize: 12 };

export function Donut({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} stroke="#000">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip {...tip} /><Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function Bars({ data, x, y, name, height = 260 }: { data: Record<string, string | number>[]; x: string; y: string; name: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid stroke="#27272a" vertical={false} />
        <XAxis dataKey={x} {...axis} /><YAxis {...axis} />
        <Tooltip {...tip} cursor={{ fill: "#18181b" }} />
        <Bar dataKey={y} name={name} fill={RED} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Factors({ data }: { data: { name: string; v: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid stroke="#27272a" horizontal={false} />
        <XAxis type="number" {...axis} />
        <YAxis type="category" dataKey="name" width={170} {...axis} />
        <Tooltip {...tip} formatter={(v: number) => v.toFixed(3)} />
        <Bar dataKey="v" name="Contribución (+ favorece al peleador A)">
          {data.map((d, i) => <Cell key={i} fill={d.v >= 0 ? RED : "#ffffff"} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Calibration({ bins }: { bins: number[][] }) {
  const data = bins.map(([p, o, n]) => ({ predicted: p, observed: o, n }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid stroke="#27272a" />
        <XAxis dataKey="predicted" domain={[0, 1]} type="number" {...axis} />
        <YAxis domain={[0, 1]} {...axis} />
        <Tooltip {...tip} />
        <Line dataKey="predicted" name="Ideal" stroke="#71717a" strokeDasharray="4 4" dot={false} />
        <Line dataKey="observed" name="Observado" stroke={RED} strokeWidth={3} />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}
