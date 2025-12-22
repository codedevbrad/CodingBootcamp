'use client'
import { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

interface HintPopoverProps {
  hints: string[];
}

const HintPopover: React.FC<HintPopoverProps> = ({ hints }) => {
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const showNextHint = () => {
    setCurrentHintIndex((prev) => (prev + 1) % hints.length);
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="">
        <Button variant="ghost" className="inline-flex w-fit px-3 py-1.5 text-sm"> 
            Gimme some Hints💡 
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] flex flex-col gap-2 bg-white z-[100]" side='top' align='end' sideOffset={20}>
            <div className='flex justify-end'>
                <span>
                    { currentHintIndex + 1 } / { hints.length } 
                </span> 
            </div>
            <p className="text-sm text-muted-foreground my-4">
                {hints[currentHintIndex]}
            </p>
            { hints.length > 1 && (
                <Button variant="ghost" size="sm" onClick={showNextHint} className="bg-gray-50">
                        Next Hint  
                </Button>
            )}
      </PopoverContent>
    </Popover>
  );
};

export default HintPopover;