Sure! Here’s a concise list of the **4 main routes we’ve tested so far** that you can add to your README:

---

## 📝 Tested API Routes

| Route                | Method | Description                                        | Protected        |
| -------------------- | ------ | -------------------------------------------------- | ---------------- |
| `/api/auth/register` | POST   | Register a new user with email/username & password | ❌                |
| `/api/auth/login`    | POST   | Login user and receive JWT token                   | ❌                |
| `/api/notes`         | POST   | Create a new note                                  | ✅ (JWT required) |
| `/api/notes`         | GET    | Get all notes of the logged-in user                | ✅ (JWT required) |

---

💡 **Notes:**

* For protected routes, include header:

```
Authorization: Bearer <JWT_TOKEN>
```

* Requests tested using **Postman / Thunder Client**.
* Notes content can be plain text or Markdown.

---

