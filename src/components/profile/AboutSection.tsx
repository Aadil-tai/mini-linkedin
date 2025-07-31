"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/userProfile";

export default function AboutMeSection({ userId }: { userId?: string }) {
  const { profile, loading, error } = useProfile(userId);

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {}
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found.</div>;

  const toggleAccordion = (section: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div>
      <Accordion
        title="About"
        isOpen={!!openAccordions.about}
        onToggle={() => toggleAccordion("about")}
      >
        <p>{profile.bio || "No bio available."}</p>
      </Accordion>

      <Accordion
        title="Skills"
        isOpen={!!openAccordions.skills}
        onToggle={() => toggleAccordion("skills")}
      >
        {profile.skills && profile.skills.length > 0 ? (
          <ul>
            {profile.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>No skills listed.</p>
        )}
      </Accordion>

      <Accordion
        title="Experience"
        isOpen={!!openAccordions.experience}
        onToggle={() => toggleAccordion("experience")}
      >
        <p>
          {profile.job_title || "No job title"} at{" "}
          {profile.company || "No company info"}
        </p>
      </Accordion>

      <Accordion
        title="Contact"
        isOpen={!!openAccordions.contact}
        onToggle={() => toggleAccordion("contact")}
      >
        <p>Email: {profile.email || "No email provided"}</p>
        <p>Phone: {profile.phone || "No phone number"}</p>
        {profile.website && (
          <p>
            Website:{" "}
            <a href={profile.website} target="_blank" rel="noopener noreferrer">
              {profile.website}
            </a>
          </p>
        )}
        {profile.location && <p>Location: {profile.location}</p>}
      </Accordion>

      <Accordion
        title="Company Info"
        isOpen={!!openAccordions.companyInfo}
        onToggle={() => toggleAccordion("companyInfo")}
      >
        <p>Company Size: {profile.company_size || "N/A"}</p>
        <p>Industry: {profile.industry || "N/A"}</p>
      </Accordion>

      <Accordion
        title="User Info"
        isOpen={!!openAccordions.userInfo}
        onToggle={() => toggleAccordion("userInfo")}
      >
        <p>First Name: {profile.first_name || "N/A"}</p>
        <p>Last Name: {profile.last_name || "N/A"}</p>
        <p>Full Name: {profile.full_name || "N/A"}</p>
      </Accordion>

      <Accordion
        title="Account Timestamps"
        isOpen={!!openAccordions.timestamps}
        onToggle={() => toggleAccordion("timestamps")}
      >
        <p>
          Created At:{" "}
          {profile.created_at
            ? new Date(profile.created_at).toLocaleString()
            : "N/A"}
        </p>
        <p>
          Updated At:{" "}
          {profile.updated_at
            ? new Date(profile.updated_at).toLocaleString()
            : "N/A"}
        </p>
      </Accordion>

      {profile.avatar_url && (
        <Accordion
          title="Avatar"
          isOpen={!!openAccordions.avatar}
          onToggle={() => toggleAccordion("avatar")}
        >
          <img
            src={profile.avatar_url}
            alt="User Avatar"
            style={{ maxWidth: "150px", borderRadius: "8px" }}
          />
        </Accordion>
      )}
    </div>
  );
}

function Accordion({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <div
        onClick={onToggle}
        style={{
          cursor: "pointer",
          background: "#eee",
          padding: "8px",
          fontWeight: "600",
          userSelect: "none",
        }}
        aria-expanded={isOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        {title}
      </div>
      {isOpen && <div style={{ padding: "8px" }}>{children}</div>}
    </div>
  );
}
