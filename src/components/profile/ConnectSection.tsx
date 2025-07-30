"use client";

import Image from "next/image";
import type { ReactNode } from "react";

interface ContactInfo {
  location: string;
  personalPhone: string;
  professionalPhone: string;
  email: string;
  website: string;
}

interface ConnectionCardProps {
  name?: string;
  title?: string;
  contactInfo: ContactInfo;
  onDisconnect?: () => void;
}

type ActionIcon = { icon: ReactNode };

const actionIcons: ActionIcon[] = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <path
          d="M16.666 14.607v2.068c0 .598-.484 1.084-1.077 1.018-2.905-.321-5.65-1.707-7.822-3.879-2.173-2.174-3.56-4.919-3.881-7.825A1.016 1.016 0 014.305 4.402h2.071c.482 0 .883.354.965.829l.395 2.275c.072.41-.096.84-.425 1.08l-.918.677a11.579 11.579 0 005.35 5.35l.68-.913c.235-.33.66-.497 1.07-.425l2.276.395c.476.083.83.483.83.966z"
          stroke="#3752D7"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <path
          d="M17 14.75C15.198 14.75 13.477 15.428 12.104 16.631a.997.997 0 01-1.352 0C7.523 15.428 5.802 14.75 4 14.75A2.75 2.75 0 011.25 12V6.5A2.75 2.75 0 014 3.75h12A2.75 2.75 0 0118.75 6.5V12a2.75 2.75 0 01-2.75 2.75z"
          stroke="#3752D7"
          strokeWidth="1.3"
        />
      </svg>
    ),
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <path
          d="M15.833 12.5a2.5 2.5 0 11-2.373 3.207l-6.65-3.26a2.525 2.525 0 110-1.894l6.648-3.262A2.5 2.5 0 1115.833 7.5"
          stroke="#3752D7"
          strokeWidth="1.3"
        />
      </svg>
    ),
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3.75" stroke="#3752D7" strokeWidth="1.3" />
        <circle cx="10" cy="2.5" r="1.25" stroke="#3752D7" strokeWidth="1.3" />
        <circle cx="10" cy="17.5" r="1.25" stroke="#3752D7" strokeWidth="1.3" />
        <circle cx="2.5" cy="10" r="1.25" stroke="#3752D7" strokeWidth="1.3" />
        <circle cx="17.5" cy="10" r="1.25" stroke="#3752D7" strokeWidth="1.3" />
      </svg>
    ),
  },
];

export default function ConnectionCard({
  name = "Jaimi Panchal",
  title = "Core Member",
  contactInfo,
  onDisconnect = () => console.log("Disconnected"),
}: ConnectionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl border border-[#D2D2F3] dark:border-gray-700 max-w-xs mx-auto overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {/* Profile Section */}
      <div className="flex flex-col items-center pt-6 pb-3 relative">
        <div className="relative w-24 h-24">
          <div className="rounded-full border-4 border-[#D2A85B] w-24 h-24 shadow">
            <Image
              src="/profile.jpg"
              fill
              alt={name}
              className="object-cover rounded-full"
              priority
            />
          </div>
          <div className="absolute -top-2 -right-2 bg-[#FFE8B2] rounded-full p-1 border-2 border-white dark:border-gray-800 shadow">
            <svg
              width="26"
              height="26"
              viewBox="0 0 20 20"
              className="text-[#D2A85B]"
            >
              <path
                fill="currentColor"
                d="M10 14.38l-4.04 2.53 1.08-4.57L3 8.97l4.73-.41L10 4.3l2.27 4.26 4.73.41-3.04 3.37 1.08 4.57z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="font-bold text-lg text-[#3752D7] dark:text-blue-400">
            {name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {title}
          </div>
        </div>
      </div>

      {/* Disconnect Button */}
      <div className="flex justify-center my-4">
        <button
          onClick={onDisconnect}
          className="border border-[#3752D7] dark:border-blue-400 text-[#3752D7] dark:text-blue-400 rounded-lg px-8 py-1.5 font-medium hover:bg-[#3752D7] hover:text-white dark:hover:bg-blue-500 text-sm transition"
        >
          Disconnect
        </button>
      </div>

      {/* Action Icons */}
      <div className="flex justify-center gap-5 pb-4">
        {actionIcons.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className="rounded-full bg-[#F4F7FE] dark:bg-gray-700 p-2 shadow hover:bg-[#e6ebfa] dark:hover:bg-gray-600 transition"
            aria-label="action"
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Business Info Section */}
      <div className="bg-[#F3F5FE] dark:bg-gray-800 border-t border-[#D2D2F3] dark:border-gray-700 px-4 pb-4 pt-5 mt-3 text-center">
        <div className="flex justify-center mb-1">
          <svg width={46} height={36} viewBox="0 0 46 36" fill="none">
            <ellipse cx="26" cy="18" rx="15" ry="17" fill="#3C62DC" />
            <ellipse cx="16" cy="18" rx="3" ry="13" fill="#FBA545" />
            <ellipse cx="33" cy="18" rx="4" ry="11" fill="#A4C7F5" />
          </svg>
        </div>
        <p className="font-medium text-black dark:text-white text-base">
          Business Name
        </p>
        <div className="mt-4 text-[13px] space-y-1 text-left">
          <p>
            <span className="text-gray-500 dark:text-gray-400">Location </span>
            <span>{contactInfo.location}</span>
          </p>
          <p>
            <span className="text-gray-500 dark:text-gray-400">Personal: </span>
            <a
              href={`tel:${contactInfo.personalPhone}`}
              className="text-[#3752D7] dark:text-blue-400 hover:underline"
            >
              {contactInfo.personalPhone}
            </a>
          </p>
          <p>
            <span className="text-gray-500 dark:text-gray-400">
              Professional:{" "}
            </span>
            <a
              href={`tel:${contactInfo.professionalPhone}`}
              className="text-[#3752D7] dark:text-blue-400 hover:underline"
            >
              {contactInfo.professionalPhone}
            </a>
          </p>
          <p>
            <span className="text-gray-500 dark:text-gray-400">Email: </span>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-[#3752D7] dark:text-blue-400 hover:underline"
            >
              {contactInfo.email}
            </a>
          </p>
          <p>
            <span className="text-gray-500 dark:text-gray-400">Website: </span>
            <a
              href={contactInfo.website}
              className="text-[#3752D7] dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {contactInfo.website}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
