export interface Role {
  user_id: number;
  nontri_id: number;
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
      user_id: 1,
      nontri_id: 1,
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
      user_id: 2,
      nontri_id: 2,
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
      user_id: 4,
      nontri_id: 4,
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
