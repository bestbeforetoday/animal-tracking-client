import { Contract } from "fabric-network";

import { Animal } from "./definitions";

export class AnimalTracking {
    private contract: Contract;

    public constructor(contract: Contract) {
        this.contract = contract;
    }

    public async setupDemo(): Promise<void> {
        await this.contract.submitTransaction("setupDemo");
    }

    public async register(animal: Animal): Promise<string> {
        const animalJson = JSON.stringify(animal);
        const buffer = await this.contract.submitTransaction("register", animalJson);
        return buffer.toString("utf8");
    }

    public async depart(animalId: string): Promise<void> {
        await this.contract.submitTransaction("depart", animalId);
    }

    public async arrive(animalId: string, locationId: string): Promise<void> {
        await this.contract.submitTransaction("arrive", animalId, locationId);
    }

    public async trade(animalId: string, ownerId: string): Promise<void> {
        await this.contract.submitTransaction("trade", animalId, ownerId);
    }

    public async slaughter(animalId: string): Promise<void> {
        await this.contract.submitTransaction("slaughter", animalId);
    }
}
