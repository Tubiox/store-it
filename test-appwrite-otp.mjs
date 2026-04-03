import { Client, Account, ID } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

const account = new Account(client);

async function run() {
  try {
    const session = await account.createEmailToken("69c6173a001cb4af27b9", "testuseroootp@test.com");
    console.log("Token response:", session);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
