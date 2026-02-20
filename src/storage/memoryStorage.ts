import { Book, User, Loan } from '../models/types';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');
const BOOKS_FILE = path.join(DATA_DIR, 'books.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LOANS_FILE = path.join(DATA_DIR, 'loans.json');

class MemoryStorage {
  private static instance: MemoryStorage;
  
  public books: Map<string, Book> = new Map();
  public users: Map<string, User> = new Map();
  public loans: Map<string, Loan> = new Map();

  private constructor() {}

  public static getInstance(): MemoryStorage {
    if (!MemoryStorage.instance) {
      MemoryStorage.instance = new MemoryStorage();
    }
    return MemoryStorage.instance;
  }

  public async init() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    
      await Promise.all([
        this.loadMap(this.books, BOOKS_FILE),
        this.loadMap(this.users, USERS_FILE),
        this.loadMap(this.loans, LOANS_FILE)
      ]);
      
      console.log('- Дані завантажено =)');
    } catch (error) {
      console.error('# Помилка завантаження даних:', error);
    }
  }

  public async save() {
    try {
      await Promise.all([
        this.saveMap(this.books, BOOKS_FILE),
        this.saveMap(this.users, USERS_FILE),
        this.saveMap(this.loans, LOANS_FILE)
      ]);
    } catch (error) {
      console.error('# Помилка збереження даних:', error);
    }
  }

  private async loadMap<T>(map: Map<string, T>, filePath: string) {
    try {
      const data = await fs.readFile(filePath, 'utf-8');

      if (!data.trim()) return;
      const parsed = JSON.parse(data);
      
      Object.entries(parsed).forEach(([key, value]) => {
        const item = value as any;
        if (item.loanDate) item.loanDate = new Date(item.loanDate);
        if (item.returnDate) item.returnDate = new Date(item.returnDate);
        
        map.set(key, item as T);
      });
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error(`# Помилка читання ${filePath}:`, error.message);
      }
    }
  }

  private async saveMap<T>(map: Map<string, T>, filePath: string) {
    const objectData = Object.fromEntries(map);
    await fs.writeFile(filePath, JSON.stringify(objectData, null, 2), 'utf-8');
  }
}

export const db = MemoryStorage.getInstance();