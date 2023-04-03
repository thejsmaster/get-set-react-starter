import { useQsState } from "./Router/Router";

export const Counter = () => {
  const { count } = useQsState({ count: 0 });
  return <div>Counter</div>;
};
