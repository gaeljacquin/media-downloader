import { ReactElement, createContext, useContext, useState } from 'react';

export enum View {
  Home,
  Settings
}

interface ViewContextProps {
  view: View | null;
  switchView: (view: View) => void;
}

const ViewContext = createContext<ViewContextProps>({
  view: View.Home,
  switchView: () => null,
});

export const useView = () => useContext(ViewContext);

export const ViewProvider = ({ children }: { children: ReactElement }) => {
  const [view, setView] = useState(View.Home);

  const switchView = (newView: View) => {
    setView(newView);
  };

 return (
    <ViewContext.Provider value={{ view, switchView }}>
      {children}
    </ViewContext.Provider>
  )
}
