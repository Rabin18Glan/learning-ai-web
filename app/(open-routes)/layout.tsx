import React, { ReactNode } from 'react';
import Footer from '@/components/common/layouts/footer';
import Header from '@/components/common/layouts/header';

type OpenRouteLayoutProps = {
  children: ReactNode;
};

const OpenRouteLayout: React.FC<OpenRouteLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default OpenRouteLayout;
