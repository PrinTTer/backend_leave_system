export interface Role {
  nontri_account: string;
  approve_position: string;
  role: {
    role_id: number;
    thai_name: string;
    priority: number;
    visibility: string;
  }[];
}

export const Role = {
  list: [
    {
      nontri_account: 'fengptu',
      approve_position: 'หัวหน้าภาควิชาวิศวกรรมคอมพิวเตอร์',
      role: [
        {
          role_id: 1,
          thai_name: 'ผู้อนุมัติลำดับที่ 1',
          priority: 1,
          visibility: 'show',
        },
        {
          role_id: 2,
          thai_name: 'ผู้อนุมัติลำดับที่ 2',
          priority: 2,
          visibility: 'show',
        },
      ],
    },
    {
      nontri_account: 'anumat',
      approve_position: 'รักษาการแทนหัวหน้าภาควิชาวิศวกรรมคอมพิวเตอร์',
      role: [
        {
          role_id: 1,
          thai_name: 'ผู้อนุมัติลำดับที่ 1',
          priority: 1,
          visibility: 'show',
        },
        {
          role_id: 2,
          thai_name: 'ผู้อนุมัติลำดับที่ 2',
          priority: 2,
          visibility: 'show',
        },
      ],
    },
    {
      nontri_account: 'fengscd',
      approve_position: 'คณบดีคณะวิศวกรรมศาสตร์',
      role: [
        {
          role_id: 1,
          thai_name: 'ผู้อนุมัติลำดับที่ 1',
          priority: 1,
          visibility: 'show',
        },
        {
          role_id: 2,
          thai_name: 'ผู้อนุมัติลำดับที่ 2',
          priority: 2,
          visibility: 'show',
        },
      ],
    },
  ],
};
