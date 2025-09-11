// AboutUs.jsx
import React from "react";
export default function AboutUs() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="mb-4">
          Welcome to <strong>NoteSilo</strong>, your intelligent digital note-taking companion. 
          We believe that note-taking should not just be about writing text, but about creating 
          meaningful, organized, and accessible knowledge. With this in mind, NoteSilo was 
          developed to bring together simplicity, structure, and the power of artificial intelligence.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Our Mission</h2>
        <p className="mb-4">
          Our mission is to empower students, professionals, and lifelong learners by 
          providing a smart platform that helps them capture, manage, and learn from their notes 
          more effectively. Whether it is preparing for exams, working on projects, or 
          storing important information, NoteSilo is designed to support you every step of the way.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Why Choose NoteSilo?</h2>
        <p className="mb-2">Here is what makes NoteSilo different:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Clean and user-friendly interface designed for productivity.</li>
          <li>Markdown editor for structured and formatted notes.</li>
          <li>AI-powered tools to summarize, generate practice questions, and translate notes.</li>
          <li>Secure storage of your notes with easy search and organization.</li>
          <li>Cross-platform accessibility, so your notes are always with you.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Our Vision</h2>
        <p className="mb-4">
          We envision NoteSilo as more than just a note-taking app. 
          Our goal is to transform it into a knowledge hub where ideas can grow, 
          be refined, and shared. We aim to continuously improve and bring in 
          features that make learning smarter and more interactive.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Join Us</h2>
        <p>
          We invite you to be a part of the NoteSilo journey. Explore, create, and 
          manage your notes in smarter ways, and let us help you turn your ideas into impact. 
          For feedback, collaborations, or inquiries, reach out to us at 
          <a href="mailto:support@notesilo.com" className="text-blue-500"> support@notesilo.com</a>.
        </p>
      </div>
    </>
  );
}
