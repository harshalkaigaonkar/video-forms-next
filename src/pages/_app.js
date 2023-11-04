import React from "react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "@/styles/globals.css";
import ReactQueryProvider from "@/providers/QueryProvider";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <ReactQueryProvider>
      <Component {...pageProps} />
    </ReactQueryProvider>
  );
}
