import { useContext, useState } from "react";
import { CreditCard, MapPin, User, Mail, Lock, ArrowLeft, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

import CartContext from "../store/CartContext.jsx";
import { currencyFormatter } from "../util/formatting.js";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";
import Email from "./UI/Email";
import { render } from "@react-email/render";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [order, setOrder] = useState();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    'postal-code': '',
    city: ''
  });

  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp(`${import.meta.env.VITE_BACKEND_URL}/orders`, requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  const isOpen = userProgressCtx.progress === 'checkout';

  const initPayment = (data) => {
    const options = {
      key: import.meta.env.VITE_RZPY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: "Delicious Restaurant",
      description: "Order Payment",
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`;
          const { data } = await axios.post(verifyUrl, response);
          if (data.message === "Payment verified successfully") {
            setPaymentSuccess(true);
            toast.success("Payment successful!", { icon: '🎉' });
          }
        } catch (error) {
          console.log(error);
          toast.error("Payment verification failed");
        }
      },
      theme: {
        color: "#f59532"
      }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      const orderUrl = `${import.meta.env.VITE_BACKEND_URL}/api/payment/orders`;
      const { data } = await axios.post(orderUrl, { amount: cartTotal });
      initPayment(data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to initiate payment");
    }
  };

  function sendEmail() {
    const emailHtml = render(<Email order={order} />);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailBody: emailHtml, email: order.customer.email }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      });
  }

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleGoBack() {
    userProgressCtx.showCart();
  }

  function handleFinish() {
    if (order) {
      sendEmail();
    }
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
    setPaymentSuccess(false);
    setFormData({
      name: '',
      email: '',
      street: '',
      'postal-code': '',
      city: ''
    });
    toast.success('Thank you for your order!', { icon: '🍽️' });
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Validate form
    const requiredFields = ['name', 'email', 'street', 'postal-code', 'city'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const orderData = {
      items: cartCtx.items,
      customer: formData,
    };
    setOrder(orderData);
    
    // For demo purposes, simulate payment directly
    handlePayment();
  }

  // Success Modal
  if (paymentSuccess) {
    return (
      <AnimatePresence>
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-content max-w-md text-center"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="p-8">
              <motion.div
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your order! We'll send you an email confirmation shortly and 
                get started on preparing your delicious meal.
              </p>
              
              <motion.button
                onClick={handleFinish}
                className="w-full btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Shopping
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-content max-w-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleGoBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
                  <p className="text-sm text-gray-500">Complete your order</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-primary-600">
                    {currencyFormatter.format(cartTotal)}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Order Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 max-h-48 overflow-y-auto">
                  {cartCtx.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {currencyFormatter.format(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary-500" />
                    <span>Personal Information</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="input-field"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="input-field"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    <span>Delivery Address</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        className="input-field"
                        placeholder="Enter your street address"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData['postal-code']}
                          onChange={(e) => handleInputChange('postal-code', e.target.value)}
                          className="input-field"
                          placeholder="Enter postal code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="input-field"
                          placeholder="Enter your city"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && <Error title="Failed to submit order" message={error} />}

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <motion.button
                  type="submit"
                  disabled={isSending || cartCtx.items.length === 0}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSending ? 1 : 1.02 }}
                  whileTap={{ scale: isSending ? 1 : 0.98 }}
                >
                  {isSending ? (
                    <>
                      <div className="loading-spinner w-5 h-5"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Proceed to Payment ({currencyFormatter.format(cartTotal)})</span>
                    </>
                  )}
                </motion.button>
                <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Your payment information is secure and encrypted</span>
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}