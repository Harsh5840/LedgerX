import { LedgerEntry, LedgerEntryInput } from './types';
import { generateHash } from './ledger';

export function verifyChain(chain: LedgerEntry[]): { valid: boolean, inValidAt?: number } {
  if (chain.length < 2) {
    return { valid: true };
  }

  for (let i = 1; i < chain.length; i++) {
    const prev = chain[i - 1];
    const current = chain[i];

    if (!prev || !current) {
      return { valid: false, inValidAt: i };
    }

    const expectedHash = generateHash({
      data: {
        userId: prev.userId,
        account: prev.account,
        type: prev.type,
        amount: prev.amount,
        isReversal: prev.isReversal,
        originalHash: prev.originalHash,
      },
      timestamp: prev.timestamp,
      prevHash: prev.prevHash,
    });

    if (prev.hash !== expectedHash || current.prevHash !== prev.hash) {
      return { valid: false, inValidAt: i };
    }
  }

  return { valid: true };
}
