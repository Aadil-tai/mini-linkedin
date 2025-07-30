"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { FormButton } from "@/components/forms/FormButton";
import { ImageIcon, X, Video, BarChart, Smile } from "lucide-react";
import { supabase } from "@/lib/superbase/client";
import type { Post } from "@/lib/superbase/postActions";

interface CreatePostProps {
  onPostCreated?: (newPost: Post) => void;
  userProfile?: {
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
    job_title?: string;
  };
}

export default function CreatePost({
  onPostCreated,
  userProfile,
}: CreatePostProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Debug: Log userProfile prop
  console.log("CreatePost - userProfile prop:", userProfile);

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
        .select("id")
        .eq("id", user.id) // Changed from "user_id" to "id"
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
        console.log("Uploading image:", image.name, "Size:", image.size);
        imageUrl = await uploadImageToImgBB(image);
        console.log("Image uploaded, URL:", imageUrl);
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
        profiles (
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

      console.log("Post created successfully with data:", newPost);

      // Reset form
      setContent("");
      removeImage();
      setIsExpanded(false);

      // Notify parent if needed
      if (onPostCreated && newPost) {
        onPostCreated(newPost as Post);
      }

      console.log("Post created successfully!");
    } catch (error) {
      console.error("Post creation error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userName =
    userProfile?.first_name && userProfile?.last_name
      ? `${userProfile.first_name} ${userProfile.last_name}`
      : "User";

  // Debug: Log computed values
  console.log("CreatePost - userName:", userName);
  console.log("CreatePost - avatar_url:", userProfile?.avatar_url);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex space-x-3">
        <img
          src={
            userProfile?.avatar_url ||
            "https://via.placeholder.com/48x48?text=" + (userName[0] || "U")
          }
          alt={userName}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div className="flex-1">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full text-left p-3 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
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
                  <img
                    src={imagePreview}
                    alt="Preview"
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
