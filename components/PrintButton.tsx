import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PrintButtonProps {
  id: string;
}

export function PrintButton({ id }: PrintButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/print/${id}`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <PrinterIcon className="h-4 w-4 flex-shrink-0" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Print article</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
