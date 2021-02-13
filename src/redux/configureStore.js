import { createStore } from 'redux';
import { Reducer, initialState } from './reducer';
import { composeWithDevTools } from "redux-devtools-extension";

export const ConfigureStore = () => {
    const composeEnhancer = composeWithDevTools({ name: "nuCampsite" });
    
    const store = createStore(
        Reducer,
        initialState,
        composeEnhancer(),
    );

    return store;
};
