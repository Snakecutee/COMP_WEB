import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API,
  validateStatus: (status) => status <= 500,
});

apiInstance.interceptors.request.use((request) => {
  return request;
});

export const tokenRequestInterceptor = async (apiCall, refreshToken) => {
  const { status, data } = await apiCall();
  if (status === 401) {
    refreshToken();
    return await apiCall();
  } else {
    return { status, data };
  }
};

// Upload

export const uploadImage = (formData) => apiInstance.post("/upload", formData);

// Authenticate
export const login = (formData) =>
  apiInstance.post("/auth/login", { ...formData }, {withCredentials: true});
export const register = (formData) =>
  apiInstance.post("/auth/register", { ...formData });

export const changePassword = (formData, token) =>
  apiInstance.put("/auth/update-password", { ...formData }, {headers: {
    "Authorization": `Bearer ${token}`
  }});

export const refreshToken = () =>
  apiInstance.get("/auth/refresh-token", {withCredentials: true});

export const logout = (refreshToken) =>
  apiInstance.post("/auth/logout", { ...refreshToken }, {withCredentials: true});

// Users
export const getAllUser = (token) =>
  apiInstance.get("/users/", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUser = (token, id) =>
  apiInstance.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const reactiveUser = (token, id) =>
  apiInstance.get(`/users/reactive/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getSingleUser = (token, id) =>
  apiInstance.get(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUser = (formData, id, token) =>
  apiInstance.put(
    `/users/update/${id}`,
    { ...formData },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const getUserByDepartment = (token, deparment, username="") =>
  apiInstance.get(`/users/?department=${deparment}&username=${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const searchUserByUsername = (username, token) =>
  apiInstance.get(`users?username=${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const assignSTUDENT = (formData, id, token) =>
  apiInstance.put(
    `users/${id}`,
    { ...formData },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const assignSTUDENTToManager = (formData, id, token) =>
  apiInstance.put(
    `users/assign/${id}`,
    { ...formData },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const getUserWithoutDepartment = (token) =>
  apiInstance.get(`users/getdepartment`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const uploadExcelCreateUser = (formData, token) =>
  apiInstance.post("/users/uploadexcel", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":
        "multipart/form-data; boundary=<calculated when request is sent>",
    },
  });

export const confirmUserExcel = (filename, token) =>
  apiInstance.get(`/users/confirm/${filename}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const cancelUserExcel = (filename, token) =>
  apiInstance.get(`/users/cancel/${filename}`, {
    headers: { Authorization: `Bearer ${token}` },
  });



  
//Department
export const createDepartment = (formData, token) =>
apiInstance.post(
  "/departments/",
  { ...formData },
  { headers: { Authorization: `Bearer ${token}` } }
);

export const searchDepartByName = (name, token) =>
apiInstance.get(`departments?name=${name}`, {
  headers: { Authorization: `Bearer ${token}` },
});

export const getAllDepartment = (token) =>
apiInstance.get("/departments/", {
  headers: { Authorization: `Bearer ${token}` },
});

export const findDepartmentByID = (token, id) =>
apiInstance.get(`/departments/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});

export const updateDepartment = (formData, id, token) =>
apiInstance.put(
  `/departments/${id}`,
  { ...formData },
  { headers: { Authorization: `Bearer ${token}` } }
);

export const deleteDepartment = (token, id) =>
apiInstance.delete(`/departments/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});
export const reactiveDepartment = (token, id) =>
apiInstance.get(`/departments/reactive/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});

export const getAllSubRoute = () => {};




