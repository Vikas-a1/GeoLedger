import { network } from "hardhat";
import fs from "fs";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const walletClients = await viem.getWalletClients();

const owner = walletClients[0];
const newOwner = walletClients[1];

const artifact = JSON.parse(
    fs.readFileSync(
        "./artifacts/contracts/GeoLedger.sol/GeoLedger.json",
        "utf8"
    )
);

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const contract = await viem.getContractAt(
    "GeoLedger",
    contractAddress
);

const propertyId = "SN-TEST-002";

console.log("\n=== 1. REGISTER PROPERTY ===");

const registerHash = await contract.write.registerProperty([
    propertyId,
    owner.account.address
]);

await publicClient.waitForTransactionReceipt({
    hash: registerHash
});

console.log("Property registered");
console.log("Transaction:", registerHash);

console.log("\n=== 2. READ PROPERTY ===");

let property = await contract.read.getProperty([
    propertyId
]);

console.log("Property ID:", property[0]);
console.log("Owner:", property[1]);
console.log("Registered At:", property[2].toString());
console.log("Exists:", property[3]);

console.log("\n=== 3. TRANSFER OWNERSHIP ===");

const transferContract = await viem.getContractAt(
    "GeoLedger",
    contractAddress,
    {
        client: {
            wallet: owner
        }
    }
);

const transferHash = await transferContract.write.transferOwnership([
    propertyId,
    newOwner.account.address
]);

await publicClient.waitForTransactionReceipt({
    hash: transferHash
});

console.log("Ownership transferred");
console.log("Transaction:", transferHash);

console.log("\n=== 4. READ UPDATED PROPERTY ===");

property = await contract.read.getProperty([
    propertyId
]);

console.log("Property ID:", property[0]);
console.log("New Owner:", property[1]);
console.log("Registered At:", property[2].toString());
console.log("Exists:", property[3]);

console.log("\n=== BLOCKCHAIN TEST COMPLETE ===");