'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    fetch('/api/products')
      .then(async (res) => {
        if (!res.ok) throw new Error('Unable to load products right now.');
        return res.json();
      })
      .then((data) => {
        setProducts(data.slice(0, 6)); 
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addToCart = (productId: string) => {
    if (!token) {
      setMessage({ text: 'Please log in to add items to your cart.', type: 'error' });
      setTimeout(() => setMessage(null), 3500);
      return;
    }

    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Could not add item to cart.');
        setMessage({ text: 'Added to cart successfully.', type: 'success' });
        setTimeout(() => setMessage(null), 3500);
      })
      .catch((err: Error) => {
        setMessage({ text: err.message, type: 'error' });
        setTimeout(() => setMessage(null), 3500);
      });
  };

  return (
    <div className="page">
      {/* Hero Section */}
      <section style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center', 
        padding: '8rem 2rem 10rem', 
        background: '#111827', 
        borderRadius: '32px', 
        marginBottom: '6rem',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
        
        <div style={{ zIndex: 1, position: 'relative', maxWidth: '850px' }}>
          <span className="eyebrow" style={{ color: '#818cf8', marginBottom: '2rem' }}>NEXT-GEN COMMERCE</span>
          <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: '800', margin: '0 0 2rem', lineHeight: '1', letterSpacing: '-0.04em' }}>
            Uncompromising <br/>
            <span style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(90deg, #818cf8, #c084fc)' }}>Quality.</span>
          </h1>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#9ca3af', marginBottom: '3.5rem', lineHeight: '1.6', maxWidth: '650px', margin: '0 auto 3.5rem', fontWeight: '400' }}>
            Discover our curated aesthetic collection. Tech and fashion essentials re-engineered for the modern professional.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center', gap: '1.25rem' }}>
            <Link href="#collection" className="button" style={{ 
              background: '#fff',
              color: '#000',
              padding: '1.2rem 3rem',
              fontSize: '1.1rem',
              boxShadow: '0 0 20px rgba(255,255,255,0.2)',
            }}>
              Explore the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Alert */}
      {message && (
        <div style={{ 
          position: 'fixed', 
          bottom: '2.5rem', 
          right: '2.5rem', 
          background: message.type === 'error' ? '#ef4444' : '#10b981', 
          color: 'white', 
          padding: '1.2rem 2rem', 
          borderRadius: '16px', 
          zIndex: 1000, 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          fontWeight: '600',
          fontSize: '1rem',
          animation: 'slideUp 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {message.text}
        </div>
      )}

      {/* Collection Section */}
      <section id="collection" style={{ marginTop: '0', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <span className="eyebrow" style={{ color: '#6366f1', marginBottom: '1rem' }}>Season 2026</span>
            <h2 style={{ margin: 0, fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#111827' }}>Featured Items</h2>
          </div>
          <Link href="/products" className="button-secondary" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: 'transparent' }}>
            View All
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '8rem 0' }}>
            <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '3px solid rgba(0,0,0,0.05)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s cubic-bezier(0.5, 0.1, 0.15, 1) infinite' }}></div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div className="product-grid" style={{ gap: '2.5rem' }}>
            {products.map((product) => (
              <article key={product._id} className="product-card">
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3', background: '#f9fafb' }}>
                  <img src={product.image} alt={product.name} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '0.4rem 1rem', borderRadius: '9999px', fontWeight: '700', fontSize: '1.05rem', color: '#111827', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    ${product.price}
                  </div>
                </div>
                
                <div className="product-card-body">
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6366f1', fontWeight: '700', marginBottom: '0.75rem' }}>{product.category}</span>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.35rem', fontWeight: '700', letterSpacing: '-0.02em', color: '#111827' }}>{product.name}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.6', flex: 1 }}>{product.description}</p>
                  
                  <button 
                    onClick={() => addToCart(product._id)} 
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: '#f3f4f6',
                      color: '#111827',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#000';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.color = '#111827';
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      
      {/* Footer Banner */}
      <section style={{ 
        marginTop: '8rem', 
        padding: '5rem 4rem', 
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '4rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '450px' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1rem', letterSpacing: '-0.03em', color: '#111827' }}>Stay Updated.</h3>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '1.1rem', lineHeight: '1.6' }}>Subscribe to get exclusive early access to drops, curated collections, and more.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '320px', maxWidth: '450px', position: 'relative' }}>
          <input type="email" placeholder="Email address" style={{ flex: 1, padding: '1.25rem 1.5rem', fontSize: '1.05rem', borderRadius: '16px', border: '1px solid #e5e7eb', background: '#fff', color: '#111827', outline: 'none', transition: 'all 0.2s' }} 
            onFocus={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <button style={{ padding: '0 2rem', fontSize: '1rem', borderRadius: '14px', border: 'none', background: '#000', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >Join</button>
        </div>
      </section>
    </div>
  );
}
