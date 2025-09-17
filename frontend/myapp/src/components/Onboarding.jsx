import React, { useEffect } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";

const Onboarding = () => {
  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");

    if (firstLogin === "true") {
      setTimeout(() => {
        const intro = introJs();

        intro.setOptions({
          steps: [
            {
              element: ".sidebar",
              intro: "This is your sidebar. Use it to navigate.",
              disableInteraction: true,   // 👈 prevents it from waiting for a click
            },
            {
              element: ".add-note-btn",
              intro: "Click here to create a new note.",
            },
            {
              element: ".search-bar",
              intro: "Use the search bar to find notes.",
            },
            { intro: "That's it! You're ready 🚀" },
          ],
          showProgress: true,
          showBullets: false,
          exitOnOverlayClick: false,
          exitOnEsc: false,
        });

        // 👉 Open sidebar when leaving step 1
        intro.onbeforechange((el) => {
          if (el?.classList.contains("sidebar")) {
            const sidebarBtn = document.querySelector(".sidebar");
            if (sidebarBtn) sidebarBtn.click();
          }
        });

        intro.start();
        localStorage.setItem("firstLogin", "false");
      }, 300);
    }
  }, []);

  return null;
};

export default Onboarding;
