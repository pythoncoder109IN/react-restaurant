import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import Header from './components/Header.jsx';
import Meals from './components/Meals.jsx';
import MealDetailsModal from './components/UI/MealDetailsModal.jsx';
import { CartContextProvider } from './store/CartContext.jsx';
import { UserProgressContextProvider } from './store/UserProgressContext.jsx';
import SearchPage from './components/SearchPage.jsx';

function App() {
  return (
    <UserProgressContextProvider>
      <CartContextProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path='/' element={<Meals />} />
              <Route path='/search/:dishName' element={<SearchPage />} />
            </Routes>
          </main>
          <Cart />
          <Checkout />
          <MealDetailsModal />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </CartContextProvider>
    </UserProgressContextProvider>
  );
}

export default App;