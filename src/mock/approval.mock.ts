export const ApprovalMock = {
  list: [
    {
      id: 1,
      adminPosition: 'หัวหน้าฝ่ายเทคนิค',
      fullname: 'สมชาย ใจดี',
      position: 'หัวหน้าฝ่าย',
      department: 'ฝ่ายเทคนิค',
      requesterOrder1: 'ผู้ขออนุมัติ 1',
      requesterOrder2: 'ผู้ขออนุมัติ 2',
      requesterOrder3: 'ผู้ขออนุมัติ 3',
      requesterOrder4: 'ผู้ขออนุมัติ 4',
    },
    {
      id: 2,
      adminPosition: 'หัวหน้าฝ่ายการเงิน',
      fullname: 'สมหญิง สายดี',
      position: 'หัวหน้าฝ่าย',
      department: 'ฝ่ายการเงิน',
      requesterOrder1: 'ผู้ขออนุมัติ 1',
      requesterOrder2: 'ผู้ขออนุมัติ 2',
      requesterOrder3: 'ผู้ขออนุมัติ 3',
      requesterOrder4: 'ผู้ขออนุมัติ 4',
    },
  ],

  detail: (id: number) => ({
    id,
    adminPosition: 'หัวหน้าฝ่าย',
    fullname: `Approval ${id}`,
    position: 'หัวหน้าฝ่าย',
    department: 'ฝ่ายทั่วไป',
    requesterOrder1: 'ผู้ขออนุมัติ 1',
    requesterOrder2: 'ผู้ขออนุมัติ 2',
    requesterOrder3: 'ผู้ขออนุมัติ 3',
    requesterOrder4: 'ผู้ขออนุมัติ 4',
  }),
};
