import ProfileHeader from "./[id]/components/ProfileHeader";
import BusinessSection from "./[id]/components/BusinessSection";
import InterestsSection from "./[id]/components/InterestsSection";
import ConnectionActions from "./[id]/components/ConnectionActions";

interface MemberProfileProps {
  params: {
    id: string;
  };
}

export default function MemberProfile({ params }: MemberProfileProps) {
  // In a real app, you would fetch member data here using the ID
  const memberData = {
    name: "Jaimi Panchai",
    title: "Core Member",
    location: "jjai heady headh, isdi_222222",
    personalPhone: "9034823483",
    professionalPhone: "9034823483",
    email: "mdhbbc@gmail.com",
    website: "www.abcdesafisdfisdfia@hl.com",
    businessName: "Monitoring Consultants",
    about: "Volutpat ipsum dictum varius purus mauris risus...",
    skills: ["Skill 1", "Skill 2"],
    asks: ["Looking for partnerships"],
    gives: ["Business consulting"],
    events: ["Upcoming Event 1"],
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Back navigation would go here */}

      <ProfileHeader
        name={memberData.name}
        title={memberData.title}
        businessName={memberData.businessName}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <BusinessSection
            about={memberData.about}
            businessName={memberData.businessName}
          />

          <InterestsSection
            skills={memberData.skills}
            asks={memberData.asks}
            gives={memberData.gives}
            events={memberData.events}
          />
        </div>

        <div className="lg:col-span-1">
          <ConnectionActions
            contactInfo={{
              location: memberData.location,
              personalPhone: memberData.personalPhone,
              professionalPhone: memberData.professionalPhone,
              email: memberData.email,
              website: memberData.website,
            }}
          />
        </div>
      </div>
    </div>
  );
}
