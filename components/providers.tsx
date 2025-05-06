'use client';

import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
import { store } from '@/store/store';
import { SessionProvider } from 'next-auth/react';

interface Props extends ThemeProviderProps {
  children: React.ReactNode;
}

export function Providers({ children, ...themeProps }: Props) {
  return (
    <SessionProvider>
    <ReduxProvider store={store}>
      <NextThemesProvider {...themeProps}>
        {children}
      </NextThemesProvider>
    </ReduxProvider>
    </ SessionProvider >
  );
}
