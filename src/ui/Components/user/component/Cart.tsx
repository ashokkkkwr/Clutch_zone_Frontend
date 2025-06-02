import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

interface Gear {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

interface CartItem {
  id: number;
  quantity: number;
  userId: number;
  gearId: number;
  gear: Gear;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<number | null>(null);
  const token = localStorage.getItem('token');

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/gear/get-cart',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data.cart);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load cart items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: number, qty: number) => {
    if (qty < 1) return;
    setUpdating(itemId);
    try {
      await axios.patch(
        `http://localhost:5000/api/gear/update-cart/${itemId}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(prev =>
        prev.map(item =>
          item.gearId === itemId ? { ...item, quantity: qty } : item
        )
      );
      toast.success('Quantity updated.');
    
    } catch (error) {
      console.error(error);
      toast.error('Could not update quantity.');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/gear/delete-cart/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item removed from cart.');
      fetchCart()
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove item.');
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast('Your cart is empty.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/gear/addOrders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order placed successfully.');
      setCart([]);
      //reload the site
      

    } catch (error:any) {
      console.error(error);
      toast.error(`${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.gear.price * item.quantity,
    0
  );

  const cartItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Your Cart</h1>
        <div className="flex items-center text-indigo-400">
          <ShoppingBag className="mr-2" size={20} />
          <span className="font-medium">{cart.length} items</span>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-300 text-lg font-medium">Loading your cart...</p>
        </div>
      ) : cart.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full mb-4">
            <AlertCircle className="text-indigo-400" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <button 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-indigo-900/20"
          >
            Continue Shopping
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
            <ul className="divide-y divide-gray-700/70">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.li
                    key={item.id}
                    variants={cartItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-4 md:p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative w-full sm:w-24 h-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden group">
                        <img
                          src={item.gear.image}
                          alt={item.gear.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {updating === item.id && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{item.gear.name}</h3>
                          <p className="text-indigo-300 text-sm mt-1">${item.gear.price.toFixed(2)} each</p>
                          
                          {/* Stock indicator */}
                          <div className="mt-1.5 flex items-center">
                            <div className={`w-2 h-2 rounded-full ${item.gear.stock > 5 ? 'bg-green-500' : item.gear.stock > 0 ? 'bg-amber-500' : 'bg-red-500'} mr-2`}></div>
                            <span className="text-xs text-gray-400">
                              {item.gear.stock > 5 ? 'In Stock' : item.gear.stock > 0 ? `Limited Stock (${item.gear.stock})` : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="flex flex-col mr-8">
                            <button
                              onClick={() => updateQuantity(item.gearId, item.quantity + 1)}
                              disabled={updating === item.id || item.quantity >= item.gear.stock}
                              className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronUp size={18} />
                            </button>
                            <div className="py-1 px-3 text-white text-center font-medium">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => updateQuantity(item.gearId, item.quantity - 1)}
                              disabled={updating === item.id || item.quantity <= 1}
                              className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronDown size={18} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <span className="block text-xl font-bold text-white">
                              ${(item.gear.price * item.quantity).toFixed(2)}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => removeItem(item.gearId)}
                              className="mt-2 flex items-center text-sm text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 size={14} className="mr-1" />
                              <span>Remove</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
          
          {/* Summary & Checkout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 24 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                <span className="text-lg font-medium text-white">Total</span>
                <span className="text-2xl font-bold text-white">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={placeOrder}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/30 flex items-center justify-center"
            >
              Complete Purchase
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
}