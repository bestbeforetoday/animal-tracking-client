export type Species = "SHEEP_GOAT" | "CATTLE" | "PIG" | "DEER" | "OTHER";

export type MovementStatus = "IN_FIELD" | "IN_TRANSIT";

export type ProductionType = "MEAT" | "WOOL" | "DAIRY" | "BREEDING" | "OTHER";

export interface Animal {
    description: string;
    dob: Date;
    id: string;
    location: string;
    movementStatus: MovementStatus;
    owner: string;
    productionType: ProductionType;
    species: Species;
}

export interface Location {
    description: string;
    gpsLocation: string;
    id: string;
    operator: string;
}

export interface Owner {
    address: string;
    email: string;
    id: string;
}
