<template>
    <div class="win-his-header-wrapper">
        <div class="win-his-header">
            <div class="win-his-header--logo-wrapper">
                <win-svg class="logo-image" icon-class="header_logo" />
                <el-popover placement="bottom" ref="application-select" width="220" trigger="click" popper-class="application-popover">
                    <div class="win-his-header-application-list">
                        <div v-for="item in applicationList" :key="item.id" class="application-option"
                            @click="handlerToggleApplication(item)">
                            {{item.name}}</div>
                    </div>
                    <span slot="reference"
                        class="application-name">
                        <span class="text">{{currentApplication.name}}</span>
                        <i class="el-icon-sort"></i>
                    </span>
                </el-popover>
            </div>
            <div class="win-his-header-wrapper--nav-wrapper">
                <div class="menu-list">
                    <scroll-pane ref="scrollPane" class="scroll-view-wrapper" style="height: 100%;">
                        <div class="router-link-wrapper">
                            <router-link v-for="route in routes" ref="route" :key="route.id" class="nav-wrap"
                                active-class="active" :to="route.path">
                                <div class="nav-item">
                                    <div class="nav-content">
                                        <span>{{ route.name }}</span>
                                    </div>
                                    <i class="right-icon el-icon-close"
                                        @click.stop.prevent="handleRemoveMenu(route)"></i>
                                </div>
                            </router-link>
                            <el-popover placement="bottom" width="200" trigger="click" ref="more-menu-popover" @hide="()=>moreMenuListVisible=false"
                               @show="()=>moreMenuListVisible=true" popper-class="more-menu-popover" >
                                <div class="more-container">
                                    <!-- <el-popover placement="right" width="200" trigger="manual"
                                        ref="recently-menu-popover" popper-class="recently-menu-popover"
                                        v-model="recentlyVisible">
                                        <div class="recently">
                                            <div class="title">最近使用</div>
                                            <div v-for="(item, index) in recentlyMenu" :key="index"
                                                class="recently-item" @click="handleAddMenu(item)">{{item.name}}</div>
                                        </div>
                                        <span slot="reference" @click="toogleShowRecently">
                                            <el-input placeholder="请输入关键字检索" size="mini" class="search"
                                                suffix-icon="el-icon-search" v-model="keyword" />
                                        </span>
                                    </el-popover> -->
                                    <el-input placeholder="请输入关键字检索" size="mini" class="search"
                                                suffix-icon="el-icon-search" v-model="keyword" />
                                    <el-tree ref="tree" :data="applicationList" :filter-node-method="filterNode"
                                        :props="{ children: 'children', label: 'name'}" @node-click="handleNodeClick">
                                    </el-tree>
                                </div>
                                <span slot="reference"
                                    class="more-menu">
                                    <span class="text">
                                        <span>更多</span>
                                        <i :class="`el-icon-caret-${moreMenuListVisible?'top':'bottom'}`"></i>
                                    </span>
                                </span>
                            </el-popover>
                        </div>
                    </scroll-pane>
                </div>
            </div>
            <div class="win-his-header-right">

                <!-- 用户信息 -->
                <el-dropdown class="user-info" trigger="click" @command="handleUserDropdownClick">
                    <div class="el-dropdown-link user-info">
                        <div class="patient-avatar">
                            <win-patientAvatar width="24" :url="userOption.avatarUrl" :gender="userOption.gender"
                                :code="userOption.code" />
                        </div>
                        <span class="userName">{{userOption.userName}}</span>
                    </div>
                    <el-dropdown-menu class="win-header-drop" slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in userOption.dropOptions" :key="index" :icon="item.icon"
                            :command="item.command" :divided="item.divided" :disabled="item.disabled">
                            <span>{{item.name}}</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="win-his-heade-split-line"></div>
    </div>
</template>

