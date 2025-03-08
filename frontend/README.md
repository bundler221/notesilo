Sure! Here’s a concise list of the **4 main routes we’ve tested so far** that you can add to your README:

---

## 📝 Tested API Routes

Here’s a list of the main routes we’ve tested so far:

| Route                       | Method | Description                                        | Protected        |
| --------------------------- | ------ | -------------------------------------------------- | ---------------- |
| `/api/auth/register`        | POST   | Register a new user with email/username & password | ❌               |
| `/api/auth/login`           | POST   | Login user and receive JWT token                   | ❌               |
| `/api/auth/me`              | GET    | Get current logged-in user details                 | ✅ (JWT required) |
| `/api/auth/update-profile`  | PUT    | Update username (and other profile fields)         | ✅ (JWT required) |
| `/api/auth/update-password` | PUT    | Update user password (email/password users only)   | ✅ (JWT required) |
| `/api/auth/delete-account`  | DELETE | Delete current user account                        | ✅ (JWT required) |
| `/api/notes`                | POST   | Create a new note                                  | ✅ (JWT required) |
| `/api/notes`                | GET    | Get all notes of the logged-in user                | ✅ (JWT required) |

---

### 🔑 Authentication
For all protected routes, include the header:



💡 **Notes:**

* For protected routes, include header:

```
Authorization: Bearer <JWT_TOKEN>
```

* Requests tested using **Postman / Thunder Client**.
* Notes content can be plain text or Markdown.

---
