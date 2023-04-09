import { Counter } from "../Counter";
import { Header } from "../Header";
import { User } from "../User";
import { TRoute } from "./Router";

export type TRoutes = {
  [key: string]: TRoute;
};
export const Routes = {
  header: {
    paths: ["*"],
    component: Header,
  },
  cai: {
    paths: ["/count", "/count/age", "/count/age/10"],
    component: Counter,
    roles: ["user"],
  },
  pai: {
    paths: ["/user", "/user/photos", "/user/posts"],
    component: User,
    roles: ["user"],
  },
};

// createComponent(()=>{}, )
// onLoad: get url and update state, next when state changes, navigate to a new url / qs.
// almost like prop: count, setCount props; are passed a component.
// navigation aproach:
// Link=> updates qs and re-renders component
// navigate => updates qs and re-render component;
// state change aproach: tieing the url/qs to a app state. (custom hooks)

// silent router
/// new idea: silent routing
/// Router Component : onMount => grab url, and qs, hash. and makes it available for the app in a module
/// anytime, the state changes, it'll update the route silently:
/// { updateQS({count}, {replace:false, forceReload:true}) }, [count]
/// {addPath("test")} or usePath("test"); // adds a new path to /counter/test silently.
///
/// <Link path={""} qs={{}} hash={''} />
/// navigate("/user", {count:0});
/// and when the internal navigation happens (Link, Navigate, back button), it'll re-render component.

/// internal routing (sub) in a component:

///
