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
    <Card className="border-input shadow-lg lg:min-w-[640px]">
      <CardHeader>
        <div className="flex w-full flex-col items-center justify-center gap-y-16">
          <div className="relative h-24 w-80">
            <Image src="/pmi_logo.png" alt="PMI" fill />
          </div>
          <p className="text-lg md:text-xl md:font-semibold">{headerLabel}</p>
        </div>
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
