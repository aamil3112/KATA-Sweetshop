import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { ordersAPI } from '../../services/api';
import './ShoppingCart.css';

interface ShoppingCartProps {
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ onClose }) => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { showToast } = useToast();

  const handleCheckout = async () => {
    if (items.length === 0) {
      showToast('Your cart is empty!', 'warning');
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        sweet_id: item.sweet._id || item.sweet.id!,
        quantity: item.quantity,
      }));

      await ordersAPI.create({ items: orderItems });
      clearCart();
      showToast('Order placed successfully!', 'success');
      onClose();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to place order', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>🛒 Shopping Cart</h2>
            <button onClick={onClose} className="cart-close">×</button>
          </div>
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <button onClick={onClose} className="btn-continue-shopping">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛒 Shopping Cart ({items.length} items)</h2>
          <button onClick={onClose} className="cart-close">×</button>
        </div>
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.sweet._id || item.sweet.id} className="cart-item">
              <div className="cart-item-info">
                <h4>{item.sweet.name}</h4>
                <p className="cart-item-price">₹{item.sweet.price.toFixed(2)} each</p>
              </div>
              <div className="cart-item-controls">
                <button
                  onClick={() => updateQuantity(item.sweet._id || item.sweet.id!, item.quantity - 1)}
                  className="qty-btn-small"
                >
                  −
                </button>
                <span className="cart-item-qty">{item.quantity}</span>
                <button
                  onClick={() => {
                    if (item.quantity < item.sweet.quantity) {
                      updateQuantity(item.sweet._id || item.sweet.id!, item.quantity + 1);
                    } else {
                      showToast('Not enough stock available', 'warning');
                    }
                  }}
                  className="qty-btn-small"
                  disabled={item.quantity >= item.sweet.quantity}
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.sweet._id || item.sweet.id!)}
                  className="cart-item-remove"
                >
                  🗑️
                </button>
              </div>
              <div className="cart-item-total">
                ₹{(item.sweet.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <strong>Total: ₹{getTotalPrice().toFixed(2)}</strong>
          </div>
          <div className="cart-actions">
            <button onClick={clearCart} className="btn-clear-cart">
              Clear Cart
            </button>
            <button onClick={handleCheckout} className="btn-checkout">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

