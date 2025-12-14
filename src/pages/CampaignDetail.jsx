import React from "react";
import { useParams, Link } from "react-router-dom";
import { campaigns } from "../data/mockCampaigns";

export default function CampaignDetail() {
  const { id } = useParams();
  const camp = campaigns.find(c => c.id === id) || campaigns[0];

  return (
    <div>
      <div className="card">
        <h2>{camp.title}</h2>
        <p className="campaign-meta">{camp.summary}</p>
        {camp.image ? (
          <img src={camp.image} alt={camp.title} style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 8, marginTop: 12 }} />
        ) : (
          <div style={{ height: 220, background: "#f3f4f6", borderRadius: 8, marginTop: 12 }} />
        )}
        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h4>Raised</h4>
            <div style={{ fontSize: 22, fontWeight: 700 }}>₱{camp.raised.toLocaleString()} / ₱{camp.goal.toLocaleString()}</div>
            <p className="campaign-meta">{camp.daysLeft} days left</p>
          </div>
          <div style={{ width: 240 }}>
            <h4>Support this cause</h4>
            <Link to="/profile"><button className="btn" style={{ width: "100%" }}>Donate ₱250</button></Link>
            <div style={{ height: 8 }} />
            <button className="btn" style={{ width: "100%", background: "#6b7280" }}>Share</button>
          </div>
        </div>
      </div>
      <div className="card">
        <h3>Updates & Story</h3>
        <p className="campaign-meta">
          Join us in transforming our university's science center into a state-of-the-art facility.
          Your contributions will directly fund new laboratories, research equipment, and collaborative spaces
          for students and faculty. Together, we can build a brighter future through innovation and education.
        </p>
      </div>
    </div>
  );
}
