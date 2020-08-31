import Vue from 'vue'
import { addGlobalUncaughtErrorHandler, removeGlobalUncaughtErrorHandler } from 'qiankun'

export default {
    mounted() {
        const errorHandler = event => {
            if (event instanceof ErrorEvent) {
                const { message } = event
                const words = 'died in status LOADING_SOURCE_CODE: Failed to fetch'
                if (message.includes(words)) {
                    // console.log(message);
                    const routePath = `/${message.match(/application\s(\S*)\sdied/)[1].replace(/'/g, '')}`
                    // console.log(routePath)
                    if (this.$router.currentRoute.path === routePath) {
                        import('../views/404').then(component => {
                            const Ctor = Vue.extend(component.default)
                            new Ctor().$mount('#subapp-viewport')
                        })
                    }
                }
            }
        }
        addGlobalUncaughtErrorHandler(errorHandler)
        this.$once('hook:beforeDestory', () => removeGlobalUncaughtErrorHandler(errorHandler))
    }
}
