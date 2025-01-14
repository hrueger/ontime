import { TimerLifeCycle, OscSubscription } from 'ontime-types';

export type TimerLifeCycleKey = keyof typeof TimerLifeCycle;

export default interface IIntegration {
  subscriptions: OscSubscription;
  init: (config: unknown) => OperationReturn;
  dispatch: (action: TimerLifeCycleKey, state?: object) => OperationReturn;
  emit: (...args: unknown[]) => unknown;
  shutdown: () => void;
}

// either went well, or explain what failed
type OperationReturn = ReturnOnSuccess | ReturnOnError;

type ReturnOnSuccess = {
  success: true;
  message?: string;
};

type ReturnOnError = {
  success: false;
  message: string;
};
