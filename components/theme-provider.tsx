"use client";

import * as React from "react";

export function ThemeProvider({
  children,
  ..._props
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
