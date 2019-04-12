import firebase                                                        from 'firebase/app';
import React, { useCallback, useEffect, useReducer, memo, useContext } from 'react';
import { forEach, chunk, omit, map }                                   from 'lodash';
import 'firebase/firestore';

import { ACTION_TYPES } from 'consts';

firebase.initializeApp({
  apiKey    : process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId : process.env.REACT_APP_FIREBASE_PROEJCT_ID
});

const db = firebase.firestore();

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOADED_DATA:
      return { ...action.payload };
    case ACTION_TYPES.ADD:
      return {
        ...state,
        data        : (state.data || []).concat(action.payload),
        filteredData: (state.filteredData || []).concat(action.payload)
      };
    case ACTION_TYPES.UPDATE:
      const data                  = state.data.slice();
      const index                 = data.findIndex(i => i.id === action.payload.id);
      data[index]                 = action.payload;
      const filteredData          = state.filteredData.slice();
      const filteredIndex         = filteredData.findIndex(i => i.id === action.payload.id);
      filteredData[filteredIndex] = action.payload;

      return { ...state, data, filteredData };
    case ACTION_TYPES.DELETE:
      return {
        ...state,
        data        : state.data.filter(i => i.id !== action.payload.id),
        filteredData: state.filteredData.filter(i => i.id !== action.payload.id),
      };
    case ACTION_TYPES.SHOW_ALL:
    case ACTION_TYPES.SHOW_ACTIVE:
    case ACTION_TYPES.SHOW_COMPLETED:
      return {
        ...state,
        filteredData: (state.data || []).filter(i => {
          switch (action.type) {
            case ACTION_TYPES.SHOW_ACTIVE:
              return !i.completed;
            case ACTION_TYPES.SHOW_COMPLETED:
              return i.completed;
            default:
              return i;
          }
        }).slice(),
      };
    case ACTION_TYPES.TOGGLE_ALL:
      return {
        ...state,
        filteredData: action.payload,
      };
    default:
      return state;
  }
};

const HomeStateContext   = React.createContext({});
const HomeActionsContext = React.createContext({});

const useHomeStateContext   = () => useContext(HomeStateContext);
const useHomeActionsContext = () => useContext(HomeActionsContext);

const HomeContextProvider = ({ children, collectionName = 'todos' }) => {
  const [state, dispatch] = useReducer(reducer, { loading: true, data: null, filteredData: null });

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await db.collection(collectionName).get();
      const data     = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      dispatch({ type: ACTION_TYPES.LOADED_DATA, payload: { loading: false, data, filteredData: data } });
    };

    fetchData();
  }, []);

  const insertItem = useCallback(async (item) => {
    const doc = db.collection(collectionName).doc();
    dispatch({ type: ACTION_TYPES.ADD, payload: { id: doc.id, ...item } });
    await doc.set(item);
  }, []);

  const updateItem = useCallback(async (item) => {
    dispatch({ type: ACTION_TYPES.UPDATE, payload: item });
    await db.collection(collectionName).doc(item.id).set(omit(item, ['id']), { merge: true });
  }, []);

  const removeItem = useCallback(async (item) => {
    dispatch({ type: ACTION_TYPES.DELETE, payload: item });
    await db.collection(collectionName).doc(item.id).delete();
  }, []);

  const toggleItems = useCallback(async (items) => {
    const filteredItems = map(items, item => {
      return {
        ...item,
        completed: !item.completed,
      };
    });
    dispatch({ type: ACTION_TYPES.TOGGLE_ALL, payload: filteredItems });
    const task  = async (part) => {
      const batch = db.batch();
      forEach(part, item => {
        const ref = db.collection(collectionName).doc(item.id);
        batch.update(ref, omit(item, ['id']));
      });
      return await batch.commit();
    };
    const parts = chunk(filteredItems, 500);
    await Promise.all(map(parts, part => task(part)));
  }, []);

  const filterItems = useCallback((filterBy) => {
    dispatch({ type: filterBy });
  }, []);

  return (
    <HomeActionsContext.Provider value={{
      insertItem,
      updateItem,
      removeItem,
      filterItems,
      toggleItems,
    }}>
      <HomeStateContext.Provider value={{
        ...state,
      }}>
        {children}
      </HomeStateContext.Provider>
    </HomeActionsContext.Provider>
  );
};

export default memo(HomeContextProvider);
export {
  useHomeStateContext,
  useHomeActionsContext,
};