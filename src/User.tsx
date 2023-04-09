import { useEffect, useState } from "react";
import { Photos } from "./photos";
import { Posts } from "./posts";
import {
  routeState,
  updateQS,
  usePath,
  useQS,
  useQsState,
} from "./Router/Router";

export const User = () => {
  const [route, subRoute] = usePath();
  //const [age, setAge] = useState(routeState.qs?.age || 1);
  // const [count, setCount] = useState(routeState.qs.count || 0);
  const { age, username, count } = useQsState(
    {
      age: routeState.qs.age || 1,
      username: routeState.qs.username || false,
      count: routeState.qs.count || 0,
    },
    false
  );

  const updateage = () => {
    let newAge = age + 0.5;
    return parseFloat(newAge.toFixed(2));
  };

  return (
    <div>
      {" "}
      <button onClick={() => updateQS({ count: count + 1 })}>{count}</button>
      <button onClick={() => updateQS({ age: updateage() }, false)}>
        {age.toFixed(2)}
      </button>
      <input
        type="checkbox"
        value={username}
        onChange={(e) => {
          updateQS({ username: !username });
        }}
        checked={username}
      />
      <InnerUser />
      {(subRoute && subRoute === "photos" && <Photos />) ||
        (subRoute === "posts" && <Posts />)}
    </div>
  );
};

const InnerUser = () => {
  const { count } = useQsState({ count: routeState.qs.count || 0 });

  return <div onClick={() => updateQS({ count: count + 1 })}>{count}</div>;
};
