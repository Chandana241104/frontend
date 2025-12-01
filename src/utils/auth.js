export const setAdminToken = (token, adminData) => {
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminData', JSON.stringify(adminData));
};

export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

export const getAdminData = () => {
  const data = localStorage.getItem('adminData');
  return data ? JSON.parse(data) : null;
};

export const removeAdminToken = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};

export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  return !!token;
};