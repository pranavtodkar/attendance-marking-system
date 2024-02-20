/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    screens:{
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px"
    },
    extend: {
      colors:{
        'amber': "#FFBF00",
        'green': "#0A7A00",
        'lightGray': '#F4F4F4',
        
      }
    },
  },
  plugins: [],
}