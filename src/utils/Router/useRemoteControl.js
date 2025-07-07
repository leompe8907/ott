import { useEffect } from 'react';
import RemoteControlManager from './RemoteControlManager';

const useRemoteControl = (handler) => {
  useEffect(() => {
    RemoteControlManager.setHandler(handler);
    RemoteControlManager.start();

    return () => {
      RemoteControlManager.removeHandler();
      RemoteControlManager.stop();
    };
  }, [handler]); // Reactivarse solo si cambia el handler
};

export default useRemoteControl;