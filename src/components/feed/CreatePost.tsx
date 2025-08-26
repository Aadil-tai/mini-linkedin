"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { FormButton } from "@/components/forms/FormButton";
import { ImageIcon, X, Video, BarChart, Smile } from "lucide-react";
import Image from "next/image";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useProfile } from "@/hooks/userProfile";
import type { Post } from "@/lib/supabase/postActions";

interface CreatePostProps {
  onPostCreated?: (newPost: Post) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Create supabase client
  const supabase = createBrowserSupabase();

  // Use the useProfile hook to get current user's profile
  const { profile, user } = useProfile();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size should be less than 10MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview(null);
  };

  const uploadImageToImgBB = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success && data.data.url) {
        return data.data.url;
      } else {
        console.error("Image upload failed:", data);
        return null;
      }
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !image) {
      alert("Please add some content or an image to your post");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please log in to create a post");
        setIsSubmitting(false);
        return;
      }

      // Fetch the user's profile_id from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, user_id")
        .eq("user_id", user.id) // Use user_id to find the profile
        .single();

      if (profileError || !profile) {
        console.error("Profile error:", profileError);
        alert("User profile not found. Cannot create post.");
        setIsSubmitting(false);
        return;
      }

      let imageUrl = null;

      // Upload image if present
      if (image) {
        imageUrl = await uploadImageToImgBB(image);

        if (!imageUrl) {
          alert("Failed to upload image. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // Insert new post with correct profile_id
      const { data: newPost, error } = await supabase
        .from("posts")
        .insert({
          profile_id: profile.id, // use profile.id here, NOT user.id
          content: content.trim(),
          image_url: imageUrl,
          likes: 0,
          comments: 0,
          shares: 0,
          is_liked: false,
        })
        .select(
          `
        *,
        profiles!posts_profile_id_fkey (
          id,
          user_id,
          first_name,
          last_name,
          avatar_url,
          job_title
        )
      `
        )
        .single();

      if (error) {
        console.error("Error creating post:", error);
        alert("Failed to create post. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Reset form
      setContent("");
      removeImage();
      setIsExpanded(false);

      // Notify parent if needed
      if (onPostCreated && newPost) {
        onPostCreated(newPost as Post);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.full_name ||
        user?.user_metadata?.full_name ||
        user?.email ||
        "User";

  // Get user initials for fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col md:flex-row space-x-3">
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={userName}
            width={48}
            height={48}
            className="w-6 h-6 lg:w-12 lg:h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
            onError={(e) => {
              console.error(
                "Failed to load profile image:",
                profile.avatar_url
              );
              // Hide the image and show fallback
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold ring-2 ring-gray-200 dark:ring-gray-700">
            {getUserInitials(userName)}
          </div>
        )}

        <div className="flex-1">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full text-[8px] md:text-[12px] text-left p-2 md:p-3 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              What do you want to talk about?
            </button>
          ) : (
            <div className="space-y-3">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="What do you want to talk about?"
              />

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={600}
                    height={384}
                    className="w-full max-h-96 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90 transition-opacity"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                <ImageIcon size={20} />
                <span className="text-sm">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </label>

              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Video size={20} />
                <span className="text-sm">Video</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <BarChart size={20} />
                <span className="text-sm">Poll</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Smile size={20} />
                <span className="text-sm">Celebrate</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setContent("");
                  removeImage();
                  setIsExpanded(false);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <FormButton
                onClick={handlePost}
                disabled={(!content.trim() && !image) || isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post"}
              </FormButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
