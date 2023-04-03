import { useEffect, useState } from "react";
import { routeState, updateQS, usePath, useQsState } from "./Router/Router";

export const User = () => {
  const [route, subRoute] = usePath();
  //const [age, setAge] = useState(routeState.qs?.age || 1);
  const { age, username } = useQsState({ age: 1, username: false }, false);
  const [count, setCount] = useState(0);

  const updateage = () => {
    let newAge = age + 0.5;
    return parseFloat(newAge.toFixed(2));
  };

  return (
    <div>
      {" "}
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <button onClick={() => updateQS({ age: updateage() }, false)}>
        {age.toFixed(2)}
      </button>
      <input
        type="checkbox"
        value={username}
        onChange={(e) => {
          updateQS({ username: !username });
        }}
      />
      User route <b>{route}</b> subRoute <b>{subRoute}</b>
    </div>
  );
};
