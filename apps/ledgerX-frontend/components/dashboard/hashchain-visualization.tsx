"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Hash } from "lucide-react";

interface HashchainVisualizationProps {
  transactions: Array<{
    id: string;
    hash: string;
    amount: number;
    timestamp: string;
  }>;
}

export function HashchainVisualization({ transactions }: HashchainVisualizationProps) {
  const chainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chainRef.current) {
      const blocks = chainRef.current.querySelectorAll('.hash-block');
      
      gsap.set(blocks, { scale: 0, opacity: 0 });
      
      gsap.to(blocks, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
    }
  }, [transactions]);

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <Hash className="h-5 w-5 mr-2 text-primary" />
        <h3 className="text-lg font-semibold">Ledger Integrity Chain</h3>
      </div>
      
      <div ref={chainRef} className="flex space-x-2 overflow-x-auto pb-2">
        {transactions.slice(-5).map((tx, index) => (
          <motion.div
            key={tx.id}
            className="hash-block"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-chart-1/20 rounded-lg border-2 border-primary/30 flex flex-col items-center justify-center text-xs">
              <div className="font-mono text-primary">
                {tx.hash.slice(0, 6)}...
              </div>
              <div className="text-muted-foreground mt-1">
                ${Math.abs(tx.amount)}
              </div>
              {index < transactions.length - 1 && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-0.5 bg-primary/50" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground mt-3">
        Each transaction is cryptographically linked, ensuring data integrity
      </p>
    </Card>
  );
}