import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import authReducer from './reducer/authReducer';

// ✅ Avoid using localStorage on server
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined'
  ? createWebStorage('local')
  : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  authStore: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});








// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // uses localStorage
// import authReducer from './reducer/authReducer';

// const rootReducer = combineReducers({
//     authStore: authReducer
// });

// const persistConfig = {
//     key: 'root',
//     storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: false,
//         }),
// });

// export const persistor = persistStore(store);








// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// // import persistReducer from 'redux-persist/es/persistReducer';
// import { persistReducer } from 'redux-persist/es/persistReducer';
// import PersistStore from 'redux-persist/es/persistStore';
// import localStorage from 'redux-persist/es/storage';
// import authReducer from './reducer/authReducer';
// // import { persistReducer } from 'redux-persist';

// const rootReducer = combineReducers({
//     authStore: authReducer
// })

// const persistConfig = {
//     key: 'root',
//     storage: localStorage
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer);
// export const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({ serializableCheck: false }),
// })

// export const persistor = PersistStore(store);