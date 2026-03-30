import '@/app/globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'NexCart | Premium Essentials',
  description: 'A cutting-edge modern ecommerce storefront',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="shell-inner">
              <a className="brand" href="/">
                Nex<span style={{color: '#6366f1'}}>Cart</span>
              </a>
              <nav className="site-nav" aria-label="Primary">
                <a href="/">Home</a>
                <a href="/products">Shop</a>
                <a href="/cart">Cart</a>
                <a href="/orders">Orders</a>
                <a href="/login">Login</a>
                <a href="/signup">Signup</a>
              </nav>
            </div>
          </header>
          <main className="shell-inner">{children}</main>
        </div>
      </body>
    </html>
  );
}
