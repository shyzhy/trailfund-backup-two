import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaFilter } from "react-icons/fa";
import BottomNav from "../components/BottomNav";
import { API_BASE_URL } from '../config';

export default function Campaigns() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'campaigns';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [campaigns, setCampaigns] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState(initialTab); // 'campaigns' or 'requests'
  const [filterUrgency, setFilterUrgency] = useState('All'); // 'All', 'High', 'Medium', 'Low'

  useEffect(() => {
    // Fetch Campaigns
    fetch(`${API_BASE_URL}/api/campaigns`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCampaigns(data);
        } else {
          console.error('API returned non-array:', data);
          setCampaigns([]);
        }
      })
      .catch(err => {
        console.error('Error fetching campaigns:', err);
        setCampaigns([]);
      });

    // Fetch Requests
    fetch(`${API_BASE_URL}/api/requests`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          console.error('API returned non-array for requests:', data);
          setRequests([]);
        }
      })
      .catch(err => {
        console.error('Error fetching requests:', err);
        setRequests([]);
      });
  }, []);

  // Sync filterType with activeTab when tab changes
  useEffect(() => {
    setFilterType(activeTab);
  }, [activeTab]);

  const handleApplyFilter = () => {
    setActiveTab(filterType);
    setShowFilter(false);
  };

  const filteredRequests = requests.filter(r => {
    if (filterUrgency === 'All') return true;
    // Map backend urgency (Green/Yellow/Red) to frontend filter (Low/Medium/High) if needed
    // Or just assume frontend filter matches backend values if we update filter options
    // Let's map for now to be safe based on previous task
    const urgencyMap = { 'Green': 'Low', 'Yellow': 'Medium', 'Red': 'High' };
    const mappedUrgency = urgencyMap[r.urgency] || r.urgency;
    return mappedUrgency === filterUrgency;
  });

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

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <FaArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>Explore</h2>
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          <FaSearch size={20} />
          <FaFilter size={20} onClick={() => setShowFilter(true)} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }} onClick={() => setShowFilter(false)}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 400, padding: 25, background: '#002840' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 20 }}>Filter Options</h3>

            {/* Type Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 10, color: 'rgba(255,255,255,0.7)' }}>Type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setFilterType('campaigns')}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: filterType === 'campaigns' ? 'var(--accent-color)' : 'transparent',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Campaigns
                </button>
                <button
                  onClick={() => setFilterType('requests')}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: filterType === 'requests' ? 'var(--accent-color)' : 'transparent',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Requests
                </button>
              </div>
            </div>

            {/* Urgency Selection (Only if Requests is selected) */}
            {filterType === 'requests' && (
              <div style={{ marginBottom: 25 }}>
                <label style={{ display: 'block', marginBottom: 10, color: 'rgba(255,255,255,0.7)' }}>Urgency Level</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {['All', 'High', 'Medium', 'Low'].map(level => (
                    <button
                      key={level}
                      onClick={() => setFilterUrgency(level)}
                      style={{
                        padding: '8px 15px',
                        borderRadius: 20,
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: filterUrgency === level ? 'var(--accent-color)' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: 14
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn"
              style={{ width: '100%', background: 'var(--accent-color)', color: 'white' }}
              onClick={handleApplyFilter}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 15, marginBottom: 25 }}>
        <button
          onClick={() => setActiveTab('campaigns')}
          style={{
            background: activeTab === 'campaigns' ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 20,
            fontWeight: 'bold',
            flex: 1,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Campaigns
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            background: activeTab === 'requests' ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 20,
            fontWeight: 'bold',
            flex: 1,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Requests
        </button>
      </div>

      {/* Content List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {activeTab === 'campaigns' ? (
          campaigns.map(c => (
            <div key={c.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Campaign Card Content (Same as before) */}
              <div style={{ height: 160, position: 'relative' }}>
                <img
                  src={c.image || "/assets/university.jpg"}
                  alt={c.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'rgba(0,0,0,0.6)',
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 'bold',
                  backdropFilter: 'blur(4px)'
                }}>
                  {c.daysLeft} days left
                </div>
              </div>

              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <img
                    src={c.avatar || "/assets/pfp1.jpg"}
                    alt="Owner"
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.5)' }}
                  />
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                    by <span style={{ fontWeight: 'bold', color: 'white' }}>{c.id === 'c1' ? 'Ning Yizhuo' : 'Yu Jimin'}</span>
                  </div>
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 'bold' }}>{c.title}</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{c.summary}</p>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>₱{(c.raised || 0).toLocaleString()}</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>of ₱{(c.goal || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                    <div style={{ width: `${((c.raised || 0) / (c.goal || 1)) * 100}%`, height: '100%', background: 'var(--accent-color)', borderRadius: 3 }} />
                  </div>
                </div>

                <Link to={`/campaigns/${c.id}`} style={{ textDecoration: 'none' }}>
                  <button className="btn" style={{ width: '100%', background: 'var(--accent-color)', color: 'white', padding: 12 }}>View Details</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          filteredRequests.map(r => (
            <div key={r._id} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>{r.title}</h3>
                <span style={{
                  background: r.urgency === 'Red' ? 'rgba(220, 53, 69, 0.2)' : r.urgency === 'Yellow' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(40, 167, 69, 0.2)',
                  color: r.urgency === 'Red' ? '#dc3545' : r.urgency === 'Yellow' ? '#ffc107' : '#28a745',
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 'bold'
                }}>
                  {r.urgency === 'Green' ? 'Low' : r.urgency === 'Yellow' ? 'Moderate' : 'High'} Priority
                </span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 15 }}>
                Requested by <span style={{ color: 'white', fontWeight: 'bold' }}>{r.user_id?.name || 'Unknown'}</span> • {r.location}
              </p>
              <button className="btn" style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white', padding: 10 }}>View Request</button>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
