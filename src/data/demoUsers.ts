import type { User } from "@/types/userTypes";

export const defaultUser: User = {
  id: "user123",
  name: "John Doe",
  email: "john@example.com",
  avatar:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  bio: "Full-stack developer passionate about React, TypeScript, and modern web technologies.",
  joinDate: "2023-01-15",
  role: "user",
  socialLinks: {
    twitter: "https://twitter.com/johndoe",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    website: "https://johndoe.dev",
  },
};

export const guestUser: User = {
  id: "guest123",
  name: "Guest User",
  email: "guest@example.com",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  bio: "Welcome to Binary Blogs! As a guest user, you can explore the platform and experience its features.",
  joinDate: new Date().toISOString().split("T")[0],
  role: "user",
};
