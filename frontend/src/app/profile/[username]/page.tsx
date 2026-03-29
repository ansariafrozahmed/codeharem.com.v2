import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ComponentData } from "@/lib/services/component.service";
import ProfileActions from "./ProfileActions";
import ProfileComponentGrid from "./ProfileComponentGrid";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface PublicProfile {
  id: string;
  name: string | null;
  username: string;
  avatar: string | null;
  created_at: string;
  components: ComponentData[];
}

interface PageProps {
  params: Promise<{ username: string }>;
}

async function fetchProfile(username: string): Promise<PublicProfile | null> {
  try {
    const res = await fetch(`${API_URL}/user/profile/${username}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchProfile(username);
  if (!profile) return { title: "User Not Found" };

  return {
    title: `${profile.name || profile.username} - CodeHarem`,
    description: `View ${profile.name || profile.username}'s components on CodeHarem`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await fetchProfile(username);

  if (!profile) notFound();

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mainContainer py-10 md:py-14">
      {/* Profile Header */}
      <div className="mb-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name || profile.username}
            className="h-24 w-24 rounded-full border-2 border-[#2a2a2a]"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-3xl font-bold text-white">
            {(profile.name || profile.username)[0].toUpperCase()}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            {profile.name || profile.username}
          </h1>
          <p className="mt-1 text-gray-400">@{profile.username}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 sm:justify-start">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              Joined {joinDate}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              {profile.components.length} component{profile.components.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Owner actions (edit profile, settings) — client component */}
          <ProfileActions profileUserId={profile.id} username={profile.username} />
        </div>
      </div>

      {/* Components */}
      <div>
        <h2 className="mb-6 text-lg font-semibold text-white">
          Components
        </h2>

        {profile.components.length > 0 ? (
          <ProfileComponentGrid components={profile.components} />
        ) : (
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] px-6 py-16 text-center">
            <svg className="mx-auto mb-3 h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            <p className="text-sm text-gray-400">
              No published components yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
