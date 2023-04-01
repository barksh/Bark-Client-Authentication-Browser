/**
 * @author WMXPY
 * @namespace Util
 * @description Validate Domain
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { validateDomain } from "../../../src/util/validate-domain";

describe("Given [Validate Domain] Helper Methods", (): void => {

    const chance: Chance.Chance = new Chance("util-validate-domain");

    it("should be able to validate domain", async (): Promise<void> => {

        const domain: string = chance.domain();

        const result: boolean = validateDomain(domain);

        expect(result).to.be.true;
    });

    it("should be able to validate domain with subdomain", async (): Promise<void> => {

        const domain: string = chance.domain();

        const result: boolean = validateDomain(`www.${domain}`);

        expect(result).to.be.true;
    });

    it("should be able to validate domain with subdomain and ending", async (): Promise<void> => {

        const domain: string = chance.domain();

        const result: boolean = validateDomain(`www.${domain}.com`);

        expect(result).to.be.true;
    });

    it("should be able to fail for invalid domain", async (): Promise<void> => {

        const domain: string = chance.string();

        const result: boolean = validateDomain(domain);

        expect(result).to.be.false;
    });
});
