import config from "../config/config.js";
import { Client, Account, ID } from "appwrite";

class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(config.appwriteURL)
      .setProject(config.appwriteProjectID);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      const data = { email, password };
      if (userAccount) return this.login(data);
      else return null;
    } catch (error) {
      console.error(error);
    }
  }

  async login({ email, password }) {
    try {
      const userAccount = await this.account.createEmailSession(
        email,
        password
      );
      return userAccount;
    } catch (error) {
      return null;
    }
  }
  async loginWithGoogle() {
    try {
      const userAccount = await this.account.createOAuth2Session(
        "google",
        "https://binary-blogs.onrender.com/", // Success URL
        "https://binary-blogs.onrender.com/auth/login" // Failure URL
      );
      return userAccount;
    } catch (error) {
      return null;
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      if (user) return user;
      else return null;
    } catch (error) {
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error(error);
    }
  }
}
const authService = new AuthService();
export default authService;
