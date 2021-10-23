module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {},
    fontFamily: {
      pixel: ['"Press Start 2P"'],
      sans: ["Nunito"],
     }
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