<script>
    import ScrollPane from './ScrollPane'
    export default {
      components: { ScrollPane },
      props: {
        applicationList: {
          type: Array,
          default: () => []
        },
        currentApplication: {
          type: Object,
          default: () => {}
        },
        userOption: {
          type: Object,
          default: () => ({
            userName: '用户',
            avatarUrl: '',
            gender: '',
            code: '',
            dropOptions: [{ // 用户下拉选项
              icon: 'win-icon-medicalHuman',
              name: '个人中心',
              disabled: true
            },
            {
              icon: 'el-icon-user',
              name: '切换用户',
              command: () => {
                console.log('切换成功')
              }
            },
            {
              icon: 'el-icon-headset',
              name: '注销',
              divided: true,
              command: () => {
                console.log('你已注销')
              }
            }]
          })
        }
      },
      computed: {
        routes () {
          return this.currentApplication.children
        }
      },
      data () {
        return {
          contextmenuVisible: false,
          moreMenuListVisible: false,
          recentlyVisible: false,
          keyword: ''
        //   recentlyMenu: [{
        //     name: '测试最近使用的1',
        //     path: '/test1'
        //   }, {
        //     name: '测试最近使用的2',
        //     path: '/test2'
        //   }]
        }
      },
      watch: {
        keyword (val) {
          this.$refs.tree.filter(val)
        },
        $route (val) {
          const { path } = val
          this.$store.dispatch('checkAppChange', path)
          this.moveToCurrentRoute()
        }
      },
      methods: {
        moveToCurrentRoute () {
          const routes = this.$refs.route
          routes && this.$nextTick(() => {
            for (const route of routes) {
              if (route.to === this.$route.path) {
                this.$refs.scrollPane.moveToTarget(route)
                break
              }
            }
          })
        },
        handleRemoveMenu (route) {
          const index = this.routes.findIndex(item => item.path === route.path)
          const length = this.routes.length
          if (length === 1) {
            this.$message.warning('不能删除全部菜单')
            return
          }
          if (this.$router.currentRoute.path === route.path) { // 如果关闭的是当前路由
            if (index + 1 < length) { // 如果当前关闭的是不是最后一个，则跳转下一个路由
              this.$router.push(this.routes[index + 1].path)
            } else { // 如果关闭的是最后一个菜单，则当前路由跳转至前一个菜单
              this.$router.push(this.routes[index - 1].path)
            }
          }
          this.$store.commit('ADD_APP_MENU_LIST', { increase: false, menu: route })
        },
        handleAddMenu (route) {
          this.$refs['more-menu-popover'].doClose()
          //   this.$refs['recently-menu-popover'].doClose()
          this.$router.push(route.path)
          const index = this.routes.findIndex(item => item.path === route.path)
          if (!~index) {
            this.$store.commit('ADD_APP_MENU_LIST', { increase: true, menu: route })
          }
        },
        handleNodeClick (data) {
          if (data.children) return
          this.handleAddMenu(data)
        },
        filterNode (value, data) {
          if (!value) return true
          return data.name.indexOf(value) !== -1
        },
        toogleShowRecently () {
          this.recentlyVisible = !this.recentlyVisible
          this.$nextTick(() => {
            if (this.recentlyVisible) {
              this.$nextTick(() => {
                const parentDom = this.$refs['more-menu-popover'].$refs.popper
                const dom = this.$refs['recently-menu-popover'].$refs.popper
                dom.style.top = `calc(${parentDom.style.top} + 12px)`
              })
            }
          })
        },
        handlerToggleApplication ({ id }) {
          this.$store.commit('ADD_CURRENT_APP_ID', id)
          this.$refs['application-select'].doClose()
        },
        handleUserDropdownClick (command) {
          typeof command === 'function' && command()
        }
      }
    }
</script>

