// lib/constants/posts.ts
export interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    title: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked: boolean;
}

export const dummyPosts: Post[] = [
  {
    id: "1",
    user: {
      name: "Jane Cooper",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      title: "Frontend Developer at Acme",
    },
    content:
      "Just launched our new product! Check it out and let me know what you think. #webdev #react",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    likes: 24,
    comments: 5,
    shares: 2,
    createdAt: "2023-07-28T10:30:00Z",
    isLiked: false,
  },
  {
    id: "2",
    user: {
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      title: "Product Manager at TechCorp",
    },
    content:
      "Excited to share my thoughts on the future of AI in healthcare. Full article in the comments!",
    likes: 42,
    comments: 8,
    shares: 3,
    createdAt: "2023-07-27T15:45:00Z",
    isLiked: true,
  },
];
