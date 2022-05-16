// This file comes before all others in compile output, it is a dependency of all fuel scripts
export var global = {
  outcomes: {},
  ...global,
};

// const originalOutcome = global.outcome;
// global.outcomes = [];

// Object.defineProperties(global, {
//   outcomes: {
//     value: [],
//   },
//   outcome: {
//     get: function () {
//       return global.outcomes.join("");
//     },
//     set: function (chunk) {
//       global.outcomes.push(chunk);
//     },
//   },
// });

// export default global;
