import * as crypto from 'crypto';    //we addes @types/node as crypto is now a builtin function in node and we imported * because crypto has no default imports.

export interface LedgerEntryInput {
    data: any;
    timestamp : string;
    prevHash? : string; 
}

export function generateHash(entry: LedgerEntryInput): string {
    const payload = `${JSON.stringify(entry.data)}|${entry.timestamp}|${entry.prevHash || ''}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
}