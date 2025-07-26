// import tailwindcss from "tailwindcss";
// import autoprefixer from "autoprefixer";

// export default {
//   plugins: {
//     tailwindcss: {},    // the core tailwindcss plugin
//     autoprefixer: {},   // autoprefixer
//   },
// };

// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},   // ← use the new adapter
    "autoprefixer": {},            // autoprefixer remains the same
  },
};