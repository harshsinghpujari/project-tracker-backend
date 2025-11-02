export const formatUser = (user) => {
  const safeUser = user.get({plain: true});
  delete safeUser.password;
  return safeUser;
};