import { useState } from "react";
import { updateQS, useQsState } from "./Router/Router";

const HeaderState = {
  brands: ["one", "two", "three"],
};
export const Header = () => {
  const { brand } = useQsState({ brand: "one" });
  // const { brand } = console.log("brand", brand);
  return (
    <div>
      <select
        onChange={(e) => updateQS({ brand: e.target.value })}
        value={brand}
      >
        {HeaderState.brands.map((item, index) => (
          <option key={index}>{item}</option>
        ))}
      </select>
    </div>
  );
};
