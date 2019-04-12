import React, { memo } from 'react';
import 'firebase/firestore';

import HomeContextProvider from './context';
import Header              from './components/Header';
import Main                from './components/Main';
import Footer              from './components/Footer';

const Home = () => {
  return (
    <HomeContextProvider>
      <Header/>
      <Main/>
      <Footer/>
    </HomeContextProvider>
  );
};

export default memo(Home);