/**
 * 全局配置文件
 */
export default {
    title: "Tank",
    logo: "A",
    indexTitle: 'Tank Admin',
    lockPage: '/lock',
    tokenTime: 6000,
    info: {
        title: "Tank Admin 快速开发框架",
        list: [
            'Tank Admin 快速开发框架',
            '简单 快捷',
            '高效 方便',
        ]
    },
    //http的status默认放行不才用统一处理的,
    statusWhiteList: [400],
    //配置首页不可关闭
    isFirstPage: false,
    fistPage: {
        label: "首页",
        value: "/wel/index",
        params: {},
        query: {},
        group: [],
        close: false
    },
    //配置菜单的属性
    menu: {
        props: {
            label: 'label',
            path: 'path',
            icon: 'icon',
            children: 'children'
        }
    }
}