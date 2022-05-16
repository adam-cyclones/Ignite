/*!
 * weakmap-polyfill v2.0.4 - ECMAScript6 WeakMap polyfill
 * https://github.com/polygonplanet/weakmap-polyfill
 * Copyright (c) 2015-2021 polygonplanet <polygon.planet.aqua@gmail.com>
 * @license MIT
 */

(function (self) {
  "use strict";

  if (self.WeakMap) {
    return;
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasDefine =
    Object.defineProperty &&
    (function () {
      try {
        // Avoid IE8's broken Object.defineProperty
        return Object.defineProperty({}, "x", { value: 1 }).x === 1;
      } catch (e) {}
    })();

  var defineProperty = function (object, name, value) {
    if (hasDefine) {
      Object.defineProperty(object, name, {
        configurable: true,
        writable: true,
        value: value,
      });
    } else {
      object[name] = value;
    }
  };

  self.WeakMap = (function () {
    // ECMA-262 23.3 WeakMap Objects
    function WeakMap() {
      if (this === void 0) {
        throw new TypeError("Constructor WeakMap requires 'new'");
      }

      defineProperty(this, "_id", genId("_WeakMap"));

      // ECMA-262 23.3.1.1 WeakMap([iterable])
      if (arguments.length > 0) {
        // Currently, WeakMap `iterable` argument is not supported
        throw new TypeError("WeakMap iterable is not supported");
      }
    }

    // ECMA-262 23.3.3.2 WeakMap.prototype.delete(key)
    defineProperty(WeakMap.prototype, "delete", function (key) {
      checkInstance(this, "delete");

      if (!isObject(key)) {
        return false;
      }

      var entry = key[this._id];
      if (entry && entry[0] === key) {
        delete key[this._id];
        return true;
      }

      return false;
    });

    // ECMA-262 23.3.3.3 WeakMap.prototype.get(key)
    defineProperty(WeakMap.prototype, "get", function (key) {
      checkInstance(this, "get");

      if (!isObject(key)) {
        return void 0;
      }

      var entry = key[this._id];
      if (entry && entry[0] === key) {
        return entry[1];
      }

      return void 0;
    });

    // ECMA-262 23.3.3.4 WeakMap.prototype.has(key)
    defineProperty(WeakMap.prototype, "has", function (key) {
      checkInstance(this, "has");

      if (!isObject(key)) {
        return false;
      }

      var entry = key[this._id];
      if (entry && entry[0] === key) {
        return true;
      }

      return false;
    });

    // ECMA-262 23.3.3.5 WeakMap.prototype.set(key, value)
    defineProperty(WeakMap.prototype, "set", function (key, value) {
      checkInstance(this, "set");

      if (!isObject(key)) {
        throw new TypeError("Invalid value used as weak map key");
      }

      var entry = key[this._id];
      if (entry && entry[0] === key) {
        entry[1] = value;
        return this;
      }

      defineProperty(key, this._id, [key, value]);
      return this;
    });

    function checkInstance(x, methodName) {
      if (!isObject(x) || !hasOwnProperty.call(x, "_id")) {
        throw new TypeError(
          methodName + " method called on incompatible receiver " + typeof x
        );
      }
    }

    function genId(prefix) {
      return prefix + "_" + rand() + "." + rand();
    }

    function rand() {
      return Math.random().toString().substring(2);
    }

    defineProperty(WeakMap, "_polyfill", true);
    return WeakMap;
  })();

  function isObject(x) {
    return Object(x) === x;
  }
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : this
);

/*
    cycle.js
    2018-05-15
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html
    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

// The file uses the WeakMap feature of ES6.

/*property
    $ref, decycle, forEach, get, indexOf, isArray, keys, length, push,
    retrocycle, set, stringify, test
*/

if (typeof JSON.decycle !== "function") {
  JSON.decycle = function decycle(object, replacer) {
    "use strict";

    // Make a deep copy of an object or array, assuring that there is at most
    // one instance of each object or array in the resulting structure. The
    // duplicate references (which might be forming cycles) are replaced with
    // an object of the form

    //      {"$ref": PATH}

    // where the PATH is a JSONPath string that locates the first occurance.

    // So,

    //      var a = [];
    //      a[0] = a;
    //      return JSON.stringify(JSON.decycle(a));

    // produces the string '[{"$ref":"$"}]'.

    // If a replacer function is provided, then it will be called for each value.
    // A replacer function receives a value and returns a replacement value.

    // JSONPath is used to locate the unique object. $ indicates the top level of
    // the object or array. [NUMBER] or [STRING] indicates a child element or
    // property.

    var objects = new WeakMap(); // object to path mappings

    return (function derez(value, path) {
      // The derez function recurses through the object, producing the deep copy.

      var old_path; // The path of an earlier occurance of value
      var nu; // The new object or array

      // If a replacer function was provided, then call it to get a replacement value.

      if (replacer !== undefined) {
        value = replacer(value);
      }

      // typeof null === "object", so go on if this value is really an object but not
      // one of the weird builtin objects.

      if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof Boolean) &&
        !(value instanceof Date) &&
        !(value instanceof Number) &&
        !(value instanceof RegExp) &&
        !(value instanceof String)
      ) {
        // If the value is an object or array, look to see if we have already
        // encountered it. If so, return a {"$ref":PATH} object. This uses an
        // ES6 WeakMap.

        old_path = objects.get(value);
        if (old_path !== undefined) {
          return { $ref: old_path };
        }

        // Otherwise, accumulate the unique value and its path.

        objects.set(value, path);

        // If it is an array, replicate the array.

        if (Array.isArray(value)) {
          nu = [];
          value.forEach(function (element, i) {
            nu[i] = derez(element, path + "[" + i + "]");
          });
        } else {
          // If it is an object, replicate the object.

          nu = {};
          Object.keys(value).forEach(function (name) {
            nu[name] = derez(
              value[name],
              path + "[" + JSON.stringify(name) + "]"
            );
          });
        }
        return nu;
      }
      return value;
    })(object, "$");
  };
}

