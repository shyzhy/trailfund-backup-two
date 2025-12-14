import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaUsers, FaUserFriends, FaHandHoldingHeart, FaBoxOpen, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';

export default function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user')) || {};

    const menuItems = [
        { icon: <FaUser />, label: 'User Profile', path: '/profile' },
        { icon: <FaUsers />, label: 'Community', path: '/community' },
        { icon: <FaUserFriends />, label: 'Friends List', path: '/friends' },
        { icon: <FaHandHoldingHeart />, label: 'Campaigns', path: '/campaigns' },
        { icon: <FaBoxOpen />, label: 'Requests', path: '/requests' },
        { icon: <FaCog />, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 999,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease'
                }}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: 280,
                background: 'rgba(0, 59, 92, 0.95)', // Dark teal with slight transparency
                backdropFilter: 'blur(10px)',
                zIndex: 1000,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 15px rgba(0,0,0,0.3)'
            }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                    <div
                        onClick={() => {
                            navigate('/profile');
                            onClose();
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                    >
                        <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid white' }}>
                            <img src={user.profile_picture || "/assets/giselle.jpg"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 'bold' }}>{user.name || user.username || 'Guest'}</div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>View Profile</div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Menu Items */}
                <div>
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            onClick={onClose}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 15,
                                padding: '15px 10px',
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: 16,
                                borderBottom: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <span style={{ color: 'var(--accent-color)', fontSize: 20 }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 15,
                        padding: '15px 10px',
                        background: 'rgba(255, 107, 107, 0.1)',
                        border: 'none',
                        borderRadius: 12,
                        color: '#FF6B6B',
                        fontSize: 16,
                        cursor: 'pointer',
                        marginTop: 20
                    }}
                >
                    <FaSignOutAlt />
                    Log Out
                </button>

            </div>
        </>
    );
}
