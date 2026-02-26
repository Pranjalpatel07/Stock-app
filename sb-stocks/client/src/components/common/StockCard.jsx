import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatPercent, getPnLColor } from '../../utils/helpers';

export default function StockCard({ stock }) {
  const navigate = useNavigate();
  const isPositive = parseFloat(stock.changePercent) >= 0;

  return (
    <div
      onClick={() => navigate(`/stocks/${stock.symbol}`)}
      className="card hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {stock.symbol}
            </span>
            {stock.isMock && (
              <span className="text-[10px] bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded font-medium">
                DEMO
              </span>
            )}
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${isPositive ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
          {isPositive ? '▲' : '▼'} {formatPercent(stock.changePercent)}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
            {formatCurrency(stock.price)}
          </p>
          <p className={`text-sm font-medium mt-0.5 ${getPnLColor(stock.change)}`}>
            {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
          </p>
        </div>
        <div className="text-right text-xs text-gray-400 dark:text-gray-500">
          <p>H: {formatCurrency(stock.high)}</p>
          <p>L: {formatCurrency(stock.low)}</p>
        </div>
      </div>
    </div>
  );
}
