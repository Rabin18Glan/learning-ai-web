import React, { ReactNode } from 'react';
import Footer from '@/components/common/layout-components/footer';
import Header from '@/components/common/layout-components/header';

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
