import { Client, Account, ID } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

client.headers['Origin'] = 'http://localhost:3000';

const account = new Account(client);

async function run() {
  try {
    const session = await account.createEmailToken(ID.unique(), "testemailotp123@mailinator.com");
    console.log("Token response:", session);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
