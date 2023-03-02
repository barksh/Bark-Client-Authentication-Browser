/**
 * @author WMXPY
 * @namespace Placeholder
 * @description Placeholder
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";

describe("Placeholder", (): void => {

    const chance: Chance.Chance = new Chance("placeholder");

    it("Placeholder", async (): Promise<void> => {

        expect(chance.string()).to.be.not.equal(chance.string());
    });
});
