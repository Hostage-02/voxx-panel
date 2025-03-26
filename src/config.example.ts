// 系统配置示例
export interface AppConfig {
  version: number
  theme: {
    darkMode: boolean
    primaryColor: string
    secondaryColor: string
  }
  services: {
    name: string
    internalUrl: string
    externalUrl: string
    icon?: string
  }[]
  wallpapers: {
    path: string
    enableTransition: boolean
    defaultBlur: number
  }
}

const config: AppConfig = {
  version: 1,
  theme: {
    darkMode: false,
    primaryColor: '#1976D2',
    secondaryColor: '#424242'
  },
  services: [
    {
      name: '管理后台',
      internalUrl: 'http://192.168.1.100:8080',
      externalUrl: 'https://admin.example.com',
      icon: 'mdi-cog'
    },
    {
      name: '文件管理', 
      internalUrl: 'http://192.168.1.100:8081',
      externalUrl: 'https://files.example.com',
      icon: 'mdi-folder'
    }
  ],
  wallpapers: {
    path: '/public/wallpapers',
    enableTransition: true,
    defaultBlur: 0
  }
}

export default config
