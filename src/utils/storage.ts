/* eslint-disable @typescript-eslint/no-explicit-any */
interface Storage {
  get: (keys: string[]) => Promise<Record<string, any>>;
  set: (items: Record<string, any>) => Promise<void>;
  clear: () => Promise<void>;
}

class ChromeStorage implements Storage {
  async get(keys: string[]): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(keys, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
  }

  async set(items: Record<string, any>): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(items, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }
}

class MockStorage implements Storage {
  async get(keys: string[]): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) {
        result[key] = JSON.parse(value);
      }
    });
    return result;
  }

  async set(items: Record<string, any>): Promise<void> {
    Object.keys(items).forEach((key) => {
      localStorage.setItem(key, JSON.stringify(items[key]));
    });
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }
}


const isProduction = import.meta.env.MODE === 'production';

export const storage: Storage = isProduction ? new ChromeStorage() : new MockStorage();
