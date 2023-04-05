/**
 * @author WMXPY
 * @namespace Util
 * @description Pop Up
 */

const openFallbackWindow = (url: string): Window | null => {

    const newWindow: Window | null = window.open(url, '_blank');

    if (typeof newWindow === 'undefined') {
        return null;
    }

    return newWindow;
};

export const openPopUpWindow = (url: string, width: number, height: number): Window | null => {

    const newWindow: Window | null =
        window.open(url, '_blank', `width=${width},height=${height}`);

    if (typeof newWindow === 'undefined'
        || newWindow === null) {
        return openFallbackWindow(url);
    }

    if (newWindow.closed
        || typeof newWindow.closed === 'undefined') {
        return openFallbackWindow(url);
    }

    return newWindow;
};
