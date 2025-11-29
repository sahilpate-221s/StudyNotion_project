// MongoDB initialization script
db = db.getSiblingDB('studynotion');

// Create application user
db.createUser({
  user: 'studynotion_user',
  pwd: 'studynotion_password',
  roles: [
    {
      role: 'readWrite',
      db: 'studynotion'
    }
  ]
});

// Create collections with initial structure
db.createCollection('users');
db.createCollection('courses');
db.createCollection('categories');
db.createCollection('profiles');
db.createCollection('sections');
db.createCollection('subsections');
db.createCollection('courseprogress');
db.createCollection('ratingandreviews');
db.createCollection('otps');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.courses.createIndex({ instructor: 1 });
db.courses.createIndex({ category: 1 });
db.courses.createIndex({ status: 1 });
db.courseprogress.createIndex({ userId: 1, courseID: 1 });
db.otps.createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 }); // Auto-delete OTPs after 5 minutes

print('MongoDB initialization completed successfully!');
