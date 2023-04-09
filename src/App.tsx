import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Link, Router } from "./Router/Router";
import { Routes } from "./Router/Routes";
import { User } from "./User";
import { UnAuthorized } from "./Unauthorized";
import { Header } from "./Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <Link path={Routes.cai.paths[0]} qs={{ count: 1 }}>
        count
      </Link>{" "}
      <Link path="/user/photos" qs={{ age: 9 }}>
        Photos
      </Link>{" "}
      <Link path="/user/posts" qs={{ age: 1 }}>
        posts
      </Link>{" "}
      <Router
        routes={Routes}
        userRoles={["user"]}
        FallbackComponent={() => <div>FallBack</div>}
        UnAuthorized={UnAuthorized}
        alwaysMount={[Header]}
      />
    </div>
  );
}

export default App;
