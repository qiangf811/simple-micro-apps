
import { commonRequest } from '../lib/request.js'

const getApplicationMenuUrl = '/api/v1/app_finance_common/app_menu/query/by_user_id'

// eslint-disable-next-line
export const getApplicationMenu = commonRequest.temp(getApplicationMenuUrl, {
  warning: false
})
