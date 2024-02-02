"use client";
import Link from "next/link";
// CUSTOM COMPONENTS
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AuthCardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}: AuthCardWrapperProps) {
  return (
    <Card className="w-[80vw] shadow-lg md:max-w-[480px] lg:min-w-[640px]">
      <CardHeader className="flex flex-col items-center justify-center gap-y-3">
        <div className="relative h-16 w-60">
          <Image src="/pmi_logo.png" alt="PMI" fill />
        </div>
        <p className="text-base text-gray-500">{headerLabel}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {backButtonLabel && backButtonHref && (
        <CardFooter className="flex flex-col gap-3">
          <Button
            variant="link"
            className="w-full font-normal"
            size="sm"
            asChild
          >
            <Link href={backButtonHref}>{backButtonLabel}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
