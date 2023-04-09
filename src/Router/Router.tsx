// const useRouter = ({qs:{id:"10"}})=>{
// }
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useGetSet } from "../../node_modules/get-set-react/index";
function removeNulls(obj: any) {
  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (
      value !== null &&
      key !== null &&
      value !== undefined &&
      key !== undefined
    ) {
      result[key] = value;
    }
  }

  return result;
}
function parseQsSmartly(
  queryString: string,
  options = {
    floatDemical: 3,
  }
) {
  const query = new URLSearchParams(queryString);
  const result: any = {};

  for (const [key, value] of query.entries()) {
    if (!value) {
      // Ignore null and undefined values
      continue;
    }
    if (/^\d+$/.test(value)) {
      // Value contains only numbers, parse as integer
      result[key] = parseInt(value, 10);
    } else if (/^\d+\.\d+$/.test(value)) {
      // Value contains floating point number, parse as float with 2 decimals
      result[key] = parseFloat(parseFloat(value).toFixed(options.floatDemical));
    } else if (
      value.toLowerCase() === "true" ||
      value.toLowerCase() === "false"
    ) {
      // Value is 'true' or 'false', parse as boolean
      result[key] = value.toLowerCase() === "true";
    } else if (value.toLowerCase() === "null") {
      // Value is 'null', parse as null
      result[key] = null;
    } else if (value.toLowerCase() === "undefined") {
      // Value is 'undefined', parse as undefined
      result[key] = undefined;
    } else {
      // Value is a string
      result[key] = value;
    }
  }

  return result;
}

function parseQSAdvanced(queryString: string = "") {
  const query = new URLSearchParams(queryString);
  const result: any = {};

  for (const [key, value] of query.entries()) {
    if (key.startsWith("n_")) {
      const parsedValue = parseInt(value, 10);
      result[key] = !isNaN(parsedValue) ? parsedValue : 0;
    } else if (key.startsWith("f_")) {
      const parsedValue = parseFloat(value);
      result[key] = !isNaN(parsedValue) ? parsedValue : 0;
    } else if (key.startsWith("b_")) {
      result[key] = value.toLowerCase() === "true";
    } else {
      result[key] = value;
    }
  }

  return result;
}
export const clearQS = () => {};
export const routeState = {
  path: window.location.pathname,
  activeRoute: {} as any,
  qs: {} as any,
  path_array: [] as any,
  renderComponent: null as null | Function,
  hideKeys: [] as any,
  setPath(val: string = "/") {
    if (val && typeof val === "string") {
      this.path = val;
      this.path_array = this.path.split("/").splice(1);
    }
  },
  setQS(val: any) {
    if (typeof val === "object") {
      this.qs = removeNulls(val);
    }
  },
  navigateTo(
    path: string = "/",
    options: { qs?: any; replace?: boolean } = {
      qs: {},
      replace: false,
    }
  ) {
    console.log(options.qs);
    this.setPath(path);
    if (options && options.qs && typeof options.qs === "object") {
      this.setQS({ ...this.qs, ...options.qs });
    }
    this.updateURL(options.replace);
  },
  updateURL(replace: boolean = false) {
    let qsValid = this.qs;

    const newUrl = this.path + "?" + objToQueryString(this.qs);
    if (newUrl !== location.pathname + location.search) {
      replace
        ? history.replaceState({}, "", newUrl)
        : history.pushState({}, "", newUrl);
    }
  },
  //updateQS: (qs: any = {}) => {},
};
routeState.setQS(parseQsSmartly(window.location.search));

export const updateQS = (qs = {}, replace = true, removeKeys = []) => {
  if (removeKeys.length) {
    removeKeys.forEach((key) => {
      delete qs[key];
    });
  }
  routeState.navigateTo(routeState.path, { qs, replace });
};

type RouteConfig = {
  paths: string[];
  component: React.FC;
  roles?: string[];
};

