export interface Employee {
  _id?: string;
  id: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  probationDate: string;
  officialDate: string;
  contractType: string;
  seniority: string;
  insurance: string;
  status: string;
  password: string;
  permissions: string[];
}

export async function fetchEmployeesAPI(): Promise<Employee[]> {
  try {
    const res = await fetch("/api/employee");
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không hợp lệ");
    }
    return data;
  } catch (error) {
    console.error("Lỗi gọi API:", error);
    throw error;
  }
}

export async function addEmployeeAPI(newEmployee: Employee): Promise<Employee> {
  try {
    const res = await fetch("/api/employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API Error: ${res.status} - ${text}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Lỗi khi thêm nhân sự:", error);
    throw error;
  }
}

export async function uploadAvatarAPI(
  tempAvatarFile: File,
  employeeId: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", tempAvatarFile);
  formData.append("_id", employeeId);

  const uploadRes = await fetch("/api/upload-avatar", {
    method: "POST",
    body: formData,
  });
  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(`Upload Error: ${uploadRes.status} - ${text}`);
  }
  const uploadData = await uploadRes.json();
  return `${uploadData.url}?t=${Date.now()}`;
}

export async function updateEmployeeAPI(
  employee: Employee,
  tempAvatarFile?: File | null
): Promise<Employee> {
  try {
    let updatedAvatarUrl = employee.avatar;
    if (tempAvatarFile && employee._id) {
      updatedAvatarUrl = await uploadAvatarAPI(tempAvatarFile, employee._id);
    }
    const res = await fetch(`/api/employee/${employee._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...employee, avatar: updatedAvatarUrl }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API Error: ${res.status} - ${text}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân sự:", error);
    throw error;
  }
}

export async function deleteEmployeeAPI(employeeId: string): Promise<void> {
  try {
    const res = await fetch(`/api/employee/${employeeId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API Error: ${res.status} - ${text}`);
    }
  } catch (error) {
    console.error("Lỗi khi xóa nhân sự:", error);
    throw error;
  }
}
