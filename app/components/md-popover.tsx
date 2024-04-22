"use client";

import { Button, buttonVariants } from "@/app/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"

type MDPopoverProps = {
  buttonText: string
  buttonClasses: string
  handleClick: () => void
}

export default function MDPopover({ ...props }: MDPopoverProps) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={`${props.buttonClasses}`}>
            {props.buttonText}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Confirm</h4>
              <p className="text-sm text-muted-foreground">This action cannot be undone!</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={props.handleClick}
            >
              I understand
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
