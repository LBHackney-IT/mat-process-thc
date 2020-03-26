/* eslint-env node */
module.exports = {
  presets: [["next/babel", { "styled-jsx": { "babel-test": true } }]],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "lbh-frontend-react": ["./node_modules/lbh-frontend-react/dist/cjs"],
          remultiform: ["./node_modules/remultiform/dist/cjs"],
        },
      },
    ],
  ],
};
