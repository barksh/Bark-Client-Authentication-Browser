/**
 * @author WMXPY
 * @namespace Model
 * @description Configuration
 */

import { BarkPreferenceObject, BarkStorageObject, BarkTempObject, IBarkStorageAgent } from "../storage/declare";
import { decodeBarkPreferenceObject, decodeBarkStorageObject, decodeBarkTempObject, encodeBarkPreferenceObject, encodeBarkStorageObject, encodeBarkTempObject } from "../storage/encoding";
import { BarkLocalStorageAgent } from "../storage/local-storage";

const defaultStorageAgent: IBarkStorageAgent =
    BarkLocalStorageAgent.create();

export class BarkModelConfiguration {

    public static create(selfDomain: string): BarkModelConfiguration {

        return new BarkModelConfiguration(selfDomain);
    }

    private readonly _selfDomain: string;

    private _storageAgent: IBarkStorageAgent = defaultStorageAgent;

    private constructor(selfDomain: string) {

        this._selfDomain = selfDomain;
    }

    public getSelfDomain(): string {
        return this._selfDomain;
    }

    public setStorageAgent(storageAgent: IBarkStorageAgent): this {

        this._storageAgent = storageAgent;
        return this;
    }

    public async persistStorageObject(object: BarkStorageObject): Promise<void> {

        const encodedObject: string = encodeBarkStorageObject(object);
        await this._storageAgent.persistStorage(encodedObject);
    }

    public async loadStorageObject(): Promise<BarkStorageObject> {

        const encodedObject: string = await this._storageAgent.loadStorage();
        return decodeBarkStorageObject(encodedObject);
    }

    public async mutateStorageObject(mutator: (object: BarkStorageObject) => BarkStorageObject): Promise<void> {

        const object: BarkStorageObject = await this.loadStorageObject();
        const mutatedObject: BarkStorageObject = mutator(object);
        await this.persistStorageObject(mutatedObject);
    }

    public async clearStorageObject(): Promise<void> {

        await this._storageAgent.clearStorage();
    }

    public async persistTempObject(object: BarkTempObject): Promise<void> {

        const encodedObject: string = encodeBarkTempObject(object);
        await this._storageAgent.persistTemp(encodedObject);
    }

    public async loadTempObject(): Promise<BarkTempObject> {

        const encodedObject: string = await this._storageAgent.loadTemp();
        return decodeBarkTempObject(encodedObject);
    }

    public async mutateTempObject(mutator: (object: BarkTempObject) => BarkTempObject): Promise<void> {

        const object: BarkTempObject = await this.loadTempObject();
        const mutatedObject: BarkTempObject = mutator(object);
        await this.persistTempObject(mutatedObject);
    }

    public async clearTempObject(): Promise<void> {

        await this._storageAgent.clearTemp();
    }

    public async persistPreferenceObject(object: BarkPreferenceObject): Promise<void> {

        const encodedObject: string = encodeBarkPreferenceObject(object);
        await this._storageAgent.persistPreference(encodedObject);
    }

    public async loadPreferenceObject(): Promise<BarkPreferenceObject> {

        const encodedObject: string = await this._storageAgent.loadPreference();
        return decodeBarkPreferenceObject(encodedObject);
    }

    public async mutatePreferenceObject(mutator: (object: BarkPreferenceObject) => BarkPreferenceObject): Promise<void> {

        const object: BarkPreferenceObject = await this.loadPreferenceObject();
        const mutatedObject: BarkPreferenceObject = mutator(object);
        await this.persistPreferenceObject(mutatedObject);
    }

    public async clearPreferenceObject(): Promise<void> {

        await this._storageAgent.clearPreference();
    }
}
