1. Router component takes in routes={[]} <Router routes={[]} userRoles={[]} fallbackComponent={User}>

2. RouteState (contains all state related to url: path, host, protocol, qs:{}, qs_string:"", ) and methods to update state: navigateTo

3. (1 way) User Component calls useQS(); useParams(); to work with path and update path or qs;

const {id} = useQS({id:10}); // if the url does not contain anything, it'll set it 10 only on []; and returns that id;

(2nd way) : user COmpnoent imports RouteState,

