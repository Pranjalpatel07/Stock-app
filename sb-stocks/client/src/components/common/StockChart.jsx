import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StockChart({ historical, symbol }) {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  if (!historical || historical.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        No historical data available
      </div>
    );
  }

  const labels = historical.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const closes = historical.map((d) => d.close);
  const isPositive = closes[closes.length - 1] >= closes[0];

  const gradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, isPositive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    return gradient;
  };

  const data = {
    labels,
    datasets: [
      {
        label: symbol,
        data: closes,
        borderColor: isPositive ? '#22c55e' : '#ef4444',
        borderWidth: 2,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          return gradient(ctx);
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: isPositive ? '#22c55e' : '#ef4444',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        borderColor: isDark ? '#334155' : '#e5e7eb',
        borderWidth: 1,
        titleColor: isDark ? '#94a3b8' : '#6b7280',
        bodyColor: isDark ? '#f1f5f9' : '#111827',
        padding: 12,
        callbacks: {
          label: (ctx) => `$${ctx.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDark ? '#64748b' : '#9ca3af',
          maxTicksLimit: 8,
          font: { size: 11 },
        },
        border: { display: false },
      },
      y: {
        position: 'right',
        grid: {
          color: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.7)',
        },
        ticks: {
          color: isDark ? '#64748b' : '#9ca3af',
          font: { size: 11, family: 'JetBrains Mono' },
          callback: (val) => `$${val.toFixed(0)}`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="h-64 md:h-80">
      <Line data={data} options={options} />
    </div>
  );
}
