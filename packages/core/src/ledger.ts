import * as crypto from 'crypto';    //we addes @types/node as crypto is now a builtin function in node and we imported * because crypto has no default imports.
import { LedgerEntry, LedgerEntryInput, Transaction, TransactionInput } from './types';



export function generateHash(entry: LedgerEntryInput): string {  //this function generates a hash for the ledger entry and returns it as a string
    const payload = `${JSON.stringify(entry.data)}|${entry.timestamp}|${entry.prevHash || ''}`;  //here we are creating a payload that is a string of the data, timestamp, and previous hash , we used | to separate the data
    return crypto.createHash('sha256').update(payload).digest('hex');  //here we are creating a hash of the payload using the sha256 algorithm
}

export function createEntry(entry: Omit<LedgerEntry, 'hash' | 'timestamp'>, timestamp: string): LedgerEntry {
    const hash = calculateHash({...entry, timestamp});
    return {
        ...entry,
        timestamp,
        hash
    };
}

export function createTransaction(input: TransactionInput): Transaction {
    const {userId, from, to, amount, prevHash} = input;
    const timestamp = new Date().toISOString();

    const debit = createEntry({
        account: from,
        userId,
        type: 'debit',
        amount,
        prevHash
    }, timestamp);

    const credit = createEntry({
        account: to,
        userId,
        type: 'credit',
        amount,
        prevHash: debit.hash
    }, timestamp);

    return {debit, credit};
}

function calculateHash(entry: Omit<LedgerEntry, 'hash'>): string {
    // Simple hash implementation - in production, use a proper cryptographic hash
    const data = JSON.stringify(entry);
    return Buffer.from(data).toString('base64');
}


