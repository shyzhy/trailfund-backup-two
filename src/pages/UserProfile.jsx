import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserPlus, FaUserCheck, FaMapMarkerAlt, FaGraduationCap, FaBirthdayCake, FaBuilding } from 'react-icons/fa';
import mockUsers from '../data/mockUsers';
import { API_BASE_URL } from '../config';

export default function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/users`);
                const users = await response.json();
                const foundUser = users.find(u => u._id === id);
                setUser(foundUser);
            } catch (err) {
                console.error('Error fetching user:', err);
            }
        };
        fetchUser();
    }, [id]);

    if (!user) {
        return <div style={{ color: 'white', padding: 20 }}>User not found</div>;
    }

    return (
        <div style={{ paddingBottom: 100, minHeight: '100vh', color: 'white', position: 'relative' }}>

            {/* Header / Cover Area */}
            <div style={{
                height: '240px',
                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Circles */}
                <div style={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    filter: 'blur(40px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    filter: 'blur(30px)'
                }} />

                <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                    <div
                        onClick={() => navigate(-1)}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.2)',
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <FaArrowLeft size={18} color="white" />
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 24px', marginTop: -60, position: 'relative', zIndex: 5 }}>
                {/* Profile Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={user.profile_picture || "/assets/giselle.jpg"}
                            alt={user.name}
                            style={{
                                width: 110,
                                height: 110,
                                borderRadius: '50%',
                                border: '4px solid #003B5C', // Matches body bg
                                objectFit: 'cover',
                                background: '#1a1a1a',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                            }}
                        />
                        {user.isFriend && (
                            <div style={{
                                position: 'absolute',
                                bottom: 5,
                                right: 5,
                                background: '#4CAF50',
                                border: '3px solid #003B5C',
                                width: 24,
                                height: 24,
                                borderRadius: '50%'
                            }} />
                        )}
                    </div>
                    <button style={{
                        background: user.isFriend ? 'rgba(255,255,255,0.15)' : 'linear-gradient(90deg, var(--accent-color), #0090D8)',
                        border: 'none',
                        color: 'white',
                        padding: '10px 24px',
                        borderRadius: 30,
                        fontSize: 14,
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        marginBottom: 15,
                        boxShadow: user.isFriend ? 'none' : '0 4px 15px rgba(0, 180, 216, 0.4)',
                        transition: 'transform 0.2s'
                    }}>
                        {user.isFriend ? <><FaUserCheck /> Friends</> : <><FaUserPlus /> Connect</>}
                    </button>
                </div>

                <div style={{ marginBottom: 25 }}>
                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: '800', letterSpacing: '-0.5px' }}>{user.name}</h1>
                    <p style={{ margin: '4px 0', color: 'var(--accent-color)', fontSize: 15, fontWeight: '500' }}>{user.username}</p>
                    <p style={{ marginTop: 12, lineHeight: 1.6, fontSize: 15, color: 'rgba(255,255,255,0.9)', maxWidth: '90%' }}>{user.bio}</p>
                </div>

                {/* Details Cards */}
                <div className="glass-card" style={{
                    padding: 20,
                    marginBottom: 30,
                    display: 'grid',
                    gap: 16,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    {user.age && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(0, 180, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaBirthdayCake color="var(--accent-color)" size={14} />
                            </div>
                            {user.age} years old
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(0, 180, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaBuilding color="var(--accent-color)" size={14} />
                        </div>
                        {user.college}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(0, 180, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaGraduationCap color="var(--accent-color)" size={16} />
                        </div>
                        <span>{user.department} <span style={{ opacity: 0.5 }}>•</span> {user.yearLevel}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(0,0,0,0.2)',
                    padding: 4,
                    borderRadius: 16,
                    marginBottom: 25
                }}>
                    {['posts', 'campaigns', 'requests'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                background: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent',
                                border: 'none',
                                color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.5)',
                                padding: '10px 0',
                                borderRadius: 12,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                fontWeight: activeTab === tab ? '600' : '500',
                                transition: 'all 0.3s ease',
                                fontSize: 14
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    {activeTab === 'posts' && (
                        user.posts && user.posts.length > 0 ? (
                            user.posts.map(post => (
                                <div key={post.id} className="glass-card" style={{ padding: 15 }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: 14 }}>{post.content}</p>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{post.time} • {post.likes} Likes</div>
                                </div>
                            ))
                        ) : <div style={{ textAlign: 'center', opacity: 0.5, padding: 20 }}>No posts yet</div>
                    )}

                    {activeTab === 'campaigns' && (
                        user.campaigns && user.campaigns.length > 0 ? (
                            user.campaigns.map(camp => (
                                <div key={camp.id} className="glass-card" style={{ padding: 15 }}>
                                    <h4 style={{ margin: '0 0 5px 0' }}>{camp.title}</h4>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                        Raised: ₱{(camp.raised || 0).toLocaleString()} / ₱{(camp.goal || 0).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        ) : <div style={{ textAlign: 'center', opacity: 0.5, padding: 20 }}>No active campaigns</div>
                    )}

                    {activeTab === 'requests' && (
                        user.requests && user.requests.length > 0 ? (
                            user.requests.map(req => (
                                <div key={req.id} className="glass-card" style={{ padding: 15 }}>
                                    <h4 style={{ margin: '0 0 5px 0' }}>{req.title}</h4>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                        Amount Needed: ₱{(req.amount || 0).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        ) : <div style={{ textAlign: 'center', opacity: 0.5, padding: 20 }}>No active requests</div>
                    )}
                </div>

            </div>
        </div>
    );
}
