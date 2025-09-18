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
              element: ".rightbar",
              intro: "This is your Right sidebar. Use it to manage notes.",
              disableInteraction: true,   // 👈 prevents it from waiting for a click
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

       const ensureSidebarOpen = () => {
          const sidebarEl = document.querySelector(".sidebar");
          const hamburgerBtn = document.querySelector(".hamburger-btn");
          if (!sidebarEl || !hamburgerBtn) return;
          if (sidebarEl.classList.contains("-translate-x-full")) {
            hamburgerBtn.click();
          }
        };

        const ensureRightOpen = () => {
          const rightEl = document.querySelector(".rightbar");
          const rightBtn = document.querySelector(".right-btn");
          if (!rightEl || !rightBtn) return;
          if (rightEl.classList.contains("translate-x-full")) {
            rightBtn.click();
          }
        };

        const closeSidebar = () => {
  const sidebarEl = document.querySelector(".sidebar");
  const closeBtn = document.querySelector(".leftham"); // arrow button
  if (sidebarEl && closeBtn && !sidebarEl.classList.contains("-translate-x-full")) {
    closeBtn.click();
  }
};

const closeRightbar = () => {
  const rightEl = document.querySelector(".rightbar");
  const closeBtn = document.querySelector(".rightham"); // arrow button
  if (rightEl && closeBtn && !rightEl.classList.contains("translate-x-full")) {
    closeBtn.click();
  }
};


        // Make sure the left sidebar is visible before starting step 1
        ensureSidebarOpen();

       
intro.onbeforechange((el) => {
  if (el?.classList.contains("rightbar")) {
    ensureRightOpen(); // 👈 now it's used
  }
});

 intro.onafterchange((el) => {
  // After showing search bar, close both sidebars
  if (el?.classList.contains("search-bar")) {
    closeSidebar();
    closeRightbar();
  }
});

        intro.start();
        localStorage.setItem("firstLogin", "true");
      }, 300);
    }
  }, []);

  return null;
};

export default Onboarding;
