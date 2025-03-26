import localforage from 'localforage';
import type { AppConfig } from './config.example';

// 严格类型定义
interface NavItem {
  id: string;
  name: string;
  internalUrl: string;
  externalUrl: string;
  icon?: string;
  order?: number;
}

interface NavGroup {
  id: string;
  name: string;
  icon?: string;
  items: NavItem[];
  createdAt: number;
  updatedAt: number;
  order?: number;
}

interface StorageSchema {
  version: number;
  groups: NavGroup[];
  config?: Partial<AppConfig>;
  lastUpdated?: number;
}

// 错误类型
enum StorageError {
  INVALID_JSON = 'INVALID_JSON',
  VERSION_MISMATCH = 'VERSION_MISMATCH',
  VALIDATION_FAILED = 'VALIDATION_FAILED'
}

class StorageException extends Error {
  constructor(
    public code: StorageError,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'StorageException';
  }
}

// 存储配置
const store = localforage.createInstance({
  name: 'nas-navigation',
  storeName: 'config',
  version: 1.0
});

// 当前版本
const CURRENT_VERSION = 1;

// 初始化存储
export async function initStorage(): Promise<StorageSchema> {
  let data = await store.getItem<StorageSchema>('config');
  
  if (!data) {
    data = { version: CURRENT_VERSION, groups: [] };
    await store.setItem('config', data);
  } else if (data.version < CURRENT_VERSION) {
    data = migrateData(data);
  }

  return data;
}

// 数据迁移
function migrateData(oldData: any): StorageSchema {
  // 版本迁移逻辑
  return {
    version: CURRENT_VERSION,
    groups: oldData.groups || []
  };
}

// 核心操作方法
export const storage = {
  async getGroups(): Promise<NavGroup[]> {
    const data = await initStorage();
    return data.groups;
  },

  async addGroup(group: Omit<NavGroup, 'id'|'createdAt'|'updatedAt'>): Promise<NavGroup> {
    const data = await initStorage();
    const newGroup: NavGroup = {
      ...group,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    data.groups.push(newGroup);
    await store.setItem('config', data);
    return newGroup;
  },

  async exportConfig(): Promise<string> {
    const data = await initStorage();
    return JSON.stringify(data, null, 2);
  },

  async importConfig(json: string): Promise<void> {
    // 1. 验证JSON有效性
    if (!json || typeof json !== 'string') {
      throw new Error('配置必须是非空字符串');
    }

    // 2. 过滤非法字符
    const sanitized = json.replace(/[^\x20-\x7E]/g, '');

    // 3. 沙箱环境解析
    let imported: StorageSchema;
    try {
      imported = JSON.parse(sanitized);
    } catch (e) {
      throw new Error('无效的JSON格式');
    }

    // 4. 结构验证
    if (!imported || typeof imported !== 'object') {
      throw new Error('配置必须是有效对象');
    }
    if (!imported.version || typeof imported.version !== 'number') {
      throw new Error('缺少版本号或版本号格式错误');
    }
    if (!Array.isArray(imported.groups)) {
      throw new Error('分组数据必须是数组');
    }

    // 5. 深度校验
    for (const group of imported.groups) {
      if (!group.id || typeof group.id !== 'string') {
        throw new Error('分组ID必须是非空字符串');
      }
      if (!Array.isArray(group.items)) {
        throw new Error('分组条目必须是数组');
      }
      for (const item of group.items) {
        if (!item.id || typeof item.id !== 'string') {
          throw new Error('条目ID必须是非空字符串');
        }
        if (typeof item.internalUrl !== 'string' || 
            typeof item.externalUrl !== 'string') {
          throw new Error('URL必须是字符串');
        }
      }
    }

    // 6. 保存验证后的配置
    await store.setItem('config', imported);
  },

  // 新增方法
  async getCurrentUrl(item: NavItem, isInternal: boolean): Promise<string> {
    return isInternal ? item.internalUrl : item.externalUrl;
  },

  async openNewWindow(item: NavItem, isInternal: boolean): Promise<void> {
    const url = await this.getCurrentUrl(item, isInternal);
    window.open(url, '_blank');
  },

  async saveGroups(groups: NavGroup[]): Promise<void> {
    const data = await initStorage();
    data.groups = groups;
    await store.setItem('config', data);
  }
};
