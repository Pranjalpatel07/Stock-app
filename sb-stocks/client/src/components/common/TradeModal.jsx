import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { buyStock, sellStock } from '../../redux/slices/tradeSlice';
import { fetchPortfolio } from '../../redux/slices/portfolioSlice';
import { formatCurrency } from '../../utils/helpers';
import Spinner from './Spinner';

export default function TradeModal({ stock, mode, onClose }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.trade);
  const { user } = useSelector((state) => state.auth);
  const { holdings } = useSelector((state) => state.portfolio);

  const [quantity, setQuantity] = useState(1);

  const price = stock?.price || 0;
  const totalCost = (price * quantity).toFixed(2);
  const availableShares = holdings.find((h) => h.symbol === stock?.symbol)?.quantity || 0;

  const handleTrade = async () => {
    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    const tradeData = { symbol: stock.symbol, quantity: Number(quantity), price };

    if (mode === 'BUY') {
      if (user.balance < totalCost) {
        toast.error('Insufficient balance');
        return;
      }
      const result = await dispatch(buyStock(tradeData));
      if (!result.error) {
        toast.success(`✅ Bought ${quantity} shares of ${stock.symbol}!`);
        dispatch(fetchPortfolio());
        onClose();
      } else {
        toast.error(result.payload);
      }
    } else {
      if (quantity > availableShares) {
        toast.error(`You only own ${availableShares} shares`);
        return;
      }
      const result = await dispatch(sellStock(tradeData));
      if (!result.error) {
        toast.success(`✅ Sold ${quantity} shares of ${stock.symbol}!`);
        dispatch(fetchPortfolio());
        onClose();
      } else {
        toast.error(result.payload);
      }
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isBuy = mode === 'BUY';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-dark-border animate-fade-in">
        {/* Header */}
        <div className={`p-6 rounded-t-2xl border-b border-gray-100 dark:border-dark-border ${isBuy ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isBuy ? '🟢 Buy' : '🔴 Sell'} {stock?.symbol}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Market Price: <span className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(price)}</span>
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none">
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Your Balance</p>
              <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(user?.balance || 0)}</p>
            </div>
            {!isBuy && (
              <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">You Own</p>
                <p className="font-semibold text-gray-900 dark:text-white">{availableShares} shares</p>
              </div>
            )}
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-border font-bold text-lg transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={!isBuy ? availableShares : undefined}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="input-field text-center text-lg font-semibold"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-border font-bold text-lg transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className={`rounded-xl p-4 ${isBuy ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30'}`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {isBuy ? 'Total Cost' : 'Total Value'}
              </span>
              <span className={`text-xl font-bold ${isBuy ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {formatCurrency(parseFloat(totalCost))}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {quantity} × {formatCurrency(price)}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleTrade}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all ${
              isBuy
                ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
                : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
            } disabled:cursor-not-allowed`}
          >
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <>
                {isBuy ? '🟢' : '🔴'}
                {isBuy ? 'Confirm Buy' : 'Confirm Sell'}
              </>
            )}
          </button>
          <button onClick={onClose} className="w-full py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
