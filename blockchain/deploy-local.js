import { network } from "hardhat";
import fs from "fs";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const walletClients = await viem.getWalletClients();

const walletClient = walletClients[0];

const artifact = JSON.parse(
    fs.readFileSync(
        "./artifacts/contracts/GeoLedger.sol/GeoLedger.json",
        "utf8"
    )
);

const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
});

const receipt = await publicClient.waitForTransactionReceipt({
    hash,
});

console.log("=================================");
console.log("GeoLedger deployed successfully!");
console.log("=================================");
console.log("Contract address:", receipt.contractAddress);
console.log("Transaction hash:", hash);

// 1. Sync ABI artifact to backend/blockchain/GeoLedger.json
try {
    const backendBlockchainDir = "../backend/blockchain";
    if (!fs.existsSync(backendBlockchainDir)) {
        fs.mkdirSync(backendBlockchainDir, { recursive: true });
    }
    fs.writeFileSync(
        `${backendBlockchainDir}/GeoLedger.json`,
        JSON.stringify(artifact, null, 2)
    );
    console.log("Synchronized ABI artifact to backend/blockchain/GeoLedger.json");
} catch (e) {
    console.warn("Could not copy ABI to backend:", e.message);
}

// 2. Safely update BLOCKCHAIN_CONTRACT_ADDRESS in backend/.env without overwriting other vars
try {
    const envPath = "../backend/.env";
    if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, "utf8");
        if (envContent.includes("BLOCKCHAIN_CONTRACT_ADDRESS=")) {
            envContent = envContent.replace(
                /BLOCKCHAIN_CONTRACT_ADDRESS=.*/,
                `BLOCKCHAIN_CONTRACT_ADDRESS=${receipt.contractAddress}`
            );
        } else {
            envContent += `\nBLOCKCHAIN_CONTRACT_ADDRESS=${receipt.contractAddress}\n`;
        }
        fs.writeFileSync(envPath, envContent);
        console.log("Safely updated BLOCKCHAIN_CONTRACT_ADDRESS in backend/.env");
    }
} catch (e) {
    console.warn("Could not update backend/.env:", e.message);
}

// 3. Write deployed address record
fs.writeFileSync(
    "./deployed-address.json",
    JSON.stringify(
        {
            contractAddress: receipt.contractAddress,
            transactionHash: hash,
            deployedAt: new Date().toISOString(),
        },
        null,
        2
    )
);