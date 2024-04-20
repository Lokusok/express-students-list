import Student from './student';
import User from './user';

User.hasMany(Student);
Student.belongsTo(User);

export { Student, User };
