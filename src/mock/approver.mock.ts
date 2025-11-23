export interface Approver {
  id: number;
  other_prefix: string;
  prefix: string;
  fullname: string;
  gender: string;
  position: string;
  faculty: string;
  department: string;
  employment_start_date: string;
  approve_position: string;
  approval_order: {
    role_id: number;
    thai_name: string;
    priority: number;
  }[];
}

export const ApproverMock = {
  list: [
    {
      id: 1,
      other_prefix: 'ผศ.',
      prefix: 'นางสาว',
      fullname: 'วรัญญา อรรถเสนา',
      gender: 'female',
      position: 'หัวภาควิชาวิศวกรรมคอมพิวเตอร์',
      faculty: 'คณะวิศวกรรมศาสตร์',
      department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
      employment_start_date: '2014-01-15',
      approve_position: 'หัวภาควิชาวิศวกรรมคอมพิวเตอร์',
      approval_order: [
        {
          role_id: 2,
          thai_name: 'ผู้อนุมัติลำดับที่ 1',
          priority: 1,
        },
      ],
    },
    {
      id: 2,
      other_prefix: 'อ.ร้อยโท',
      prefix: 'นาย',
      fullname: 'อนุมัติ อิงคนินันท์',
      gender: 'male',
      position: 'รองหัวหน้าภาควิชาวิศวกรรมคอมพิวเตอร์',
      faculty: 'คณะวิศวกรรมศาสตร์',
      department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
      employment_start_date: '2014-03-01',
      approve_position: 'รักษาการแทนหัวภาควิชาวิศวกรรมคอมพิวเตอร์',
      approval_order: [
        {
          role_id: 2,
          thai_name: 'ผู้อนุมัติลำดับที่ 1',
          priority: 1,
        },
      ],
    },
    {
      id: 4,
      other_prefix: 'รศ.',
      prefix: 'นาย',
      fullname: 'สมชาย ดอนเจดีย์',
      gender: 'male',
      position: 'คณบดีคณะวิศวกรรมศาสตร์',
      faculty: 'คณะวิศวกรรมศาสตร์',
      department: 'ภาควิชาวิศวกรรมชลประทาน',
      employment_start_date: '2010-03-01',
      approve_position: 'คณบดีคณะวิศวกรรมศาสตร์',
      approval_order: [
        {
          role_id: 2,
          thai_name: 'ผู้อนุมัติลำดับที่ 1',
          priority: 1,
        },
        {
          role_id: 3,
          thai_name: 'ผู้อนุมัติลำดับที่ 2',
          priority: 2,
        },
        {
          role_id: 4,
          thai_name: 'ผู้อนุมัติลำดับที่ 3',
          priority: 3,
        },
      ],
    },
    {
      id: 5,
      other_prefix: '',
      prefix: 'นางสาว',
      fullname: 'เพชรน้อย ยอดอยู่ดี',
      gender: 'female',
      position: 'หัวหน้าสำนักงานเลขานุการ คณะฯ',
      faculty: 'คณะวิศวกรรมศาสตร์',
      department: 'สำนักงานเลขานุการ',
      employment_start_date: '2010-03-01',
      approve_position: 'รักษาการแทนคณบดีคณะวิศวกรรมศาสตร์',
      approval_order: [
        {
          role_id: 2,
          thai_name: 'ผู้อนุมัติลำดับที่ 1',
          priority: 1,
        },
        {
          role_id: 3,
          thai_name: 'ผู้อนุมัติลำดับที่ 2',
          priority: 2,
        },
      ],
    },
  ],
};
