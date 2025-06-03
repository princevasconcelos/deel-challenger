# 1) What is the difference between Component and PureComponent? give an example where it might break my app.

In React, both Component and PureComponent are base classes for creating custom components, but they differ in how they handle updates and re-renders.

A Component re-renders whenever its props or state change, regardless of whether the actual values of those props or state have changed. This means that even if a prop or state value remains the same, the Component will still re-render and perform any necessary updates.

On the other hand, a PureComponent does a shallow comparison of its props and state objects to determine whether a re-render is necessary. This means that if the props or state values have not changed, the PureComponent will not re-render and skip the unnecessary updates.

The main benefit of using PureComponent is performance optimization, as it can reduce the number of unnecessary re-renders and updates. However, it's important to note that PureComponent should only be used when you have a reasonable expectation that the props and state objects will not be mutated deeply. Otherwise, the shallow comparison may not catch changes that should trigger a re-render, leading to unexpected behavior.

Here's an example where using PureComponent might break your app:

```
class Person extends React.PureComponent {
  render() {
    console.log('Rendering Person component');
    return <div>{this.props.name}</div>;
  }
}

class App extends React.Component {
  state = { people: [{ id: 1, name: 'Alice' }] };

  handleClick = () => {
    const { people } = this.state;
    people[0].name = 'Bob'; // Mutating the state object deeply
    this.setState({ people });
  };

  render() {
    const { people } = this.state;
    console.log('Rendering App component');
    return (
      <div>
        <button onClick={this.handleClick}>Change Name</button>
        {people.map((person) => (
          <Person key={person.id} name={person.name} />
        ))}
      </div>
    );
  }
}
```
In this example, we have an App component that renders a list of Person components. The App component's state contains an array of people objects, each with an id and a name. When the user clicks the "Change Name" button, the first Person component's name is changed from "Alice" to "Bob".

The problem with this example is that the Person component is extending PureComponent, but the people array is being mutated deeply when the name is changed. Since the PureComponent only does a shallow comparison of props, it will not detect the change in the name property and will not re-render the affected Person component.

To fix this issue, we could either use Component instead of PureComponent, or we could update the people array immutably so that the shallow comparison works correctly. For example, we could create a new array with the updated name property and set the state to that new array instead of mutating the existing people array.
_________________________________________________________________________________________________________________
# 2) Context + ShouldComponentUpdate might be dangerous. Can think of why is
that?

The Context API in React is a way to pass data from a parent component down to its descendants without having to pass props through every level of the component tree. While this can be a convenient and efficient way to manage state, it can become dangerous when combined with the ShouldComponentUpdate lifecycle method.

The ShouldComponentUpdate method is used to optimize React component rendering by allowing a component to determine whether it needs to re-render based on changes to its props or state. However, when using the Context API to pass data down the component tree, the ShouldComponentUpdate method may not detect changes to the context that affect the component's rendering.

This can lead to unexpected and potentially dangerous behavior in the application, as the component may not re-render when it should, resulting in outdated or incorrect data being displayed to the user. Additionally, it can also cause performance issues, as the component may unnecessarily re-render when it doesn't need to.

To avoid these issues, it's important to be careful when using the Context API in conjunction with the ShouldComponentUpdate method. One way to mitigate this risk is to use the PureComponent class instead, which automatically implements the ShouldComponentUpdate method and performs a shallow comparison of props and state to determine whether a re-render is necessary. Alternatively, you can use React.memo to wrap functional components and achieve the same effect.
_________________________________________________________________________________________________________________
# 3) Describe 3 ways to pass information from a component to its PARENT.

Sure, here are three ways to pass information from a child component to its parent component in React:

Using Callback Functions: A callback function can be passed down as a prop to the child component. The child component can then call the callback function with any data that needs to be passed up to the parent component. Here's an example:
```
// Parent component
function Parent() {
  function handleChildData(data) {
    console.log(data);
  }

  return <Child onChildData={handleChildData} />;
}

// Child component
function Child({ onChildData }) {
  function handleClick() {
    onChildData('Hello from Child');
  }

  return <button onClick={handleClick}>Click me</button>;
}
```
Using Context API: The Context API is a way to share data between components without having to pass the data through each level of the component tree. The parent component can create a context using the createContext function, and then pass down the context to the child component using the Provider component. The child component can then access the data using the useContext hook. Here's an example:
```
// Create context
const MyContext = React.createContext();

// Parent component
function Parent() {
  return (
    <MyContext.Provider value="Hello from Parent">
      <Child />
    </MyContext.Provider>
  );
}

// Child component
function Child() {
  const data = useContext(MyContext);

  return <div>{data}</div>;
}
```
Using Props: The parent component can pass down a prop to the child component, which the child component can then update with any new data. The parent component can then access the updated prop to get the new data. Here's an example:
```
// Parent component
function Parent() {
  const [data, setData] = useState('');

  return (
    <div>
      <Child onData={setData} />
      <div>{data}</div>
    </div>
  );
}

// Child component
function Child({ onData }) {
  function handleClick() {
    onData('Hello from Child');
  }

  return <button onClick={handleClick}>Click me</button>;
}
```
These are just a few examples of how you can pass information from a child component to its parent component in React. Depending on your specific use case, you may find that one approach works better than the others.
_________________________________________________________________________________________________________________
# 4) Give 2 ways to prevent components from re-rendering.

