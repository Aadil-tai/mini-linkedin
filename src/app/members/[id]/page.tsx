import ConnectionCard from "@/components/profile/ConnectSection";
import AboutMeSection from "@/components/profile/AboutSection";
import MemberProfileLayout from "./MembersLayout";
import { supabase } from "@/lib/superbase/client";

interface MemberProfileProps {
  params: {
    id: string;
  };
}

export default async function MemberProfile({ params }: MemberProfileProps) {
  // Fetch member profile from Supabase using params.id
  const { data: member, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", params.id)
    .single();

  if (error || !member) {
    // Handle error display or fallback UI
    return (
      <div className="p-8 text-center text-red-600">
        Profile not found or error occurred.
      </div>
    );
  }

  // Map Supabase data to expected contactInfo prop keys
  const contactInfo = {
    location: member.location ?? "N/A",
    personalPhone: member.personal_phone ?? "N/A", // Adjust field names as per your DB schema
    professionalPhone: member.professional_phone ?? "N/A",
    email: member.email ?? "N/A",
    website: member.website ?? "N/A",
  };

  return (
    <MemberProfileLayout>
      <div className="mx-auto flex gap-4 px-4 py-8">
        <div className="lg:col-span-1 space-y-6">
          <ConnectionCard contactInfo={contactInfo} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <AboutMeSection userId={params.id} />
        </div>
      </div>
    </MemberProfileLayout>
  );
}
