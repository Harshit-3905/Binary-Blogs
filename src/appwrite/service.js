import config from "../config/config.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

class Service {
  client = new Client();
  database;
  storage;
  constructor() {
    this.client
      .setEndpoint(config.appwriteURL)
      .setProject(config.appwriteProjectID);
    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    userID,
    author,
  }) {
    try {
      const post = await this.database.createDocument(
        config.appwriteDatabaseID,
        config.appwriteCollectionID,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userID,
          author,
          published_on: new Date().toLocaleDateString("en-GB"),
        }
      );
      return post;
    } catch (error) {
      return null;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      const post = await this.database.updateDocument(
        config.appwriteDatabaseID,
        config.appwriteCollectionID,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
      return post;
    } catch (error) {
      console.error(error);
    }
  }

  async deletePost(slug) {
    try {
      await this.database.deleteDocument(
        config.appwriteDatabaseID,
        config.appwriteCollectionID,
        slug
      );
      return true;
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async getPost(slug) {
    try {
      const post = await this.database.getDocument(
        config.appwriteDatabaseID,
        config.appwriteCollectionID,
        slug
      );
      post.view_count += 1;
      await this.database.updateDocument(
        config.appwriteDatabaseID,
        config.appwriteCollectionID,
        slug,
        {
          view_count: post.view_count,
        }
      );
      return post;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getBlogs(queries = []) {
    try {
      const posts = await this.database.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteCollectionID,
        queries
      );
      return posts;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getTrendingBlogs(
    queries = [Query.orderDesc("view_count"), Query.limit(4)]
  ) {
    try {
      const posts = await this.database.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteCollectionID,
        queries
      );
      return posts;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async uploadFile(file) {
    try {
      const response = await this.storage.createFile(
        config.appwriteBucketID,
        ID.unique(),
        file
      );
      return response;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteFile(fileID) {
    try {
      await this.storage.deleteFile(config.appwriteBucketID, fileID);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  getFilePreview(fileID) {
    return this.storage.getFilePreview(config.appwriteBucketID, fileID);
  }

  async addLike(slug, userID) {
    try {
      const post = await this.database.getDocument(
        config.appwriteDatabaseID,
        config.appwriteCollectionID,
        slug
      );
      post.likes_count += 1;
      post.likes.push(userID);
      const updatedPost = await this.database.updateDocument(
        config.appwriteDatabaseID,
        config.appwriteCollectionID,
        slug,
        {
          likes: post.likes,
          likes_count: post.likes_count,
        }
      );
      return updatedPost;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async removeLike(slug, userID) {
    try {
      const post = await this.database.getDocument(
        config.appwriteDatabaseID,
        config.appwriteCollectionID,
        slug
      );
      post.likes_count -= 1;
      post.likes = post.likes.filter((id) => id != userID);
      const updatedPost = await this.database.updateDocument(
        config.appwriteDatabaseID,
        config.appwriteCollectionID,
        slug,
        {
          likes: post.likes,
          likes_count: post.likes_count,
        }
      );
      return updatedPost;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

const service = new Service();
export default service;
