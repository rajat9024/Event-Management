"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProvider appearance={{ baseTheme: dark }}>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
