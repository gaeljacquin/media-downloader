import { createContext, ReactElement, useContext, useState } from 'react';

interface TerminalOutputContextProps {
  output: string;
  setOutput: (output: string) => void;
}

const TerminalOutputContext = createContext<TerminalOutputContextProps>({
  output: '',
  setOutput: () => null,
});

export const useTerminalOutput = () => useContext(TerminalOutputContext);

export const TerminalOutputProvider = ({ children }: { children: ReactElement }) => {
 const [output, setOutput] = useState('');

  return (
    <TerminalOutputContext.Provider value={{ output, setOutput }}>
      {children}
    </TerminalOutputContext.Provider>
  );
};
