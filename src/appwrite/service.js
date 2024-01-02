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

  async createPost({ title, slug, content, featuredImage, status, userID }) {
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
        }
      );
      return post;
    } catch (error) {
      console.error(error);
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
      return post;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
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
        ID.unique,
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
      await this.storage.deleteFile(fileID);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  getFilePreview(fileID) {
    return this.storage.getFilePreview(config.appwriteBucketID, fileID);
  }
}

const service = new Service();
export default service;
