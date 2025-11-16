import { useState } from 'react';
import { Sweet } from '../../services/api';
import './SweetCard.css';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string, quantity?: number) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
  onRestock?: (id: string, quantity: number) => void;
}

const SweetCard: React.FC<SweetCardProps> = ({
  sweet,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}) => {
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [showRestock, setShowRestock] = useState(false);

  // Helper function to get the correct image path
  const getImagePath = (sweetName: string): string => {
    const imageName = sweetName.toLowerCase().replace(/\s+/g, '-');
    return `/images/${imageName}.jpg`;
  };

  const handleRestock = () => {
    if (restockQuantity > 0 && onRestock) {
      const sweetId = sweet._id || sweet.id;
      if (sweetId) {
        onRestock(sweetId, restockQuantity);
        setShowRestock(false);
        setRestockQuantity(10);
      }
    }
  };

  return (
    <div className="sweet-card">
      <div className="sweet-image-container">
        <img 
          src={getImagePath(sweet.name)} 
          alt={sweet.name}
          className="sweet-image"
          onError={(e) => {
            // Try different extensions if image fails to load
            const img = e.target as HTMLImageElement;
            const currentSrc = img.src;
            const basePath = `/images/${sweet.name.toLowerCase().replace(/\s+/g, '-')}`;
            
            console.error(`❌ Image failed to load for ${sweet.name}:`, currentSrc);
            
            // Try alternative extensions
            if (currentSrc.endsWith('.jpg')) {
              // Try .jpeg
              console.log(`Trying .jpeg for ${sweet.name}`);
              img.src = `${basePath}.jpeg`;
            } else if (currentSrc.endsWith('.jpeg')) {
              // Try .png
              console.log(`Trying .png for ${sweet.name}`);
              img.src = `${basePath}.png`;
            } else if (currentSrc.endsWith('.png')) {
              // Try .webp
              console.log(`Trying .webp for ${sweet.name}`);
              img.src = `${basePath}.webp`;
            } else {
              // Final fallback to placeholder
              console.warn(`⚠️ Using placeholder for ${sweet.name} - all image formats failed`);
              img.src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(sweet.name);
            }
          }}
          onLoad={() => {
            console.log(`✅ Image loaded successfully: ${sweet.name}`);
          }}
        />
      </div>
      <div className="sweet-header">
        <h3>{sweet.name}</h3>
        <span className="sweet-category">{sweet.category}</span>
      </div>
      {sweet.description && (
        <p className="sweet-description">{sweet.description}</p>
      )}
      <div className="sweet-details">
        <div className="sweet-price">₹{sweet.price.toFixed(2)}</div>
        <div className={`sweet-quantity ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
          {sweet.quantity === 0 ? 'Out of Stock' : `Stock: ${sweet.quantity}`}
        </div>
      </div>
      <div className="sweet-actions">
        <button
          onClick={() => {
            const sweetId = sweet._id || sweet.id;
            if (sweetId) onPurchase(sweetId, 1);
          }}
          disabled={sweet.quantity === 0}
          className="btn-purchase"
        >
          Purchase
        </button>
        {onEdit && (
          <button onClick={() => onEdit(sweet)} className="btn-edit">
            Edit
          </button>
        )}
        {onDelete && (
          <button 
            onClick={() => {
              const sweetId = sweet._id || sweet.id;
              if (sweetId) onDelete(sweetId);
            }} 
            className="btn-delete"
          >
            Delete
          </button>
        )}
        {onRestock && (
          <>
            <button
              onClick={() => setShowRestock(!showRestock)}
              className="btn-restock-toggle"
            >
              {showRestock ? 'Cancel' : 'Restock'}
            </button>
            {showRestock && (
              <div className="restock-form">
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
                  className="restock-input"
                />
                <button onClick={handleRestock} className="btn-restock-confirm">
                  Confirm
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SweetCard;

