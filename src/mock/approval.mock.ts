import { User } from './user.mock';
export interface Requester {
  user_id: number;
  user: User | null;
  approver_order1: {
    id: number;
    other_prefix: string;
    prefix: string;
    fullname: string;
    gender: string;
    position: string;
    faculty: string;
    department: string;
    employment_start_date: string;
  }[];
  approver_order2: {
    id: number;
    other_prefix: string;
    prefix: string;
    fullname: string;
    gender: string;
    position: string;
    faculty: string;
    department: string;
    employment_start_date: string;
  }[];
  approver_order3: {
    id: number;
    other_prefix: string;
    prefix: string;
    fullname: string;
    gender: string;
    position: string;
    faculty: string;
    department: string;
    employment_start_date: string;
  }[];
  approver_order4: {
    id: number;
    other_prefix: string;
    prefix: string;
    fullname: string;
    gender: string;
    position: string;
    faculty: string;
    department: string;
    employment_start_date: string;
  }[];
}

export const ApprovalMock = {
  list: [
    {
      user_id: 1,
      user: {
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
      approver_order1: [
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
      ],
      approver_order2: [],
      approver_order3: [],
      approver_order4: [],
    },
    {
      user_id: 2,
      user: {
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
      approver_order1: [
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
        },
      ],
      approver_order2: [
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
      ],
      approver_order3: [],
      approver_order4: [],
    },
  ],
};
