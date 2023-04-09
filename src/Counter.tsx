import { routeState, useQS, useQsState } from "./Router/Router";

export const Counter = () => {
  const { count } = useQsState({ count: routeState.qs.count });
  return <div>Counter</div>;
};