type RouterProps = {
  routes: { [key: string]: RouteConfig };
  userRoles?: string[];
  FallbackComponent: FunctionComponent;
  UnAuthorized?: FunctionComponent;
  alwaysMount?: FunctionComponent[];
};
function useBeforeMount(callback: any, cleanup?: any) {
  const isMountedRef = useRef(false);
  // const cleanupRef = useRef<any>(null);

  if (!isMountedRef.current) {
    isMountedRef.current = true;
    callback();
  }
  useEffect(() => {
    return cleanup ? cleanup() : () => {};
  }, []);
}
let Component: any = null;
let activeRoute: any = null;
export const Router: React.FC<RouterProps> = ({
  routes,
  userRoles = [],
  FallbackComponent,
  UnAuthorized,
  alwaysMount,
}) => {
  console.log("in router");
  useGetSet([routeState]);
  const pathname = window.location.pathname;

  const ActiveRoute: any = useMemo(() => {
    const route = Object.values(routes).find((r) =>
      pathMatchesArray(pathname, r.paths)
    );
    return route;
  }, [routes, userRoles, routeState.path]);

  const Component = useMemo(() => {
    let Component = FallbackComponent;
    if (ActiveRoute && ActiveRoute.component) {
      if (
        ActiveRoute.roles &&
        ActiveRoute.roles.length > 0 &&
        !ActiveRoute.roles.some((r: any) => userRoles.includes(r))
      ) {
        Component = UnAuthorized ? UnAuthorized : () => <h1>Unauthorized</h1>;
      }
      Component = ActiveRoute.component;
    }
    return Component;
  }, [ActiveRoute]);

  useEffect(() => {
    const updateStateFromUrl = () => {
      routeState.setPath(window.location.pathname);
      routeState.setQS(parseQsSmartly(window.location.search));
    };
    window.addEventListener("popstate", updateStateFromUrl);
    return () => {
      console.log("router cleanup");
      window.removeEventListener("popstate", updateStateFromUrl);
    };
  }, []);

  //});
  return (
    <>
      {alwaysMount &&
        alwaysMount.length > 0 &&
        alwaysMount.map((AlwaysMountComponent: any, index: any) => (
          <AlwaysMountComponent key={index} />
        ))}
      {Component ? <Component /> : <FallbackComponent />}
    </>
  );
};

function pathMatchesArray(path: string, matches: string[]): boolean {
  for (const match of matches) {
    if (match.includes("*")) {
      const matchSegments = match.split("/");
      const pathSegments = path.split("/");
      if (matchSegments.length !== pathSegments.length) {
        continue;
      }
      let isMatch = true;
      for (let i = 0; i < matchSegments.length; i++) {
        const matchSegment = matchSegments[i];
        const pathSegment = pathSegments[i];
        if (matchSegment === "*") {
          continue;
        }
        if (matchSegment !== pathSegment) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        return true;
      }
    } else if (path === match) {
      return true;
    }
  }
  return false;
}

// here is how it works:

type QueryObject = { [key: string]: string };

function qsToObj(search: string): QueryObject {
  const queryObj: QueryObject = {};
  const searchParams = new URLSearchParams(search);
  searchParams.forEach((value, key) => {
    queryObj[key] = value;
  });
  return queryObj;
}

function objToQueryString(obj: any): string {
  const queryParams = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });
  return queryParams.toString();
}

export const useQS = (qs: any, replace: boolean = true) => {
  useEffect(() => {
    if (routeState.path !== routeState.path) {
      let nullIfy: any = {};
      Object.keys(qs).forEach((key) => {
        nullIfy[key] = null;
      });
      updateQS(nullIfy, replace);
    }
  }, []);
  useEffect(() => {
    routeState.navigateTo(routeState.path, {
      qs: { ...qs, ...routeState.qs },
      replace,
    });
  }, [qs, replace]);
  return routeState.qs;
};

export const useQsState = (qs: any, replace: boolean = true) => {
  const [count, setCount] = useState(0);
  const [pathname, setPathname] = useState(routeState.path);
  // useBeforeMount(() => {
  //   setCount(count + 1);
  // });

  useEffect(() => {
    setCount(count + 1);
    //setPathname(routeState.path);
    routeState.navigateTo(routeState.path, {
      qs: { ...qs, ...routeState.qs },
      replace,
    });
    return () => {
      if (routeState.path !== pathname) {
        let nullIfy: any = {};
        Object.keys(qs).forEach((key) => {
          nullIfy[key] = null;
        });
        updateQS(nullIfy, replace);
      }
    };
  }, []);
  useDependencyChangeEffect(() => {
    // everytime the props change and if it's not the first time
    if (count !== 0) {
      // update the qs. silently.
      routeState.navigateTo(routeState.path, { qs, replace });
      setCount(count + 1);
    }
  }, [qs, replace]);

  return routeState.qs;
  // in user component that uses this: =>  useQS({id:count}, )
};

export function usePath() {
  let pathArr = window.location.pathname.split("/").splice(1);

  return pathArr;
}

export function useDependencyChangeEffect(callback: any, dependencies: any) {
  const previousDependenciesRef = useRef(null);

  const handleDependenciesChange = useCallback(() => {
    const dependenciesChanged =
      JSON.stringify(dependencies) !==
      JSON.stringify(previousDependenciesRef.current);
    if (dependenciesChanged) {
      callback();
      previousDependenciesRef.current = dependencies;
    }
  }, [callback, dependencies]);

  handleDependenciesChange();

  return handleDependenciesChange;
}

export const Link = ({ path = "/", qs = {}, children, to: any }: any) => {
  return (
    <div
      onClick={() => {
        routeState.navigateTo(path, { qs });
      }}
    >
      {children && children}
    </div>
  );
};

export type TRoute = {
  paths: string[];
  component: any;
  roles: string[];
  qsKeys: string[];
};
