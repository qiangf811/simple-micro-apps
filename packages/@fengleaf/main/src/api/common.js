
import { commonRequest } from '../lib/request.js'

const getApplicationListUrl = '/api/v1/app_finance_common/app_system_and_menu/query/by_user_id'

// eslint-disable-next-line
export const getApplicationList = commonRequest.temp(getApplicationListUrl, {
  warning: false
})
