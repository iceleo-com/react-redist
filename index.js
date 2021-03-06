let register = '__redist_default_register__';
/* eslint-disable */
try {
    if (__redist_register__) {
        register = __redist_register__;
    }
} catch (error) {
    // ignore
}
/* eslint-enable */

const counter = `${register}counter`;

const w = window;
w[register] = {};
w[counter] = 0;

/**
 * Emit custom data to custom action
 * @param {string} action - Name of action
 * @param {...any} args - Any data that you want to emit
 * @returns {null}
 */
export function emitState(action, ...args) {
    if (!w[register][action]) {
        return;
    }

    const invalidListeners = [];

    for (const id in w[register][action]) {
        if (Object.hasOwnProperty.call(w[register][action], id)) {
            const callback = w[register][action][id];

            if (typeof callback === 'function') {
                try {
                    callback(...args);
                } catch (error) {
                    console.log(error); // eslint-disable-line
                }
            } else {
                invalidListeners.push(id);
            }
        }
    }

    if (invalidListeners.length) {
        invalidListeners.forEach((id) => {
            delete w[register][action][id];
        });
    }
}

/**
 * Emit state update when the setState function is invoked
 * @param {React.Component} instance - Instance of React.Component, pass "this" variant to this parameter
 * @param {string} action - name of action
 * @returns {boolean}
 */
export function autoEmitState(instance, action) {
    if (!instance
        || typeof instance.setState !== 'function'
        || typeof action !== 'string'
        || !action
    ) {
        return false;
    }

    // backup the current setState function
    instance.setStateBak = instance.setState;

    // create a proxy to listen the setState
    instance.setState = (state, cb) => {
        instance.setStateBak(state, cb);
        emitState(action, state);
    };

    return true;
}

/**
 * Callback when data is emitted
 * @callback listenCallback
 * @param {*} state - data is passed from emitState function
 */

/**
 * Listen on state update
 * @param {string} action - Name of action
 * @param {listenCallback} callback - callback function
 * @returns {number} - ID of listener
 */
export function listenState(action, callback) {
    if (typeof callback !== 'function' || typeof action !== 'string' || !action) {
        return false;
    }

    const id = ++w[counter];

    if (!w[register][action]) {
        w[register][action] = {};
    }

    w[register][action][id] = callback;

    return id;
}

/**
 * Stop listening from action
 * @param {string} action - Action name
 * @param {number} id - ID of listener, get from listenState function
 */
export function offListenState(action, id) {
    if (w[register][action] && w[register][action][id]) {
        delete w[register][action][id];
    }
}
