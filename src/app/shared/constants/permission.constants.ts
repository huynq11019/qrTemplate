export const PERMISSION_TYPE = {
  CREATE: 'CREATE',    // them moi
  UPDATE: 'UPDATE',    // sua
  DELETE: 'DELETE',    // xoa
  VIEW: 'VIEW'       // xem
};

// đầu mục các chức năng trong hệ thống, bổ sung đồng thời khi thêm chức năng ở bảng permission.
export const RESOURCE_CONSTANT = [
  {
    code: 'ROLE',
    label: 'model.permission.user-management',
    permissions: []
  },
  {
    code: 'SYSTEM-PROPERTY',
    label: 'model.permission.user-management',
    permissions: []
  },
  {
    code: 'USER',
    label: 'model.permission.user-management',
    permissions: []
  },
];
