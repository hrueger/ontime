export default function useElectronEvent() {
  const isElectron = window?.process?.type === 'renderer';

  const sendToElectron = (channel: string, args?: string | Record<string, any>) => {
    if (isElectron) {
      window?.ipcRenderer.send(channel, args);
    }
  };

  return { isElectron, sendToElectron };
}
