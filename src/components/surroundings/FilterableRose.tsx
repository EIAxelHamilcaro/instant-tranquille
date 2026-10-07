"use client";

import {
  DriveTimeRose,
  type DriveTimeRoseProps,
  type RoseFilterProps,
} from "@/components/surroundings/DriveTimeRose";
import { Button } from "@/components/ui/button";

function RoseFilter({
  className,
  isPressed,
  onPress,
  children,
}: RoseFilterProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      aria-pressed={isPressed}
      onClick={onPress}
    >
      {children}
    </Button>
  );
}

export function FilterableRose(props: Omit<DriveTimeRoseProps, "Filter">) {
  return <DriveTimeRose {...props} Filter={RoseFilter} />;
}
