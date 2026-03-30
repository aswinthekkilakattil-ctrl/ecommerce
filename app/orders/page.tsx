'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type OrderItem = {
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  total: number;
  status: string;
  address: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        throw new Error('Failed to fetch orders');
      }
      
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function cancelOrder(orderId: string) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel order');
      }
      fetchOrders();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div className="page" style={{ maxWidth: '800px', margin: '4rem auto' }}>
      <div className="error">{error}</div>
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1rem' }}>
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '1.5rem' }}>
        <h1 className="section-title" style={{ fontSize: '2.5rem', margin: 0 }}>Order History</h1>
        <p className="section-copy" style={{ marginTop: '0.5rem' }}>Manage your recent purchases and active shipments.</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 1rem' }}>No orders yet</h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>You haven't placed any orders. Start exploring our premium collection.</p>
          <Link href="/products" className="button">Browse Products</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ border: '1px solid rgba(0,0,0,0.06)', padding: '2.5rem', borderRadius: '24px', background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.01em' }}>Order #{order._id.substring(0, 8)}</h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>Delivering to: <strong style={{ color: '#111827' }}>{order.address}</strong></p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                  <span style={{ 
                    fontWeight: '700', 
                    padding: '0.4rem 1.2rem', 
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    background: order.status === 'cancelled' ? '#fef2f2' : order.status === 'pending' ? '#fffbeb' : '#f0fdf4',
                    color: order.status === 'cancelled' ? '#dc2626' : order.status === 'pending' ? '#d97706' : '#16a34a',
                    border: `1px solid ${order.status === 'cancelled' ? '#fecaca' : order.status === 'pending' ? '#fde68a' : '#bbf7d0'}`
                  }}>
                    {order.status}
                  </span>
                  
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => cancelOrder(order._id)}
                      style={{ 
                        background: 'transparent', 
                        color: '#ef4444', 
                        padding: '0.5rem 1rem', 
                        border: '1px solid rgba(239, 68, 68, 0.3)', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.borderColor = '#ef4444';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Items Summary</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '500', color: '#111827' }}>
                        <span style={{ background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#4b5563', fontWeight: '700' }}>{item.quantity}</span>
                        {item.productId?.name || 'Unknown Product'}
                      </span>
                      <span style={{ fontWeight: '600', color: '#111827', fontSize: '1.05rem' }}>${((item.productId?.price || item.price) * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ color: '#6b7280', fontWeight: '500', fontSize: '1.1rem' }}>Total</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em' }}>${order.total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
