import Student from './student';
import User from './user';

User.hasMany(Student, {
  foreignKey: 'userId',
});
Student.belongsTo(User);

export { Student, User };
