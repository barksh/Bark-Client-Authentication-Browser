/**
 * @author WMXPY
 * @namespace Util
 * @description Sleep
 */

export const sleepWithTimeOut = (duration: number): Promise<void> => {

    return new Promise((
        resolve: () => void,
    ) => {

        setTimeout(() => {
            resolve();
        }, duration);
    });
};
