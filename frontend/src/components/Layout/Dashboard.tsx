import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sweetsAPI, Sweet } from '../../services/api';
import SweetList from '../Sweets/SweetList';
import SweetSearch from '../Sweets/SweetSearch';
import SweetForm from '../Sweets/SweetForm';
import './Dashboard.css';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'category-asc' | 'category-desc';

const Dashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      const data = await sweetsAPI.getAll();
      setSweets(data);
      setFilteredSweets(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load sweets. Please check if the backend is running.';
      setError(errorMessage);
      console.error('Error loading sweets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchParams: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    try {
      const data = await sweetsAPI.search(searchParams);
      setFilteredSweets(data);
      // Apply current sort after search
      handleSort(sortBy);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Search failed');
    }
  };

  const handlePurchase = async (id: string, quantity: number = 1) => {
    try {
      await sweetsAPI.purchase(id, quantity);
      await loadSweets();
      showToast(`Successfully purchased ${quantity} item(s)!`, 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Purchase failed';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    const sorted = [...filteredSweets].sort((a, b) => {
      switch (option) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'category-asc':
          return a.category.localeCompare(b.category);
        case 'category-desc':
          return b.category.localeCompare(a.category);
        default:
          return 0;
      }
    });
    setFilteredSweets(sorted);
  };

  const handleAdd = async (sweet: any) => {
    try {
      await sweetsAPI.create(sweet);
      setShowAddForm(false);
      await loadSweets();
      showToast('Sweet added successfully!', 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to add sweet';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleUpdate = async (id: string, sweet: any) => {
    try {
      await sweetsAPI.update(id, sweet);
      setEditingSweet(null);
      await loadSweets();
      showToast('Sweet updated successfully!', 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update sweet';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return;
    }
    try {
      await sweetsAPI.delete(id);
      await loadSweets();
      showToast('Sweet deleted successfully!', 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to delete sweet';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleRestock = async (id: string, quantity: number) => {
    try {
      await sweetsAPI.restock(id, quantity);
      await loadSweets();
      showToast(`Restocked ${quantity} items!`, 'success');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Restock failed';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  if (loading) {
    return <div className="loading">Loading sweets...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Sweet Shop Dashboard</h1>
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-add"
          >
            + Add New Sweet
          </button>
        )}
      </div>

      {error && (
        <div className="error-banner" onClick={() => setError('')}>
          {error} (click to dismiss)
        </div>
      )}

      {!isAdmin && sweets.length === 0 && (
        <div className="info-banner">
          <p><strong>Note:</strong> You're logged in as a regular user. To add sweets, you need admin access.</p>
          <p>To make yourself an admin, update your role in MongoDB:</p>
          <code>db.users.updateOne(&#123;"email": "YOUR_EMAIL"&#125;, &#123;$set: &#123;"role": "admin"&#125;&#125;)</code>
          <p>Then refresh this page.</p>
        </div>
      )}

      <div className="dashboard-controls">
        <SweetSearch onSearch={handleSearch} onReset={() => loadSweets()} />
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value as SortOption)}
            className="sort-select"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="category-asc">Category (A-Z)</option>
            <option value="category-desc">Category (Z-A)</option>
          </select>
        </div>
      </div>

      {showAddForm && (
        <SweetForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingSweet && (
        <SweetForm
          sweet={editingSweet}
          onSubmit={(sweet) => handleUpdate(editingSweet._id || editingSweet.id!, sweet)}
          onCancel={() => setEditingSweet(null)}
        />
      )}

      <SweetList
        sweets={filteredSweets}
        onPurchase={handlePurchase}
        onEdit={isAdmin ? (sweet) => setEditingSweet(sweet) : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        onRestock={isAdmin ? handleRestock : undefined}
      />
    </div>
  );
};

export default Dashboard;

