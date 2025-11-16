import { useState, useEffect } from 'react';
import { ordersAPI, Order } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './OrderHistory.css';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getMyOrders();
      setOrders(data);
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-history">
      <div className="order-history-header">
        <h1>📋 Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>No orders yet</p>
          <p>Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id || order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id?.substring(0, 8) || order.id?.substring(0, 8)}</h3>
                  <p className="order-date">{formatDate(order.created_at)}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-item-info">
                      <h4>{item.sweet_name}</h4>
                      <p>Quantity: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="order-item-total">
                      ₹{item.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <strong>Total: ₹{order.total_amount.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

