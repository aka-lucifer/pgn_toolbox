import { Client } from "../../client";
import { CuffsManager } from "./cuffs";
import { InteractionsManager } from "./interactions";

export class PoliceManager {
    private client: Client;
    public cuffsManager: CuffsManager;
    public interactionsManager: InteractionsManager;
    
    constructor(client: Client) {
        this.client = client;

        // Managers
        this.cuffsManager = new CuffsManager(this);
        this.interactionsManager = new InteractionsManager(this);
    }
}