# react-redist
A lightweight function to distribute the data from a component to another component
# Installation
`npm install react-redist --save`
# Example
```tsx
import React, { Component } from 'react';
import { autoEmitState, emitState, listenState, offListenState } from 'react-redist';
import { ANOTHER_ACTION } from './AnotherComponent';

export const EXAMPLE_ACTION_1 = 'CUSTOM_ACTION_NAME_1'; // action name
export const EXAMPLE_ACTION_2 = 'CUSTOM_ACTION_NAME_2'; // you can create more than one action name if needed

class Example extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        // your render function
    }

    componentDidMount() {
        // Emit state data automatically when the setState function is invoked
        autoEmitState(this, EXAMPLE_ACTION_1);

        // Listen on ANOTHER_ACTION
        this.listenId = listenState(ANOTHER_ACTION, (state) => {
            console.log(state);
            // your custom code
        });

        // Emit any custom data to any custom action
        emitState(EXAMPLE_ACTION_2, 'My Custom Data');
    }

    componentWillUnmount() {
        // Stop listening on ANOTHER_ACTION
        offListenState(ANOTHER_ACTION, this.listenId);
    }
}

export default Example;
```
**Does it work with a function component?**
Ohh, Yes!

```tsx
import React, { useEffect } from 'react';
import { emitState, listenState, offListenState } from 'react-redist';
import { ANOTHER_ACTION } from './AnotherComponent';

export const EXAMPLE_ACTION = 'CUSTOM_ACTION_NAME'; // action name

export default function MyCustomComponent(props) {
    const [state, setState] = useState({
        // any data
    });

    useEffect(() => {
        // listen on ANOTHER_ACTION
        const id = listenState(ANOTHER_ACTION, (data) => {
            // your custom code in callback function
        });

        return () =>{
            // stop listening on ANOTHER_ACTION
            offListenState(ANOTHER_ACTION, id);
        };
    });

    const handleClick = (event) => {
        const el = event.currentTarget;

        setState(el); // it's example, you can set any data to setState function

        emitState(EXAMPLE_ACTION, el); // emit any data with to custom action
    };

    return <button onClick={handleClick}>Custom Text</button>
}
```
# Prevent conflict with another app
Please using the webpack.DefinePlugin plugin to rename the global register variable
```tsx
new webpack.DefinePlugin({
    __redist_register__: '"__redist_my_custom_app__"',
})
```
Example code
```tsx
const webpack = require('webpack');

module.exports = (env) => {
    return {
        entry: './index.js',
        plugins: [
            new webpack.DefinePlugin({
                __redist_register__: '"__redist_my_custom_app__"',
            }),
        ],
        output: {
            filename: 'my-app.js',
            path: __dirname + '/dist',
        },
    };
};
```
