'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (!storedToken) {
      setLoading(false);
      return;
    }

    fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${storedToken}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? 'Unable to load your cart.');
        }

        setCart(data);
      })
      .catch((fetchError: Error) => {
        setError(fetchError.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const checkout = () => {
    setMessage(null);
    setError(null);

    if (!address.trim()) {
      setError('Please enter your delivery address before checkout.');
      return;
    }

    fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ address }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? 'Checkout failed.');
        }

        setMessage(`Order placed successfully${data.mode === 'demo' ? ' in demo mode' : ''}.`);
        setCart({ items: [] });
        setAddress('');
      })
      .catch((requestError: Error) => {
        setError(requestError.message);
      });
  };

  const total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

  return (
    <div className="page">
      <span className="eyebrow">Your basket</span>
      <h1 className="section-title">Cart</h1>
      <p className="section-copy">Sign in first to view the demo cart and complete checkout.</p>

      {message ? <div className="success">{message}</div> : null}
      {error ? <div className="error">{error}</div> : null}

      {!token ? (
        <div className="empty-state panel">
          <p>You need to login before using the cart.</p>
          <div className="inline-actions">
            <Link href="/login" className="button">
              Go to Login
            </Link>
            <Link href="/products" className="button-secondary">
              Browse Products
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="panel">Loading cart...</div>
      ) : cart.items.length === 0 ? (
        <div className="empty-state panel">
          <p>Your cart is empty.</p>
          <Link href="/products" className="button-secondary">
            Shop Products
          </Link>
        </div>
      ) : (
        <div className="cart-list">
          {cart.items.map((item, index) => (
            <div key={index} className="cart-item">
              <h2>{item.productId.name}</h2>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.productId.price * item.quantity}</p>
            </div>
          ))}
          <div className="panel cart-summary">
            <h2>Total: ${total}</h2>
            <div className="field">
              <label htmlFor="address">Delivery address</label>
              <textarea
                id="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Enter full address with street, area, city, and pin code"
              />
            </div>
            <button onClick={checkout} className="button">
              Checkout (Cash on Delivery)
            </button>
          </div>
        </div>
      )}

      <div className="inline-actions">
        <Link href="/products" className="button-secondary">
          Continue Shopping
        </Link>
        <Link href="/" className="button-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
