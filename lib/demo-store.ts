import { randomUUID } from 'crypto';
import { hashPassword } from '@/lib/auth';

export type DemoProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type DemoUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

type DemoCartItem = {
  productId: string;
  quantity: number;
};

type DemoCart = {
  userId: string;
  items: DemoCartItem[];
};

type DemoOrder = {
  _id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  address: string;
  status: string;
  paymentMethod: string;
};

type DemoStore = {
  products: DemoProduct[];
  users: DemoUser[];
  carts: DemoCart[];
  orders: DemoOrder[];
};

const defaultProducts: DemoProduct[] = [
  {
    _id: randomUUID(),
    name: 'Laptop Pro 14',
    description: 'High-performance laptop for study, work, and creative projects.',
    price: 1000,
    image: 'https://loremflickr.com/800/600/laptop,macbook',
    category: 'Electronics',
  },
  {
    _id: randomUUID(),
    name: 'Smartphone X',
    description: 'Reliable all-day smartphone with a bright display and strong battery.',
    price: 500,
    image: 'https://loremflickr.com/800/600/smartphone,iphone',
    category: 'Electronics',
  },
  {
    _id: randomUUID(),
    name: 'Running Shoes',
    description: 'Lightweight running shoes built for comfort and daily movement.',
    price: 100,
    image: 'https://loremflickr.com/800/600/shoes,sneakers',
    category: 'Fashion',
  },
  {
    _id: randomUUID(),
    name: 'Programming Book',
    description: 'A practical book for improving modern software engineering skills.',
    price: 50,
    image: 'https://loremflickr.com/800/600/book,code',
    category: 'Books',
  },
  {
    _id: randomUUID(),
    name: 'Smart Watch',
    description: 'Track fitness, messages, and daily routines from your wrist.',
    price: 200,
    image: 'https://loremflickr.com/800/600/smartwatch,applewatch',
    category: 'Electronics',
  },
  {
    _id: randomUUID(),
    name: 'Wireless Headphones',
    description: 'Crisp sound, comfortable fit, and noise isolation for focus.',
    price: 150,
    image: 'https://loremflickr.com/800/600/headphones,audio',
    category: 'Electronics',
  },
  {
    _id: randomUUID(),
    name: 'Cotton T-Shirt',
    description: 'Breathable everyday tee with a comfortable relaxed fit.',
    price: 20,
    image: 'https://loremflickr.com/800/600/tshirt,clothing',
    category: 'Fashion',
  },
  {
    _id: randomUUID(),
    name: 'Gaming Mouse',
    description: 'Responsive ergonomic mouse with precise movement and grip.',
    price: 30,
    image: 'https://loremflickr.com/800/600/computer,mouse',
    category: 'Electronics',
  },
  {
    _id: randomUUID(),
    name: 'Mechanical Keyboard',
    description: 'Tactile keyboard built for productivity and satisfying typing.',
    price: 80,
    image: 'https://loremflickr.com/800/600/keyboard,mechanical',
    category: 'Electronics',
  },
  {
    _id: randomUUID(),
    name: 'Travel Backpack',
    description: 'Roomy backpack with dedicated pockets for work and commute.',
    price: 60,
    image: 'https://loremflickr.com/800/600/backpack,bag',
    category: 'Fashion',
  },
  {
    _id: randomUUID(),
    name: '4K Monitor',
    description: 'Sharp high-resolution display for multitasking and design work.',
    price: 300,
    image: 'https://loremflickr.com/800/600/monitor,screen',
    category: 'Electronics',
  },
  {
    _id: randomUUID(),
    name: 'Office Chair',
    description: 'Supportive chair built for longer sessions at your desk.',
    price: 250,
    image: 'https://loremflickr.com/800/600/officechair',
    category: 'Furniture',
  },
];

declare global {
  // eslint-disable-next-line no-var
  var demoStore: DemoStore | undefined;
}

function getStore() {
  if (!global.demoStore) {
    global.demoStore = {
      products: defaultProducts,
      users: [
        {
          _id: randomUUID(),
          name: 'Demo User',
          email: 'demo@example.com',
          password: hashPassword('demo1234'),
        },
      ],
      carts: [],
      orders: [],
    };
  }

  return global.demoStore;
}

export function getDemoProducts() {
  return [...getStore().products];
}

export function findDemoUserByEmail(email: string) {
  return getStore().users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function createDemoUser(input: { name: string; email: string; password: string }) {
  const store = getStore();
  const existingUser = findDemoUserByEmail(input.email);

  if (existingUser) {
    return null;
  }

  const user = {
    _id: randomUUID(),
    name: input.name,
    email: input.email,
    password: hashPassword(input.password),
  };

  store.users.push(user);
  return user;
}

export function getDemoCart(userId: string) {
  const store = getStore();
  const cart = store.carts.find((entry) => entry.userId === userId) ?? { userId, items: [] };

  return {
    items: cart.items
      .map((item) => {
        const product = store.products.find((entry) => entry._id === item.productId);

        if (!product) {
          return null;
        }

        return {
          productId: {
            _id: product._id,
            name: product.name,
            price: product.price,
          },
          quantity: item.quantity,
        };
      })
      .filter(Boolean),
  };
}

export function addDemoCartItem(userId: string, productId: string, quantity: number) {
  const store = getStore();
  const product = store.products.find((entry) => entry._id === productId);

  if (!product) {
    return null;
  }

  let cart = store.carts.find((entry) => entry.userId === userId);

  if (!cart) {
    cart = { userId, items: [] };
    store.carts.push(cart);
  }

  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  return getDemoCart(userId);
}

export function checkoutDemoCart(userId: string, address: string) {
  const store = getStore();
  const cart = store.carts.find((entry) => entry.userId === userId);

  if (!cart || cart.items.length === 0) {
    return null;
  }

  let total = 0;
  const items = cart.items
    .map((item) => {
      const product = store.products.find((entry) => entry._id === item.productId);

      if (!product) {
        return null;
      }

      total += product.price * item.quantity;

      return {
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    })
    .filter(Boolean);

  const order: DemoOrder = {
    _id: randomUUID(),
    userId,
    items: items as DemoOrder['items'],
    total,
    address,
    status: 'pending',
    paymentMethod: 'cash_on_delivery',
  };

  store.orders.push(order);
  cart.items = [];

  return order;
}

export function getDemoOrders(userId: string) {
  const store = getStore();
  const userOrders = store.orders.filter((order) => order.userId === userId);
  return userOrders.map((order) => {
    const populatedItems = order.items.map((item) => {
      const product = store.products.find((p) => p._id === item.productId);
      return {
        ...item,
        productId: product ? { _id: product._id, name: product.name, price: product.price } : { _id: item.productId, name: 'Unknown', price: item.price }
      };
    });
    return { ...order, items: populatedItems };
  }).sort((a, b) => b._id.localeCompare(a._id));
}

export function cancelDemoOrder(orderId: string, userId: string) {
  const store = getStore();
  const order = store.orders.find((order) => order._id === orderId && order.userId === userId);
  if (!order) return null;
  if (order.status !== 'pending') return false;
  order.status = 'cancelled';
  return order;
}
