// tslint:disable:no-console

import {
    FileSystemWallet,
    Gateway,
    GatewayOptions,
    X509WalletMixin,
} from "fabric-network";

import { AnimalTracking } from "./AnimalTracking";
import { Animal } from "./definitions";

import fs = require("fs");
import path = require("path");
import util = require("util");

const readFileAsync = util.promisify(fs.readFile);

const NETWORK_NAME = "mychannel";
const CONTRACT_NAMESPACE = "org.example.animaltracking";
const CONTRACT_NAME = "animal-tracking-contract";
const IDENTITY_LABEL = "user@example.org";
const MSP_NAME = "Org1MSP";

const currentDir = process.cwd();

const WALLET_DIRECTORY = path.join(currentDir, "wallet");
const IDENTITY_CERT_FILE = path.join(currentDir, "certificate.pem");
const IDENTITY_KEY_FILE = path.join(currentDir, "privateKey.pem");
const CCP_FILE = path.join(currentDir, "connection.json");

export class Client {
    public async run(): Promise<void> {
        const animalTracking = await this.createAnimalTracking();
        await animalTracking.setupDemo();

        // Make like a cow
        const cowabunga: Animal = {
            description: "Best cow ever",
            dob: new Date(),
            id: "cowabunga",
            location: "",
            movementStatus: "IN_TRANSIT",
            owner: "bart",
            productionType: "MEAT",
            species: "CATTLE",
        };
        await animalTracking.register(cowabunga);

        // Move like a cow
        await animalTracking.arrive(cowabunga.id, "field1");
        await animalTracking.depart(cowabunga.id);
        await animalTracking.arrive(cowabunga.id, "field2");

        // There is no cow
        await animalTracking.slaughter("cow1");

        // More things here...!
    }

    private async createAnimalTracking(): Promise<AnimalTracking> {
        const wallet = await this.createWallet();
        const gatewayOptions: GatewayOptions = {
            identity: IDENTITY_LABEL,
            wallet,
        };
        const gateway = new Gateway();

        console.log("Reading connection profile file:", CCP_FILE);
        const connectionProfileBuff = await readFileAsync(CCP_FILE);
        const connectionProfile = JSON.parse(connectionProfileBuff.toString("utf8"));

        await gateway.connect(connectionProfile, gatewayOptions);
        const network = await gateway.getNetwork(NETWORK_NAME);
        const contract = network.getContract(CONTRACT_NAME, CONTRACT_NAMESPACE);

        return new AnimalTracking(contract);
    }

    private async createWallet(): Promise<FileSystemWallet> {
        console.log("Using wallet directory:", WALLET_DIRECTORY);
        const wallet = new FileSystemWallet(WALLET_DIRECTORY);

        const identityExists = await wallet.exists(IDENTITY_LABEL);
        if (!identityExists) {
            console.log("Adding identity to wallet");

            console.log("Reading certificate file:", IDENTITY_CERT_FILE);
            const certificatePem = (await readFileAsync(IDENTITY_CERT_FILE)).toString("utf8");

            console.log("Reading private key file:", IDENTITY_KEY_FILE);
            const privateKeyPem = (await readFileAsync(IDENTITY_KEY_FILE)).toString("utf8");

            const identity = X509WalletMixin.createIdentity(MSP_NAME, certificatePem, privateKeyPem);
            await wallet.import(IDENTITY_LABEL, identity);
            console.log("Identity addeed to wallet");
        }

        return wallet;
    }
}
