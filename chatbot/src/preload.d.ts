export interface ElectronAPI {
    openExternal: (url: string) => void;
  }
  
  declare global {
    interface Window {
      electron: ElectronAPI;
    }
  }