import React from "react"
import { ReactTyped } from "react-typed"

const HeroText = () => {
  return (
    <h1 className="text-4xl font-bold text-stone-500 mb-8">
      <ReactTyped
        strings={[
          "Welcome to NOTESILO...",
          "Prepare your own customised notes",
        ]}
        typeSpeed={100}   // typing speed
        backSpeed={50}   // deleting speed
        // loop              // keeps repeating
      />
    </h1>
  )
}

export default HeroText
