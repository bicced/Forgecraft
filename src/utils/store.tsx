import { createContext, useReducer } from "react";
import { CoinType } from ".";

const initialState: any = {
  balances: {
    [CoinType.WOOD]: 0,
    [CoinType.STONE]: 0,
    [CoinType.CLOTH]: 0,
    [CoinType.AXE]: 0,
    [CoinType.SLING]: 0,
    [CoinType.BAG]: 0,
    [CoinType.HUT]: 0,
  },
  metadata: {},
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }: {children: any} ) => {
  const [state, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case 'SET_BALANCES':
        const balances = action.payload.reduce((result: any, balance: number, index: number) => {
          result[index] = Number(balance);
          return result;
        }, {});
        return { 
          ...state, 
          balances
        };
      case 'SET_METADATA':
        return { 
          ...state,
          metadata: action.payload
        };
      default:
        throw new Error();
    }
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
