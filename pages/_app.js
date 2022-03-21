import Head from "next/head";
import { ToastProvider } from "react-toast-notifications";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Sistema Administrativo Gimnasia</title>
      </Head>
      <ToastProvider autoDismiss={true} autoDismissTimeout="4000">
        <Component {...pageProps} />
      </ToastProvider>
    </div>
  );
}

export default MyApp;
