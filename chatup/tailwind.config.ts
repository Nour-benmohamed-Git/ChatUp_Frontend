import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      ...colors,
      gold: {
        50: "#fff9e6",
        100: "#fff1cc",
        200: "#ffe8b3",
        300: "#ffdf99",
        400: "#ffd580",
        500: "#ffcc66",
        600: "#ffc34d",
        700: "#ffb833",
        800: "#ffae1a",
        900: "#ffa500",
      },
    },
  },
  plugins: [],
};
export default config;
