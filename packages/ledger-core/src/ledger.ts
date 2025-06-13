import * as crypto from 'crypto';    //we addes @types/node as crypto is now a builtin function in node and we imported * because crypto has no default imports.

export interface LedgerEntryInput {
    data: any;
    timestamp: string;
    prevHash?: string;
  }
  
  export interface LedgerEntry {
    data: any;
    timestamp: string;
    hash: string;
    prevHash?: string;
  }

export function generateHash(entry: LedgerEntryInput): string {  //this function generates a hash for the ledger entry and returns it as a string
    const payload = `${JSON.stringify(entry.data)}|${entry.timestamp}|${entry.prevHash || ''}`;  //here we are creating a payload that is a string of the data, timestamp, and previous hash , we used | to separate the data
    return crypto.createHash('sha256').update(payload).digest('hex');  //here we are creating a hash of the payload using the sha256 algorithm
}

export function createEntry(data: any, prevHash?: string): LedgerEntry {
    const timestamp = new Date().toISOString(); //here we are creating a timestamp for the ledger entry , we use toISOString() to get the current date and time in ISO format
    const hash = generateHash({ data, timestamp, prevHash });
    return {
        data,
        timestamp,
        hash,
        prevHash
    };
}

export function verifyChain(chain: LedgerEntry[]) : {valid: boolean , inValidAt?: number} {
    for(let i= 1; i<chain.length; i++) {
        const prev = chain[i-1];
        const current = chain[i];

        const expectedHash = generateHash({
            data: prev.data,
            timestamp: prev.timestamp,
            prevHash: prev.prevHash
        });

        if(prev.hash!==expectedHash || current.prevHash!==prev.hash){
            return {valid: false, inValidAt: i}
        }
    }
    return {valid : true};
}

