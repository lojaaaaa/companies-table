import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="max-w-screen-xl mx-auto py-2 px-8">
    {children}
  </div>
);