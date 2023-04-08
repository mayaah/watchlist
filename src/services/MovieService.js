import { database } from "../firebase";

const db = database.ref("/movies");

const getAll = () => {
  return db;
};

const get = (key) => {
  return db.child(key);
};

const create = (data) => {
  return db.push(data);
};

const update = (key, data) => {
  return db.child(key).update(data);
};

const remove = (key) => {
  return db.child(key).remove();
};

const removeAll = () => {
  return db.remove();
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
};