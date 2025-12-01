'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'

const loadingSteps = [
  'Getting Content...',
  'Making it look great...',
  'Ready for action!',
];

function TopicLoadingAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= loadingSteps.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-[70vh] gap-8"
    >
      <h2 className="text-xl font-semibold text-muted-foreground">Preparing Your Content</h2>
      <div className="bg-white dark:bg-zinc-900 border rounded-lg p-6 w-[300px] shadow-md">
        <div className="space-y-4">
          {loadingSteps.map((msg, i) => (
            <motion.div
              key={msg}
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-sm font-medium text-muted-foreground">{msg}</span>
              {step > i ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </motion.div>
          ))}
          {step >= loadingSteps.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-green-600 text-sm font-medium pt-2"
            >
              ✅ All Set!
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


export default function LoadingClient({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setReady(true);
    }, 4000); // Matches checklist duration

    return () => clearTimeout(timeout);
  }, []);

  if (!ready) return <TopicLoadingAnimation />;

  return <>{children}</>;
}
