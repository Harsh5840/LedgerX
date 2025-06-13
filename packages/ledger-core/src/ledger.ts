import * as crypto from 'crypto';    //we addes @types/node as crypto is now a builtin function in node and we imported * because crypto has no default imports.

export interface LedgerEntryInput {
    data: any;
    timestamp: string;
    prevHash?: string;
}
  
export interface LedgerEntry {
    userId: string;
    account: string;
    type: 'debit' | 'credit';
    amount: number;
    timestamp: string;
    hash: string;
    prevHash?: string;
    isReversal?: boolean;
    originalHash?: string;
  }
  

export interface TransactionInput {
    userId: string;
    from: string;
    to: string;
    amount: number;
    prevHash?: string;
}

export interface Transaction {
    debit: LedgerEntry;
    credit: LedgerEntry;
}

export function generateHash(entry: LedgerEntryInput): string {  //this function generates a hash for the ledger entry and returns it as a string
    const payload = `${JSON.stringify(entry.data)}|${entry.timestamp}|${entry.prevHash || ''}`;  //here we are creating a payload that is a string of the data, timestamp, and previous hash , we used | to separate the data
    return crypto.createHash('sha256').update(payload).digest('hex');  //here we are creating a hash of the payload using the sha256 algorithm
}

export function createEntry(data: Omit<LedgerEntry , 'timestamp' | 'hash'>, prevHash?: string): LedgerEntry {   //we removed timestamp and hash from here.
    const timestamp = new Date().toISOString(); //here we are creating a timestamp for the ledger entry , we use toISOString() to get the current date and time in ISO format
    const hash = generateHash({ data, timestamp, prevHash });
    return {
        ...data,   //IMPORTANT , THE DOTS HERE is the spread operator
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
            data: prev,
            timestamp: prev.timestamp,
            prevHash: prev.prevHash
        });

        if(prev.hash!==expectedHash || current.prevHash!==prev.hash){
            return {valid: false, inValidAt: i}
        }
    }
    return {valid : true};
}

export function createTransaction(input: TransactionInput): Transaction {
    const {userId , from , to , amount , prevHash} = input;
    const timestamp = new Date().toISOString();

    const debit = createEntry({
        account: from,
        userId,
        type: 'debit',
        amount,
    }, prevHash);

    const credit = createEntry({
        account: to,
        userId,
        type: 'credit',
        amount, 
    }, debit.hash);     //IMPORTANT     The debit.hash being passed to the credit entry ensures that the two parts of the transaction are cryptographically linked.

    return {debit , credit};

}

export function reverseTransaction(original: Transaction): Transaction {
    const {debit , credit} = original   //we take it from the function parameters , just like req.body which is a function parameter (req,res)
    
    const reversedDebit = createEntry({
        userId: debit.userId,
        account: debit.account,
        type: 'credit',
        amount: debit.amount,
        isReversal: true,
        originalHash: debit.hash
      }, credit.hash);
    
      const reversedCredit = createEntry({
        userId: credit.userId,
        account: credit.account,
        type: 'debit',
        amount: credit.amount,
        isReversal: true,
        originalHash: credit.hash
      }, reversedDebit.hash);
    
      return {
        debit: reversedDebit,
        credit: reversedCredit
      };
    }
