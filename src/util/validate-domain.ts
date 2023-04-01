/**
 * @author WMXPY
 * @namespace Util
 * @description Validate Domain
 */

export const validateDomain = (domain: string): boolean => {

    const regex: RegExp = new RegExp(
        '^[a-z0-9-]+.([a-z0-9-]+.)*[a-z0-9-]+$',
    );
    return regex.test(domain);
};