Sure, here are two ways to prevent unnecessary re-renders in React:

Use shouldComponentUpdate or React.memo: In class components, you can use the shouldComponentUpdate lifecycle method to prevent unnecessary re-renders. This method is called before the component re-renders and allows you to compare the current props and state with the new props and state to determine whether a re-render is necessary. Here's an example:
```
class MyComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // Only update if the prop 'value' has changed
    return nextProps.value !== this.props.value;
  }

  render() {
    return <div>{this.props.value}</div>;
  }
}
```
Alternatively, you can use the React.memo higher-order component (HOC) to wrap a functional component and prevent unnecessary re-renders. React.memo compares the current props with the previous props and only re-renders the component if they are different. Here's an example:

```
const MyComponent = React.memo(({ value }) => {
  return <div>{value}</div>;
});
```
Use PureComponent: In class components, you can extend the PureComponent class instead of the Component class to automatically implement a shouldComponentUpdate method that performs a shallow comparison of the current props and state with the new props and state. This can prevent unnecessary re-renders in certain cases. Here's an example:
```
class MyComponent extends React.PureComponent {
  render() {
    return <div>{this.props.value}</div>;
  }
}
```
Note that PureComponent only performs a shallow comparison, so if your props or state contain nested objects or arrays, you may still need to implement a custom shouldComponentUpdate method.

These are just a few examples of how you can prevent unnecessary re-renders in React. Depending on your specific use case, you may find that one approach works better than the others
_________________________________________________________________________________________________________________

# 5) What is a fragment and why do we need it? Give an example where it might
break my app.
In React, a fragment is a way to group a list of children without adding an extra node to the DOM. It allows you to return multiple elements from a component's render method without having to wrap them in a single parent element.

Here's an example:

```
function MyComponent() {
  return (
    <>
      <div>Child 1</div>
      <div>Child 2</div>
    </>
  );
}
```
In this example, the fragment is represented by the empty <>...</> tags. The MyComponent function returns two div elements as its children, but there is no wrapping parent element.

We need fragments when we want to return multiple elements from a component's render method, but we don't want to add an extra node to the DOM. Without fragments, we would have to wrap the child elements in a parent element, which could affect the styling of the app or cause issues with other components that expect a specific DOM structure.

Here's an example where the lack of a fragment could break an app:

```
function MyComponent() {
  const [showText, setShowText] = useState(false);

  return (
    <div>
      {showText && <div>Some text</div>}
      <button onClick={() => setShowText(!showText)}>Toggle text</button>
    </div>
  );
}
```
In this example, MyComponent conditionally renders a div element containing some text when the showText state variable is true. However, if we remove the div wrapper, the button element will become the only direct child of the parent div, and the app's styling may be affected. For example, the button might not be properly aligned with other elements on the page.

To fix this issue, we can use a fragment to group the div and button elements without adding an extra node to the DOM:

```
function MyComponent() {
  const [showText, setShowText] = useState(false);

  return (
    <>
      {showText && <div>Some text</div>}
      <button onClick={() => setShowText(!showText)}>Toggle text</button>
    </>
  );
}
```
Now, the div and button elements are grouped together in a fragment, and the app's styling is not affected.
_________________________________________________________________________________________________________________
# 6) Here are three examples of Higher-Order Component (HOC) patterns in React:

Authentication HOC: An authentication HOC is a component that wraps another component and provides authentication-related functionality, such as checking whether the user is logged in, redirecting to a login page if the user is not authenticated, or passing authentication-related props to the wrapped component. Here's an example:
```
function withAuthentication(WrappedComponent) {
  class Authentication extends React.Component {
    componentDidMount() {
      // Check whether the user is authenticated
      const isAuthenticated = /* ... */;

      if (!isAuthenticated) {
        // Redirect to the login page
        this.props.history.push('/login');
      }
    }

    render() {
      if (!isAuthenticated) {
        // Don't render the wrapped component if the user is not authenticated
        return null;
      }

      // Pass authentication-related props to the wrapped component
      return <WrappedComponent user={/* ... */} />;
    }
  }

  return withRouter(Authentication);
}
```
In this example, the withAuthentication function is an HOC that wraps a component and provides authentication-related functionality. The wrapped component is only rendered if the user is authenticated, and authentication-related props are passed to the wrapped component.

