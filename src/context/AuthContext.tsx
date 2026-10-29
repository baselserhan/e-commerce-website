'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  name: string;
  email: string;
  role: 'user' | 'admin';
  password?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Completed';
}

interface AuthContextType {
  user: User | null;
  users: User[];
  orders: Order[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  addOrder: (items: OrderItem[], subtotal: number, shipping: number, tax: number, total: number, shippingName: string) => Promise<string>;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    // 1. Initialise mock users database
    const storedUsers = localStorage.getItem('luxura-users');
    let dbUsers: User[] = [];
    if (storedUsers) {
      try {
        dbUsers = JSON.parse(storedUsers);
      } catch (e) {
        console.error('Error parsing users database', e);
      }
    } else {
      // Seed default admin user and default standard user
      dbUsers = [
        {
          name: 'Admin User',
          email: 'admin@luxura.com',
          password: 'admin123',
          role: 'admin',
        },
        {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'user123',
          role: 'user',
        }
      ];
      localStorage.setItem('luxura-users', JSON.stringify(dbUsers));
    }
    setUsers(dbUsers);

    // 2. Load current session
    const currentUser = localStorage.getItem('luxura-session');
    if (currentUser) {
      try {
        setUser(JSON.parse(currentUser));
      } catch (e) {
        console.error('Error parsing session', e);
      }
    }

    // 3. Load orders database
    const storedOrders = localStorage.getItem('luxura-orders');
    let dbOrders: Order[] = [];
    if (storedOrders) {
      try {
        dbOrders = JSON.parse(storedOrders);
      } catch (e) {
        console.error('Error parsing orders database', e);
      }
    } else {
      // Seed mock orders
      dbOrders = [
        {
          id: 'LX-824103',
          userEmail: 'jane@example.com',
          userName: 'Jane Doe',
          items: [
            {
              productId: 'headphones',
              productName: 'AeroSound X1 ANC Headphones',
              price: 299,
              quantity: 1,
              image: '/images/headphones.jpg'
            }
          ],
          subtotal: 299,
          shipping: 15,
          tax: 24,
          total: 338,
          date: '2026-06-25T14:32:00Z',
          status: 'Delivered'
        },
        {
          id: 'LX-190473',
          userEmail: 'admin@luxura.com',
          userName: 'Admin User',
          items: [
            {
              productId: 'keyboard',
              productName: 'KeyCraft Custom Mechanical Keyboard',
              price: 189,
              quantity: 1,
              image: '/images/keyboard.jpg'
            },
            {
              productId: 'lamp',
              productName: 'Aura Minimalist LED Desk Lamp',
              price: 120,
              quantity: 2,
              image: '/images/lamp.jpg'
            }
          ],
          subtotal: 429,
          shipping: 15,
          tax: 34,
          total: 478,
          date: '2026-06-28T09:12:00Z',
          status: 'Completed'
        }
      ];
      localStorage.setItem('luxura-orders', JSON.stringify(dbOrders));
    }
    setOrders(dbOrders);
    setIsLoaded(true);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (foundUser) {
      const sessionUser = { name: foundUser.name, email: foundUser.email, role: foundUser.role };
      setUser(sessionUser);
      localStorage.setItem('luxura-session', JSON.stringify(sessionUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    // Check if email already registered
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;

    const newUser: User = { name, email, password, role };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('luxura-users', JSON.stringify(updatedUsers));

    // Sign in immediately
    const sessionUser = { name, email, role };
    setUser(sessionUser);
    localStorage.setItem('luxura-session', JSON.stringify(sessionUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxura-session');
  };

  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    if (!user) return false;
    
    // Check if the new email is already taken by someone else
    if (email.toLowerCase() !== user.email.toLowerCase()) {
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) return false;
    }

    // Update users database
    const updatedUsers = users.map((u) => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, name, email };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('luxura-users', JSON.stringify(updatedUsers));

    // Update orders database - link old user orders to new email
    const updatedOrders = orders.map((o) => {
      if (o.userEmail.toLowerCase() === user.email.toLowerCase()) {
        return { ...o, userEmail: email, userName: name };
      }
      return o;
    });
    setOrders(updatedOrders);
    localStorage.setItem('luxura-orders', JSON.stringify(updatedOrders));

    // Update current session
    const updatedSession = { ...user, name, email };
    setUser(updatedSession);
    localStorage.setItem('luxura-session', JSON.stringify(updatedSession));
    return true;
  };

  const addOrder = async (
    items: OrderItem[],
    subtotal: number,
    shipping: number,
    tax: number,
    total: number,
    shippingName: string
  ): Promise<string> => {
    const generatedId = 'LX-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: generatedId,
      userEmail: user ? user.email : 'guest@luxura.com',
      userName: shippingName || (user ? user.name : 'Guest Customer'),
      items,
      subtotal,
      shipping,
      tax,
      total,
      date: new Date().toISOString(),
      status: 'Pending',
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('luxura-orders', JSON.stringify(updatedOrders));
    return generatedId;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        orders,
        login,
        register,
        logout,
        updateProfile,
        addOrder,
        isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
