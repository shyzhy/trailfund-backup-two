import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBullhorn, FaBuilding, FaMoneyBillWave, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import Modal from '../components/Modal';
import { API_BASE_URL } from '../config';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [donationType, setDonationType] = useState('Cash');
  const [formData, setFormData] = useState({
    title: '',
    ownerName: '',
    organization: '',
    description: '',
    targetAmount: '',
    minAmount: '',
    maxAmount: '',
    designatedSite: 'Main Building Lobby'
  });
  const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // 1. Validation
    if (!formData.title || !formData.ownerName || !formData.targetAmount || !formData.description) {
      setModal({
        isOpen: true,
        type: 'warning',
        message: 'Please fill in all required fields (Name, Owner, Amount, Description).'
      });
      return;
    }

    // 2. Pending State
    setModal({ isOpen: true, type: 'pending', message: 'Submitting your campaign...' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          donationType,
          targetAmount: Number(formData.targetAmount),
          minAmount: Number(formData.minAmount),
          maxAmount: Number(formData.maxAmount)
        })
      });

      if (response.ok) {
        // 3. Success State
        setModal({
          isOpen: true,
          type: 'success',
          message: 'Campaign submitted successfully! It is now pending approval.'
        });
        // Clear form
        setFormData({
          title: '',
          ownerName: '',
          organization: '',
          description: '',
          targetAmount: '',
          minAmount: '',
          maxAmount: '',
          designatedSite: 'Main Building Lobby'
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      // 4. Error State
      setModal({
        isOpen: true,
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.type === 'success') {
      navigate('/home');
    }
  };

  return (
    <div style={{ padding: 20, paddingBottom: 100, minHeight: '100vh', color: 'white', position: 'relative' }}>

      {/* Background Image with Mask Fade */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60vh',
        backgroundImage: 'url(/assets/university.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        zIndex: -2,
        opacity: 0.3,
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)'
      }} />
      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={handleCloseModal}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
        <FaArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <h2 style={{ margin: 0, fontSize: 20 }}>Start a Campaign</h2>
      </div>

      <div className="glass-card" style={{ padding: 20 }}>

        {/* Campaign Name */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Name of Campaign</label>
          <div style={{ position: 'relative' }}>
            <FaBullhorn style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              placeholder="e.g., Annual Book Drive"
              style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
            />
          </div>
        </div>

        {/* Owner & Organization */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Owner Name</label>
            <div style={{ position: 'relative' }}>
              <FaUser style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <input
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                style={{ width: '100%', padding: '12px 12px 12px 35px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Organization</label>
            <div style={{ position: 'relative' }}>
              <FaBuilding style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <input
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                type="text"
                placeholder="Org/Team"
                style={{ width: '100%', padding: '12px 12px 12px 35px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your campaign goals..."
            style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', resize: 'none' }}
          />
        </div>

        {/* Target Amount */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Target Amount (₱)</label>
          <div style={{ position: 'relative' }}>
            <FaMoneyBillWave style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
            <input
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              type="number"
              placeholder="50000"
              style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
            />
          </div>
        </div>

        {/* Min/Max Donation */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Min Donation</label>
            <input
              name="minAmount"
              value={formData.minAmount}
              onChange={handleChange}
              type="number"
              placeholder="0.00"
              style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Max Donation</label>
            <input
              name="maxAmount"
              value={formData.maxAmount}
              onChange={handleChange}
              type="number"
              placeholder="0.00"
              style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
            />
          </div>
        </div>

        {/* Donation Type */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 12, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Type of Donation</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Cash', 'Digital', 'Items'].map((type) => (
              <button
                key={type}
                onClick={() => setDonationType(type)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 12,
                  border: donationType === type ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.2)',
                  background: donationType === type ? 'rgba(0, 180, 216, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Designated Site */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Designated Donation Site</label>
          <div style={{ position: 'relative' }}>
            <FaMapMarkerAlt style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
            <select
              name="designatedSite"
              value={formData.designatedSite}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: '#002840', color: 'white', outline: 'none' }}
            >
              <option>Main Building Lobby</option>
              <option>Student Center Office</option>
              <option>Library Drop-off</option>
              <option>Gymnasium</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="btn"
          style={{ width: '100%', marginTop: 10, background: 'var(--accent-color)', color: 'white', padding: 15, fontSize: 16 }}
        >
          Submit for Approval
        </button>

      </div>
    </div>
  );
}
