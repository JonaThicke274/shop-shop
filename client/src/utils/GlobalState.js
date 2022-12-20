// createContext: instatiates new context object; to use it to create container to hold global state data and functionality
// useContext: React Hook that allows use of state created from createContext
import React, { createContext, useContext } from "react";
import { useProductReducer } from './reducers';

// Sets new Context object for the store
const StoreContext = createContext();
// Provider: special React component that the app will be wrapped in so it can make state data passed into a prop available to other components
// Consumer: second component of a Context object; means of grabbing and using data the Provider holds
const { Provider } = StoreContext;

// Instantiate initial global state
const StoreProvider = ({ value = [], ...props }) => {
    // state: most updated version of global state object
    // dispatch: method to executed to update state, specifically looks for action object passed
    const [state, dispatch] = useProductReducer({
        products: [],
        cart: [],
        cartOpen: false,
        categories: [],
        currentCategory: ''
    });
    // Use this to confirm it works!
    console.log(state);
    return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };