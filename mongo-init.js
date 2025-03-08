// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the notesilo database
db = db.getSiblingDB('notesilo');

// Create a user for the application
db.createUser({
  user: 'notesilo_user',
  pwd: 'notesilo_password',
  roles: [
    {
      role: 'readWrite',
      db: 'notesilo'
    }
  ]
});

// Create initial collections and indexes if needed
db.createCollection('users');
db.createCollection('notes');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.notes.createIndex({ userId: 1 });
db.notes.createIndex({ createdAt: -1 });

print('Database initialized successfully');
