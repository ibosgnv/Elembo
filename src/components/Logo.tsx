import Image from "next/image";
import { logo } from "@/data/assets";

/** The official Elembo logotype (downloaded from elembo-rdc.com). Never recoloured. */
export function Logo({ width = 150, priority = false, className = "" }: { width?: number; priority?: boolean; className?: string }) {
  return (
    <Image
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={logo.alt}
      priority={priority}
      className={className}
      style={{ width, height: "auto" }}
      sizes={`${width}px`}
    />
  );
}
