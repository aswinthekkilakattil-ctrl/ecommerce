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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    fetch('/api/products')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Unable to load products right now.');
        }

        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((fetchError: Error) => {
        setError(fetchError.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addToCart = (productId: string) => {
    if (!token) {
      setMessage('Please login before adding items to your cart.');
      return;
    }

    setMessage('Adding item to cart...');

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

        if (!res.ok) {
          throw new Error(data.error ?? 'Could not add item to cart.');
        }

        setMessage('Added to cart successfully.');
      })
      .catch((requestError: Error) => {
        setMessage(requestError.message);
      });
  };

  return (
    <div className="page">
      <span className="eyebrow">Catalog</span>
      <h1 className="section-title">Discover our featured products</h1>
      <p className="section-copy">
        Sign in to add products to your cart. Demo login: <strong>demo@example.com</strong> /{' '}
        <strong>demo1234</strong>
      </p>

      {message ? <div className="feedback">{message}</div> : null}
      {error ? <div className="error">{error}</div> : null}

      {loading ? (
        <div className="panel">Loading products...</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <article key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <div className="product-card-body">
                <div className="product-meta">
                  <span className="pill">{product.category}</span>
                  <span className="price">${product.price}</span>
                </div>
                <h2>{product.name}</h2>
                <p className="section-copy">{product.description}</p>
                <button onClick={() => addToCart(product._id)} className="button">
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="inline-actions">
        <Link href="/cart" className="button-secondary">
          Go to Cart
        </Link>
        <Link href="/" className="button-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