if (typeof JSON.retrocycle !== "function") {
  JSON.retrocycle = function retrocycle($) {
    "use strict";

    // Restore an object that was reduced by decycle. Members whose values are
    // objects of the form
    //      {$ref: PATH}
    // are replaced with references to the value found by the PATH. This will
    // restore cycles. The object will be mutated.

    // The eval function is used to locate the values described by a PATH. The
    // root object is kept in a $ variable. A regular expression is used to
    // assure that the PATH is extremely well formed. The regexp contains nested
    // * quantifiers. That has been known to have extremely bad performance
    // problems on some browsers for very long strings. A PATH is expected to be
    // reasonably short. A PATH is allowed to belong to a very restricted subset of
    // Goessner's JSONPath.

    // So,
    //      var s = '[{"$ref":"$"}]';
    //      return JSON.retrocycle(JSON.parse(s));
    // produces an array containing a single element which is the array itself.

    var px =
      /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

    (function rez(value) {
      // The rez function walks recursively through the object looking for $ref
      // properties. When it finds one that has a value that is a path, then it
      // replaces the $ref object with a reference to the value that is found by
      // the path.

      if (value && typeof value === "object") {
        if (Array.isArray(value)) {
          value.forEach(function (element, i) {
            if (typeof element === "object" && element !== null) {
              var path = element.$ref;
              if (typeof path === "string" && px.test(path)) {
                value[i] = eval(path);
              } else {
                rez(element);
              }
            }
          });
        } else {
          Object.keys(value).forEach(function (name) {
            var item = value[name];
            if (typeof item === "object" && item !== null) {
              var path = item.$ref;
              if (typeof path === "string" && px.test(path)) {
                value[name] = eval(path);
              } else {
                rez(item);
              }
            }
          });
        }
      }
    })($);
    return $;
  };
}

var JSONfn = {};

(function () {
  JSONfn.stringify = function (obj) {
    return JSON.stringify(
      obj,
      function (key, value) {
        return typeof value === "function"
          ? "[Function: " + (value.name ? value.name : key) + "]"
          : value;
      },
      4
    );
  };
})();

//
// My code
//

function format(argsArray) {
  var stdout = [];
  for (var i = 0; i < argsArray.length; i++) {
    if (typeof argsArray[i] === "object") {
      try {
        argsArray[i] = JSON.decycle(argsArray[i]);
        argsArray[i] = JSONfn.stringify(argsArray[i]);
      } catch (err) {
        logger.message(err);
        continue;
      }
    }
    stdout.push(argsArray[i]);
  }
  return stdout.join(" ");
}

var console = {
  log: function () {
    logger.message(format(arguments));
  },
  warn: function () {
    logger.message(format(arguments));
  },
  info: function () {
    logger.message(format(arguments));
  },
  error: function () {
    logger.message(format(arguments));
  },
};
/// END
