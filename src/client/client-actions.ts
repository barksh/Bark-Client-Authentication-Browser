/**
 * @author WMXPY
 * @namespace Client
 * @description Client Actions
 */

export type BarkAuthenticationClientAction = () => Promise<void> | void;

export class BarkAuthenticationClientActionManager {

    public static create(): BarkAuthenticationClientActionManager {

        return new BarkAuthenticationClientActionManager();
    }

    private readonly _onSignOutActions: Set<BarkAuthenticationClientAction>;

    private constructor() {

        this._onSignOutActions = new Set();
    }

    public addSignOutAction(action: BarkAuthenticationClientAction): this {

        this._onSignOutActions.add(action);
        return this;
    }

    public async executeSignOutActions(): Promise<void> {

        for (const action of this._onSignOutActions) {
            await Promise.resolve(action());
        }
    }
}
