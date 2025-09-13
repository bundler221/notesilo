import React from "react";

export default function UserGuide() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl px-6">
        <article className="bg-white shadow-md rounded-xl p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">NoteSilo User Guide</h1>
            <p className="mt-2 text-gray-600">
              This guide explains how to use NoteSilo from first login through advanced features,
              troubleshooting, and support.
            </p>
            <h2 className=" text-xl">For Markdown Syntax, Please Click on <a className="text-blue-600 underline" href="https://www.markdownguide.org/basic-syntax/" target="_blank">Here</a> </h2>
          </header>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-3">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              NoteSilo combines a simple, distraction-free editor with intelligent features to help
              you write, organize, and review notes. It supports Markdown for structured
              formatting and includes AI-driven capabilities for summarization, question
              generation, and translation. The service is designed to work across desktop and
              mobile devices.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Create and edit notes in Markdown for clear structure and formatting.</li>
              <li>Use AI tools to summarize notes, generate practice questions, and translate content.</li>
              <li>Export notes to PDF for offline use and sharing.</li>
              <li>Organize and search notes through a clean, responsive interface.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-3">2. Getting Started</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Sign up and Login</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-1 mt-2">
              <li>Visit the NoteSilo website and click on the Sign Up button to create a new account.</li>
              <li>Enter your name, valid email address, and a secure password.</li>
              <li>After verifying your email (if verification is enabled), log in using your credentials.</li>
              <li>Upon success, you will be redirected to the Dashboard.</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Dashboard Overview</h3>
            <p className="text-gray-700 mt-2 leading-relaxed">
              The Dashboard is the central place to access notes. The left sidebar contains
              navigation controls — create new notes, view all notes, and access settings.
              The main area lists your recent and pinned notes with quick actions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-3">3. Notes Management</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Creating a New Note</h3>
            <p className="text-gray-700 mt-2">
              Click the <strong>New Note</strong> button to open the editor. Provide a title and
              begin typing your content. If no title is provided, the note is saved as
              <code className="mx-1 rounded bg-gray-100 px-1 py-0.5 text-sm">Untitled Note</code>.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Markdown Usage</h3>
            <p className="text-gray-700">You can use Markdown to structure your content. Example:</p>
            <pre className="mt-3 rounded border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm">
{`# Heading 1
## Heading 2
This is **bold text** and this is *italic text*.

- List Item 1
- List Item 2`}
            </pre>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Editing and Saving</h3>
            <p className="text-gray-700">
              The editor displays a live preview of Markdown. Notes autosave periodically while you
              type. You may also save manually using the Save button or the keyboard shortcut
              (<kbd className="rounded bg-gray-100 px-1">Ctrl</kbd> + <kbd className="rounded bg-gray-100 px-1">S</kbd>).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-3">4. AI Features</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Summarizing Notes</h3>
            <p className="text-gray-700">
              To summarize a long note, open the note and choose <em>Summarize</em>. The AI will
              generate a concise summary focusing on the main points. Use the summary for quick
              review or as a study aid.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Preparing Questions</h3>
            <p className="text-gray-700">
              Use <em>Prepare Questions</em> to generate practice questions from your note. This
              feature extracts key facts and concepts and converts them into question/answer pairs,
              useful for exams or self-review.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Translating Notes</h3>
            <p className="text-gray-700">
              The <em>Translate</em> action converts your note into another language. Select the
              desired language and confirm to get a translated version for reading or distribution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-3">5. Exporting and Sharing</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Export to PDF</h3>
            <p className="text-gray-700">
              Any note can be exported to a PDF with formatting preserved for headings, bold text,
              lists, and code blocks. To export:
            </p>
            <ol className="list-decimal list-inside text-gray-700 mt-3 space-y-1">
              <li>Open the note you want to export.</li>
              <li>Click the Export menu and select PDF.</li>
              <li>Your browser will download a PDF file named after the note title.</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">Sharing Notes</h3>
            <p className="text-gray-700">
              If sharing is enabled on your instance, you can create a shareable link to a note.
              Recipients can view (and optionally comment on) the note without a login if permissions
              allow it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-3">6. User Interface Features</h2>
            <p className="text-gray-700">
              NoteSilo is designed for ease of use with the following elements:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
              <li>Sidebar menu for navigation and quick access to common tasks.</li>
              <li>Search bar to find notes by title or content quickly.</li>
              <li>Theme toggle to switch between light and dark modes for better readability.</li>
              <li>Responsive layout that adapts to mobile and desktop screens.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-3">7. Troubleshooting</h2>
            <p className="text-gray-700 mb-4">
              Common issues and recommended solutions are listed below.
            </p>
            <div className="overflow-auto rounded border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Problem</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Possible Solution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3 text-gray-700 align-top">A note is not saving</td>
                    <td className="px-4 py-3 text-gray-700">
                      Check your network connection and refresh the page. If the problem persists,
                      log out and log in again. Confirm the backend server is running for self-hosted deployments.
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 text-gray-700 align-top">Exported PDF looks incorrect</td>
                    <td className="px-4 py-3 text-gray-700">
                      Validate your Markdown for unclosed tags or malformed code blocks. Use the
                      preview to confirm layout before exporting. If using custom styles, confirm the PDF renderer supports them.
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 text-gray-700 align-top">AI features are not working</td>
                    <td className="px-4 py-3 text-gray-700">
                      Your session may have expired. Log out and log in again. If using a remote AI
                      service, verify that API keys are configured and the AI service is reachable.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-3">8. Advanced Features</h2>
            <p className="text-gray-700">
              Depending on the instance configuration, NoteSilo may support the following:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
              <li>Import local Markdown (.md) or text (.txt) files to create notes from existing documents.</li>
              <li>Version history for restoring prior versions of a note.</li>
              <li>Cloud integrations (Google Drive, OneDrive) for backup and cross-device syncing.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-3">9. Security and Privacy</h2>
            <p className="text-gray-700">
              NoteSilo follows common security practices for web applications:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
              <li>Authentication uses secure tokens (for example, JWT) to authorize requests.</li>
              <li>Notes are stored in a protected database with access controls.</li>
              <li>Do not share account credentials and log out when using shared devices.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-gray-800 mb-3">10. Support</h2>
            <p className="text-gray-700 mb-2">If you need assistance:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Contact support at <a href="mailto:support@notesilo.com" className="text-blue-600 hover:underline">support@notesilo.com</a>.</li>
              <li>Use the in-app Help Center for FAQs, tutorials, and troubleshooting steps.</li>
              <li>Provide feedback through the app to help improve future releases.</li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
}

