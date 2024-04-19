import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('db123', 'user123', 'password123', {
  host: 'db',
  dialect: 'postgres',
});

sequelize.addHook('beforeCount', function (options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true;
    options.col =
      this._scope.col || options.col || `"${this.options.name.singular}".id`;
  }

  if (options.include && options.include.length > 0) {
    options.include = null;
  }
});
