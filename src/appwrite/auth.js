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

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      if (error.code === 401) return null;
      console.error(error);
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
