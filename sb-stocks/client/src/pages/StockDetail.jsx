import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchStockDetail } from '../redux/slices/stockSlice';
import { fetchPortfolio } from '../redux/slices/portfolioSlice';
import { buyStock, sellStock } from '../redux/slices/tradeSlice';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import Spinner from '../components/common/Spinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PRODUCT_TYPES = ['Intraday', 'Delivery', 'CNC', 'MIS'];

export default function StockDetail() {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentStock: stock, historical, detailLoading } = useSelector((s) => s.stocks);
  const { holdings } = useSelector((s) => s.portfolio);
  const { loading: tradeLoading } = useSelector((s) => s.trade);
  const { user } = useSelector((s) => s.auth);

  const [mode, setMode] = useState('BUY'); // BUY or SELL
  const [productType, setProductType] = useState('Intraday');
  const [quantity, setQuantity] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    dispatch(fetchStockDetail(symbol));
    dispatch(fetchPortfolio());
  }, [dispatch, symbol]);

  // Draw candlestick chart manually on canvas
  useEffect(() => {
    if (!canvasRef.current || !historical || historical.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const data = historical.slice(-30);
    const prices = data.flatMap((d) => [d.high, d.low]);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const range = maxP - minP || 1;
    const pad = { top: 30, bottom: 40, left: 10, right: 55 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const candleW = Math.max(4, (chartW / data.length) * 0.6);
    const spacing = chartW / data.length;

    const toY = (p) => pad.top + chartH - ((p - minP) / range) * chartH;

    // Grid lines and Y-axis labels
    ctx.strokeStyle = '#e8ecf0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#8a96a3';
    ctx.font = '10px Poppins, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      const val = maxP - (range / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      ctx.fillText('$ ' + val.toFixed(5), W - 2, y + 4);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8a96a3';
    data.forEach((d, i) => {
      if (i % 5 === 0) {
        const x = pad.left + i * spacing + spacing / 2;
        const t = d.date ? d.date.slice(5) : `${String(8 + i).padStart(2,'0')}:00`;
        ctx.fillText(t, x, H - 5);
      }
    });

    // Candles
    data.forEach((d, i) => {
      const x = pad.left + i * spacing + spacing / 2;
      const isUp = d.close >= d.open;
      ctx.fillStyle = isUp ? '#28a745' : '#dc3545';
      ctx.strokeStyle = isUp ? '#28a745' : '#dc3545';
      ctx.lineWidth = 1;

      // Wick
      ctx.beginPath();
      ctx.moveTo(x, toY(d.high));
      ctx.lineTo(x, toY(d.low));
      ctx.stroke();

      // Body
      const openY = toY(d.open);
      const closeY = toY(d.close);
      const bodyTop = Math.min(openY, closeY);
      const bodyH = Math.max(1, Math.abs(openY - closeY));
      ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
    });

    // Crosshair price tooltip on hover
    canvas.__lastData = data;
    canvas.__toY = toY;
    canvas.__pad = pad;
    canvas.__spacing = spacing;
    canvas.__minP = minP; canvas.__maxP = maxP; canvas.__range = range;
    canvas.__chartH = chartH; canvas.__H = H;
  }, [historical]);

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.__lastData) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const { __lastData: data, __toY: toY, __pad: pad, __spacing: spacing } = canvas;
    const idx = Math.min(data.length - 1, Math.max(0, Math.floor((x - pad.left) / spacing)));
    const d = data[idx];
    if (d) {
      const ctx = canvas.getContext('2d');
      // Redraw to clear previous tooltip
      // (we just update tooltip state)
      setTooltip({ open: d.open, high: d.high, low: d.low, close: d.close, x: e.clientX - rect.left, y: 30 });
    }
  };

  const [tooltip, setTooltip] = useState(null);

  const price = stock?.price || 0;
  const totalPrice = quantity ? (parseFloat(quantity) * price).toFixed(2) : '0';

  const holding = holdings.find((h) => h.symbol === symbol?.toUpperCase());
  const ownedQty = holding?.quantity || 0;

  const handleTrade = async () => {
    if (!quantity || parseFloat(quantity) < 1) { toast.error('Enter valid quantity'); return; }
    const tradeData = { symbol: symbol.toUpperCase(), quantity: parseInt(quantity), price };
    if (mode === 'BUY') {
      const res = await dispatch(buyStock(tradeData));
      if (!res.error) {
        toast.success(`Bought ${quantity} shares of ${symbol}!`);
        dispatch(fetchPortfolio());
        setQuantity('');
      } else { toast.error(res.payload); }
    } else {
      if (parseInt(quantity) > ownedQty) { toast.error(`You only own ${ownedQty} shares`); return; }
      const res = await dispatch(sellStock(tradeData));
      if (!res.error) {
        toast.success(`Sold ${quantity} shares of ${symbol}!`);
        dispatch(fetchPortfolio());
        setQuantity('');
      } else { toast.error(res.payload); }
    }
  };

  if (detailLoading || !stock) return <Spinner />;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: '1rem', background: 'none', border: 'none', color: '#1a56a0', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif' }}
      >
        ← Back
      </button>
      <div className="chart-layout">
        {/* Chart Panel */}
        <div className="sb-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div className="chart-symbol-title">{symbol?.toUpperCase()} NASDAQ</div>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#8a96a3' }}>
              <span style={{ cursor: 'pointer' }}>⊕</span>
              <span style={{ cursor: 'pointer' }}>⊖</span>
              <span style={{ cursor: 'pointer' }}>⊘</span>
              <span style={{ cursor: 'pointer' }}>🔍</span>
              <span style={{ cursor: 'pointer' }}>↗</span>
              <span style={{ cursor: 'pointer' }}>☰</span>
            </div>
          </div>

          {/* Candlestick tooltip overlay */}
          <div style={{ position: 'relative' }}>
            <canvas
              ref={canvasRef}
              width={620}
              height={320}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={() => setTooltip(null)}
            />
            {tooltip && (
              <div style={{
                position: 'absolute', top: '30px', left: '60px',
                background: 'rgba(255,255,255,0.92)', border: '1px solid #e8ecf0',
                borderRadius: '4px', padding: '0.4rem 0.65rem',
                fontSize: '0.75rem', color: '#1c2e42', pointerEvents: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}>
                <div>Open: {parseFloat(tooltip.open).toFixed(2)}</div>
                <div>High: {parseFloat(tooltip.high).toFixed(2)}</div>
                <div>Low: {parseFloat(tooltip.low).toFixed(2)}</div>
                <div>Close: <strong>{parseFloat(tooltip.close).toFixed(2)}</strong></div>
              </div>
            )}
          </div>
        </div>

        {/* Trade Panel */}
        <div className="trade-panel">
          {/* Buy / Sell Price buttons */}
          <div className="bs-row">
            <button
              className="bs-buy"
              style={{ background: mode === 'BUY' ? '#1a56a0' : '#e3edf9', color: mode === 'BUY' ? '#fff' : '#1a56a0' }}
              onClick={() => setMode('BUY')}
            >
              Buy @ $ {price.toFixed(4)}
            </button>
            <button
              className="bs-sell"
              style={{ background: mode === 'SELL' ? '#dc3545' : '#fff', color: mode === 'SELL' ? '#fff' : '#1a56a0', borderColor: mode === 'SELL' ? '#dc3545' : '#1a56a0' }}
              onClick={() => setMode('SELL')}
            >
              Sell @ $ {price.toFixed(4)}
            </button>
          </div>

          <div className="trade-field">
            <label>Product type</label>
            <select
              className="sb-select"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              {PRODUCT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="trade-field">
            <label>Quantity</label>
            <input
              className="sb-input"
              type="number"
              min="1"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="trade-field">
            <label>Total price</label>
            <input
              className="sb-input"
              type="text"
              value={quantity ? `$ ${totalPrice}` : '0'}
              readOnly
              style={{ background: '#f8fafc', color: '#6b7a8d' }}
            />
          </div>

          {mode === 'SELL' && ownedQty > 0 && (
            <p style={{ fontSize: '0.78rem', color: '#6b7a8d', marginBottom: '0.75rem' }}>
              You own: <strong>{ownedQty} shares</strong>
            </p>
          )}

          <button
            className={mode === 'BUY' ? 'btn-green' : 'btn-red'}
            style={{ width: '100%', padding: '0.65rem' }}
            onClick={handleTrade}
            disabled={tradeLoading}
          >
            {tradeLoading ? 'Processing...' : mode === 'BUY' ? 'Buy now' : 'Sell now'}
          </button>
        </div>
      </div>
    </div>
  );
}
