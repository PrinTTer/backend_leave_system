export interface User {
  id: number;
  other_prefix: string;
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
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
      other_prefix: '',
      prefix: 'นางสาว',
      fullname: 'เพชรน้อย ยอดอยู่ดี',
      gender: 'female',
      position: 'หัวหน้าสำนักงานเลขานุการ คณะฯ',
      faculty: 'คณะวิศวกรรมศาสตร์',
      department: 'สำนักงานเลขานุการ',
      employment_start_date: '2010-03-01',
    },
    {
      id: 6,
      other_prefix: '',
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
