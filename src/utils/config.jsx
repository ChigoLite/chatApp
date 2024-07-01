export const sender = (loginUser, users) => {
  return users[0]?._id === loginUser?._id
    ? users[1].username
    : users[0].username;
};
export const senderId = (loginUser, users) => {
  return users[0]?._id === loginUser?._id ? users[1]._id : users[0]._id;
};
export const SenderFullDetails = (loginUser, users) => {
  return users[0]?._id === loginUser?._id ? users[1] : users[0];
};