Data fetching HOC: A data fetching HOC is a component that wraps another component and provides data fetching functionality, such as fetching data from an API or a database, caching the data, or passing the data to the wrapped component. Here's an example:
```
function withDataFetching(WrappedComponent) {
  class DataFetching extends React.Component {
    state = {
      data: null,
      isLoading: true,
      error: null,
    };

    async componentDidMount() {
      try {
        // Fetch data from an API or a database
        const response = await fetch(/* ... */);
        const data = await response.json();

        this.setState({ data, isLoading: false });
      } catch (error) {
        this.setState({ error, isLoading: false });
      }
    }

    render() {
      const { data, isLoading, error } = this.state;

      // Pass data, isLoading, and error props to the wrapped component
      return <WrappedComponent data={data} isLoading={isLoading} error={error} />;
    }
  }

  return DataFetching;
}
```
In this example, the withDataFetching function is an HOC that wraps a component and provides data fetching functionality. The wrapped component receives data, isLoading, and error props, which are obtained by fetching data from an API or a database.

Styling HOC: A styling HOC is a component that wraps another component and provides styling-related functionality, such as applying a specific style or theme to the wrapped component, or passing styling-related props to the wrapped component. Here's an example:
```
function withStyledComponent(WrappedComponent) {
  const StyledComponent = styled(WrappedComponent)`
    background-color: #f0f0f0;
    padding: 1rem;
  `;

  return StyledComponent;
}
```
In this example, the withStyledComponent function is an HOC that wraps a component and applies a specific style to it using the styled function from a CSS-in-JS library such as styled-components. The wrapped component receives the style as a prop and is rendered with the specified style.
_________________________________________________________________________________________________________________

# 7) The main difference in handling exceptions in promises, callbacks, and async/await is in the syntax and the control flow of the code.

Promises: With promises, error handling is done through the catch method, which is chained to the end of the promise chain. If any error is thrown in the promise chain, the control is immediately passed to the nearest catch method, which handles the error. Here's an example:
```
somePromise()
  .then((result) => {
    // Handle the result
  })
  .catch((error) => {
    // Handle the error
  });
```
In this example, the then method is called if the promise is fulfilled, and the catch method is called if the promise is rejected.

Callbacks: With callbacks, error handling is typically done through a standard callback pattern, where the callback function has two arguments: the first argument is the error object (if any), and the second argument is the result. The caller of the function is responsible for checking the error object and handling the error accordingly. Here's an example:
```
someFunction((error, result) => {
  if (error) {
    // Handle the error
  } else {
    // Handle the result
  }
});
```
In this example, the someFunction takes a callback function as an argument, which is called with the error object and the result.

Async/await: With async/await, error handling is done through the try/catch block, where the try block contains the code that might throw an error, and the catch block handles the error. If any error is thrown in the try block, the control is immediately passed to the catch block, which handles the error. Here's an example:
```
async function someAsyncFunction() {
  try {
    const result = await somePromise();
    // Handle the result
  } catch (error) {
    // Handle the error
  }
}
```
In this example, the await keyword is used to wait for the promise to resolve or reject, and the try/catch block is used to handle the error.

Overall, the main difference in error handling between promises, callbacks, and async/await is in the syntax and the control flow of the code. Promises and async/await provide a more intuitive way to handle errors, whereas callbacks require the caller to check the error object and handle the error accordingly.

_________________________________________________________________________________________________________________

# 8) How many arguments does setState take and why is it async.
The setState method in React can take two arguments: an object that represents the updated state, or a function that returns an object representing the updated state.

When an object is passed as the first argument, React merges the object with the current state object, updating any values that have changed. For example:

```
this.setState({ count: this.state.count + 1 });
```
When a function is passed as the first argument, React calls the function with the current state and props as arguments, and expects the function to return an object that represents the updated state. For example:

```
this.setState((prevState, props) => {
  return { count: prevState.count + 1 };
});
```
In both cases, setState updates the component's state and triggers a re-render of the component and its children.

The reason setState is asynchronous is to improve performance. When setState is called, React schedules a state update and batches multiple state updates together into a single update. This reduces the number of DOM updates and improves performance.

