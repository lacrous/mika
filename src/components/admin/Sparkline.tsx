import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface SparklineProps {
 data: number[];
 color?: string;
 height?: number;
}

export function Sparkline({ data, color = "#D4AF37", height = 40 }: SparklineProps) {
 const chartData = data.map((v, i) => ({ i, v }));
 return (
 <ResponsiveContainer width="100%" height={height}>
 <AreaChart data={chartData}>
 <defs>
 <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor={color} stopOpacity={0.3} />
 <stop offset="100%" stopColor={color} stopOpacity={0} />
 </linearGradient>
 </defs>
 <Area
 type="monotone"
 dataKey="v"
 stroke={color}
 strokeWidth={2}
 fill={`url(#spark-${color.replace("#", "")})`}
 dot={false}
 isAnimationActive={false}
 />
 </AreaChart>
 </ResponsiveContainer>
 );
}
