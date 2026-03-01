import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div className="page-container">
        {children}
      </div>
    </div>
  );
}
