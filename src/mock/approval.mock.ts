import { User } from './user.mock';
export interface Requester {
  nontri_account: string;
  user: User | null;
  approver_order1: {
    nontri_account: string;
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
    nontri_account: string;
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
    nontri_account: string;
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
    nontri_account: string;
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
      nontri_account: 'fengptu',
      user: {
        nontri_account: 'fengptu',
        other_prefix: 'ผศ.ดร.',
        prefix: 'นางสาว',
        fullname: 'วรัญญา อรรถเสนา',
        gender: 'female',
        position: '',
        faculty: 'วิศวกรรมศาสตร์',
        department: 'วิศวกรรมคอมพิวเตอร์',
        employment_start_date: '2025-11-09',
      },
      approver_order1: [
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
      ],
      approver_order2: [],
      approver_order3: [],
      approver_order4: [],
    },
    {
      nontri_account: 'anumat',
      user: {
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
      approver_order1: [
        {
          nontri_account: 'fengptu',
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
      ],
      approver_order3: [],
      approver_order4: [],
    },
    {
      nontri_account: 'fengpny',
      user: {
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
      approver_order1: [
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
      ],
      approver_order2: [
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
      ],
      approver_order3: [
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
      ],
      approver_order4: [
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
      ],
    },
  ],
};
