// 'use client'
// import { persistor, store } from '@/store/store'
// import React from 'react'
// import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/integration/react'
// import Loading from './Loading'

// const GlobalStoreProvider = ({ children }) => {
//   return (
//     <Provider store={store}>
//         <PersistGate persistor={persistor} loading={<Loading/>}>
//             {children}
//         </PersistGate>
//     </Provider>
//   )
// }

// export default GlobalStoreProvider


'use client';

import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from '@/store/store';
import { persistor } from '@/store/persistor'; // ✅ import from new file
import Loading from './Loading';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient()

const GlobalStoreProvider = ({ children }) => {
  return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={<Loading />} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
        <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false}/>
        </Suspense>
      </QueryClientProvider>
  );
};

export default GlobalStoreProvider;