<style lang="scss">
    .win-his-header-wrapper {
        .win-his-header {
            height: 48px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            min-width: 100%;
            background: url(img/win-header-bg-primary.svg) center no-repeat #2D5AFA;

            .win-his-header--logo-wrapper {
                flex-basis: 314px;
                flex-shrink: 0;
                padding-left: 24px;
                display: flex;
                align-items: center;
                cursor: pointer;
                box-sizing: border-box;
                font-size: 20px;
                color: #fff;

                .logo-image {
                    width: 94px;
                    height: 32px;
                    margin-right: 20px;
                }

                .application-name {
                    display: inline-block;
                    padding-left: 16px;
                    padding: 0 8px;
                    font-size: 20px;
                    color: #FFFFFF;
                    border: 1px solid #fff;
                    display: flex;
                    align-items: center;

                    .text {
                        display: inline-block;
                        width: 184px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    i {
                        font-weight: bold;
                        font-size: 20px;
                        transform: rotate(90deg);
                    }

                }
            }


            .win-his-header-wrapper--nav-wrapper {
                flex: 1;
                width: 100%;
                height: 100%;
                margin-left: 125px;
                display: flex;
                align-items: center;
                overflow: hidden;
                .menu-list {
                    height: 48px;
                    flex:1;
                    overflow: hidden;
                    .router-link-wrapper {
                        height: 100%;
                        display: flex;
                        align-items: center;

                        .nav-wrap {
                            align-self: flex-end;

                            &.active {
                                .nav-item {
                                    /* width: 168px; */
                                    background-image: linear-gradient(180deg, #FFFFFF 0%, #5175F4 100%);

                                    .nav-content {
                                        opacity: 1;
                                        font-size: 16px;
                                        /* font-weight: 600; */
                                        color: #0F2350;

                                        .main {
                                            font-size: 16.8px;
                                        }

                                        .sub {
                                            font-size: 14.4px;
                                        }
                                    }

                                    .right-icon {
                                        color: #0F2350;
                                    }
                                }
                            }

                            .nav-item {
                                display: flex;
                                align-items: center;
                                cursor: pointer;
                                /* padding: 0 20px 0 40px; */
                                margin-right: 4px;
                                /* width: 155px; */
                                height: 44px;
                                text-align: center;
                                border-radius: 14px 14px 0 0;
                                box-sizing: border-box;
                                background: rgba($color: #000, $alpha: .16);

                                .left-icon {

                                    width: 24px;
                                    height: 24px;
                                    border-radius: 50%;
                                    background-color: #fff;
                                }

                                .nav-content {
                                    flex: 1;
                                    font-size: 16px;
                                    color: #FFFFFF;
                                    padding: 0 28px 0 42px;
                                    font-weight: 500;
                                    opacity: 0.65;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;

                                    .main {
                                        font-size: 14px;
                                    }

                                    .sub {
                                        font-size: 12px;
                                    }
                                }

                                .right-icon {
                                    border-radius: 50%;
                                    font-size: 16px;
                                    margin-right: 6px;
                                    color: rgba($color: #fff, $alpha: .5);
                                }
                            }

                        }

                    }
                }

                .more-menu {
                    flex-shrink: 0;
                    margin-left: 20px;
                    cursor: pointer;

                    .text {
                        font-size: 18px;
                        color: #fff;
                    }

                }
            }

            .win-his-header-right {
                /* width: 200px; */
                flex-shrink: 0;
                width: 100px;
                height: 48px;
                line-height: 48px;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .user-info {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-right: 8px;

                    .icon-person {
                        margin-right: 6px;
                        display: inline-block;
                        vertical-align: middle;
                        width: 36px;
                        height: 25px;
                    }

                    .patient-avatar {
                        line-height: 1;
                        margin-right: 6px;
                    }

                    .userName {
                        font-family: SourceHanSansCN-Bold;
                        font-size: 16px;
                        font-weight: 600;
                        color: #FFFFFF;
                        vertical-align: middle;
                    }
                }
            }
        }

        .win-his-heade-split-line {
            height: 1px;
            background-color: #dce2f9;
        }
    }

    .application-popover {
        padding: 0 !important;
        margin-top: 2px !important;

        .popper__arrow {
            display: none !important;
            ;
        }

        .win-his-header-application-list {

            .application-option {
                list-style: none;
                line-height: 36px;
                padding: 0 20px;
                margin: 0;
                font-size: 14px;
                color: #606266;
                cursor: pointer;
                outline: 0;

                &:hover {
                    background-color: #eaefff;
                    color: #577bfb;
                }
            }
        }


    }

    .more-menu-popover {
        .more-container {
            .search {
                margin-bottom: 10px;

                .el-input__inner {
                    background-color: #f5f5f5;
                    border-radius: 6px;
                    padding: 0 20px;
                }
            }
        }
    }

    .recently-menu-popover {

        /* padding: 0 !important; */
        .recently {
            .title {
                border-bottom: 1px solid #d1d1d1;
                margin-bottom: 8px;
                padding: 4px 8px;
            }

            .recently-item {
                padding: 4px 8px;
                cursor: pointer;

                &:hover {
                    background-color: #F5F7FA;
                }
            }
        }
    }
</style>