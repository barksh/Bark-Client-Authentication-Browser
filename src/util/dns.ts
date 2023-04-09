/**
 * @author WMXPY
 * @namespace Util
 * @description DNS
 */

import { BarkDNSResolver } from "@barksh/dns-resolver";

export const dnsResolver = BarkDNSResolver.withBrowserDefault();
