import SweetCard from './SweetCard';
import { Sweet } from '../../services/api';
import './SweetList.css';

interface SweetListProps {
  sweets: Sweet[];
  onPurchase: (id: string, quantity?: number) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
  onRestock?: (id: string, quantity: number) => void;
}

const SweetList: React.FC<SweetListProps> = ({
  sweets,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}) => {
  if (sweets.length === 0) {
    return (
      <div className="empty-state">
        <h3>🍬 No Sweets Available</h3>
        <p>There are no sweets in the shop yet.</p>
        <p>If you're an admin, click "Add New Sweet" to get started!</p>
        <p>Otherwise, check back later or try adjusting your search filters.</p>
      </div>
    );
  }

  return (
    <div className="sweet-list">
      {sweets.map((sweet) => (
        <SweetCard
          key={sweet._id || sweet.id}
          sweet={sweet}
          onPurchase={onPurchase}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestock={onRestock}
        />
      ))}
    </div>
  );
};

export default SweetList;

