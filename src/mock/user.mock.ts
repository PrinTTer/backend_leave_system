export interface User {
  nontri_account: string;
  other_prefix: string | null;
  prefix: string;
  fullname: string;
  gender: string;
  position: string;
  faculty: string;
  department: string;
  employment_start_date: string;
}

export const UserMock = {
  list: [
    {
      nontri_account: 'fengptu',
      other_prefix: 'ผศ.',
      prefix: 'นางสาว',
      fullname: 'วรัญญา อรรถเสนา',
      gender: 'female',
      position: 'หัวหน้าภาควิชาวิศวกรรมคอมพิวเตอร์',
      faculty: 'คณะวิศวกรรมศาสตร์',
      department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
      employment_start_date: '2014-01-15',
    },
    {
      nontri_account: 'anumat',
      other_prefix: 'อ.ร้อยโท',
      prefix: 'นาย',
      fullname: 'อนุมัติ อิงคนินันท์',
      gender: 'male',
      position: 'รองหัวหน้าภาควิชาวิศวกรรมคอมพิวเตอร์',
      faculty: 'คณะวิศวกรรมศาสตร์',
      department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
      employment_start_date: '2014-03-01',
    },
    {
      nontri_account: 'theerawat',
      other_prefix: 'อ.',
      prefix: 'นาย',
      fullname: 'ธีรวัฒน์ หวายฤทธิ์',
      gender: 'male',
      position: 'อาจารย์',
      faculty: 'คณะวิศวกรรมศาสตร์',
      department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
      employment_start_date: '2024-03-01',
    },
    {
      nontri_account: 'fengscd',
      other_prefix: 'รศ.',
      prefix: 'นาย',
      fullname: 'สมชาย ดอนเจดีย์',
      gender: 'male',
      position: 'คณบดีคณะวิศวกรรมศาสตร์',
      faculty: 'คณะวิศวกรรมศาสตร์',
      department: 'ภาควิชาวิศวกรรมชลประทาน',
      employment_start_date: '2010-03-01',
    },
    {
      nontri_account: 'fengpny',
      other_prefix: null,
      prefix: 'นางสาว',
      fullname: 'เพชรน้อย ยอดอยู่ดี',
      gender: 'female',
      position: 'หัวหน้าสำนักงานเลขานุการ คณะฯ',
      faculty: 'คณะวิศวกรรมศาสตร์',
      department: 'สำนักงานเลขานุการ',
      employment_start_date: '2010-03-01',
    },
    {
      nontri_account: 'fengjts',
      other_prefix: null,
      prefix: 'นางสาว',
      fullname: 'จุฑาทิพย์ ทรัพย์ฤทธา',
      gender: 'female',
      position: 'เจ้าหน้าที่บริหารงานทั่วไป',
      faculty: 'คณะวิศวกรรมศาสตร์',
      department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
      employment_start_date: '2010-03-01',
    },
  ],
};
