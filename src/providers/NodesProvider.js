// use reducer to provide nodes

import React, { useContext, useReducer } from "react";

const formReducer = (formData, action) => {
  switch (action.type) {
    case "set-edit": {
      return {
        ...formData,
        id: action.id,
      };
    }
    case "reset": {
      return {
        ...formData,
        id: null,
      };
    }
    case "new-node": {
      return {
        ...formData,
        id: "new",
      };
    }
    default:
      return formData;
  }
};

const initialFormData = {
  id: null,
};

const NodesContext = React.createContext();

const NodesProvider = ({ children }) => {
  const [data, dispatch] = useReducer(formReducer, {
    ...initialFormData,
  });

  return (
    <NodesContext.Provider
      value={{
        data,
        dispatch,
      }}
    >
      {children}
    </NodesContext.Provider>
  );
};

export const useNodesContext = () => {
  const value = useContext(NodesContext);
  return value;
};

export default NodesProvider;
