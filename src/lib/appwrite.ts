import { Account, Client, Databases, Storage } from "appwrite";
import { appwriteConfig } from "@/lib/appwriteConfig";

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

void client.ping();

export { client, account, databases, storage };
