import Request from 'winning-request'
import { Message } from 'element-ui'

const isProduction = process.env.NODE_ENV === 'production'
export const request = new Request({
  baseURL: isProduction ? '/outp-finance-fee' : 'http://172.16.6.29:41250',
  Message,
  isAddSoid: true
})

export default request

export const commonRequest = new Request({
  baseURL: '/finance-common/',
  Message,
  isAddSoid: true
})
