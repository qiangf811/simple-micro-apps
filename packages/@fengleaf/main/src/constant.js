export const APP_MENU_COD = '4302708202' // 门诊费用的菜单code

export const ROUTER_MAP = {
  outpCharge: {
    name: '门诊收费',
    developmentUrl: '//localhost:3001',
    productionUrl: '/charge/'
  },
  outpRefund: {
    name: '门诊退费',
    developmentUrl: '//localhost:3000',
    productionUrl: '/refund/'
  },
  orderTracking: {
    name: '订单查询',
    developmentUrl: '//localhost:3002',
    productionUrl: '/orderTracking/'
  },
  feeCompare: {
    name: '费用对比',
    developmentUrl: '//localhost:3003',
    productionUrl: '/feeCompare/'
  },
  receiptPrinting: {
    name: '票据打印',
    developmentUrl: '//localhost:3004',
    productionUrl: '/router-test/'
  }
}