As a result of this batching process, the updated state may not be immediately available after setState is called. If you need to access the updated state immediately after calling setState, you can pass a callback function as the second argument to setState, which will be called when the state has been updated. For example:

```
this.setState({ count: this.state.count + 1 }, () => {
  console.log(this.state.count); // logs the updated state
});
```
In summary, setState takes one or two arguments, depending on whether you want to update the state with an object or a function. It is asynchronous in order to improve performance by batching state updates together, and a callback function can be passed as the second argument to access the updated state immediately after the update is applied.
_________________________________________________________________________________________________________________
# 9) List the steps needed to migrate a Class to Function Component.

1. Here are the general steps to migrate a Class Component to a Function Component in React:

2. Remove the render method: Since Function Components do not have lifecycle methods, the render method should be removed.

3. Replace this.props with the function argument: In a Function Component, you can access props directly as an argument, instead of using this.props.

4. Replace this.state with the useState Hook: In a Function Component, you can use the useState Hook to manage state, instead of using the this.state object.

5. Remove the constructor: The constructor is not needed in a Function Component since state is managed using Hooks.

6. Remove componentDidMount, componentDidUpdate, and other lifecycle methods: Function Components do not have lifecycle methods, so these methods should be removed.

7. Refactor other Class Component methods: Any other methods that are used in the Class Component should be refactored to use Hooks or other Function Component patterns.

8. Return the JSX content from the Function Component: A Function Component should return the JSX content that represents the UI.

Here is an example of a Class Component and its Function Component equivalent:

```
// Class Component
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    console.log("component mounted");
  }

  componentDidUpdate() {
    console.log("component updated");
  }

  incrementCount = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <h1>Count: {this.state.count}</h1>
        <button onClick={this.incrementCount}>Increment</button>
      </div>
    );
  }
}

// Function Component
function MyComponent(props) {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    console.log("component mounted or updated");
  });

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={incrementCount}>Increment</button>
    </div>
  );
}
```
Note that in the Function Component example, the useState Hook is used to manage state, and the useEffect Hook is used to replicate the behavior of the componentDidMount and componentDidUpdate methods. Also, note that the JSX content is returned from the Function Component.
_________________________________________________________________________________________________________________
# 10) Here are a few ways styles can be used with components in React:

Inline styles: Inline styles can be added directly to a component using the style prop. This is useful for adding simple styles that only apply to a single component.
```
function MyComponent() {
  const styles = { color: 'red', fontSize: 16 };
  return <h1 style={styles}>Hello World</h1>;
}
```
External stylesheets: External stylesheets can be used with React components by importing the CSS file into the component.
```
import './styles.css';

function MyComponent() {
  return <h1 className="heading">Hello World</h1>;
}
```
CSS Modules: CSS Modules is a way to locally scope CSS styles to a specific component in a React application. This is achieved by importing a CSS file as a module, and using the exported class names as CSS selectors.
```
import styles from './MyComponent.module.css';

function MyComponent() {
  return <h1 className={styles.heading}>Hello World</h1>;
}
```
CSS-in-JS libraries: There are a number of CSS-in-JS libraries available for React, such as styled-components and emotion. These libraries allow you to write CSS styles using JavaScript, and provide a number of additional features such as dynamic styles, theming, and server-side rendering.
```
import styled from 'styled-components';

const Heading = styled.h1`
  color: ${props => (props.color ? props.color : 'black')};
  font-size: 16px;
`;

function MyComponent() {
  return <Heading color="red">Hello World</Heading>;
}
```
These are just a few examples of how styles can be used with React components. The best approach will depend on the specific requirements of your application.
_________________________________________________________________________________________________________________
# 11) How to render an HTML string coming from the server.

To render an HTML string that comes from the server in React, you can use the dangerouslySetInnerHTML prop. This prop allows you to set the inner HTML of a component using a string value.

Here's an example of how to use dangerouslySetInnerHTML:

```
function MyComponent(props) {
  return <div dangerouslySetInnerHTML={{ __html: props.htmlString }}></div>;
}
```
In this example, the MyComponent function takes a prop called htmlString that contains the HTML string to be rendered. The dangerouslySetInnerHTML prop is used to set the inner HTML of the div element to the value of the htmlString prop.

It's important to note that the use of dangerouslySetInnerHTML should be avoided wherever possible. As the name suggests, using this prop can be dangerous if the HTML string is not properly sanitized or validated, as it can lead to XSS vulnerabilities. If you need to render HTML content from the server, consider using a library like DOMPurify to sanitize the content before rendering it in your React component.
