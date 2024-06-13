/* eslint-disable react/jsx-props-no-spreading */
import '../styles/globals.css';
import '../styles/nprogress.css';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import { LinearProgress } from '@material-ui/core';
import NProgress from 'nprogress';
import Layout from '../components/Layout';
import AuthProvider from '../Context/Authcontext';

function MyApp({ Component, pageProps }) {
  // const [topLoading, setTopLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    function handleRouteChangeStart() {
      NProgress.start();
      // setTopLoading(false);
    }
    function handleRouteChangeEnd() {
      NProgress.done();
      // setTopLoading(true);
    }

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [router]);

  return (
    <AuthProvider>
      <Layout>

        {/* <LinearProgress hidden={topLoading} /> */}

        <Component {...pageProps} />

      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
