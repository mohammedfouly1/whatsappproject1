/* eslint-disable react/destructuring-assignment */
import Head from 'next/head';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

export default function Layout(props) {
  return (
    <>
      <Provider store={store}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        {props.children}
      </Provider>
    </>
  );
}
