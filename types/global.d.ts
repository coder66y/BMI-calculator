// types/global.d.ts - 全局类型定义

// 微信小程序全局API类型定义
declare namespace WechatMiniprogram {
  interface App {
    globalData: {
      userInfo: any;
      bmiHistory: BMIRecord[];
    };
    onLaunch(): void;
    onShow(): void;
    onHide(): void;
    loadBMIHistory(): void;
    saveBMIHistory(): void;
    addBMIRecord(height: number, weight: number, bmi: number, category: BMICategory): void;
  }

  interface Page {
    data: {
      height: string;
      weight: string;
      heightError: string;
      weightError: string;
      canCalculate: boolean;
      isCalculating: boolean;
      bmiResult: BMIAnalysisResult | null;
      bmiHistory: BMIRecord[];
      showKnowledge: boolean;
      bmiKnowledge: BMIKnowledge | null;
    };
    setData?(data: any): void; // 设为可选，因为Page函数会自动添加
    onLoad?(options: any): void;
    onShow?(): void;
    onHeightInput?(e: any): void;
    onWeightInput?(e: any): void;
    validateHeight?(): void;
    validateWeight?(): void;
    validateInputs?(): void;
    calculateBMI?(): void;
    saveRecord?(): void;
    loadBMIHistory?(): void;
    loadBMIKnowledge?(): void;
    toggleKnowledge?(): void;
    clearHistory?(): void;
    onShareAppMessage?(): any;
    onShareTimeline?(): any;
    onPullDownRefresh?(): void;
    onReachBottom?(): void;
  }

  interface Wx {
    showToast(options: {
      title: string;
      icon?: 'success' | 'error' | 'loading' | 'none';
      duration?: number;
    }): void;
    showModal(options: {
      title: string;
      content: string;
      success?: (res: { confirm: boolean; cancel: boolean }) => void;
    }): void;
    getStorageSync(key: string): any;
    setStorageSync(key: string, data: any): void;
    stopPullDownRefresh(): void;
  }
}

// BMI相关类型定义
interface BMICategory {
  key: string;
  name: string;
  color: string;
  advice: string;
  range: string;
}

interface BMIRecord {
  id: number;
  height: number;
  weight: number;
  bmi: number;
  category: BMICategory;
  timestamp: string;
}

interface BMIAnalysisResult {
  bmi: number;
  category: BMICategory;
  idealWeightRange: {
    min: number;
    max: number;
  };
  currentWeight: number;
  weight: number;
  height: number;
  isHealthy: boolean;
  timestamp: string;
}

interface BMIKnowledge {
  title: string;
  content: string;
  benefits: string[];
  tips: string[];
}

// BMI计算器类接口
interface IBMICalculator {
  bmiCategories: {
    [key: string]: {
      min: number;
      max: number;
      name: string;
      color: string;
      advice: string;
    };
  };
  calculateBMI(height: number, weight: number): number;
  validateInput(height: number, weight: number): boolean;
  getBMICategory(bmi: number): BMICategory;
  getHealthAdvice(bmi: number): string;
  getIdealWeightRange(height: number): { min: number; max: number };
  getDetailedAnalysis(height: number, weight: number): BMIAnalysisResult;
  formatNumber(value: number, decimals?: number): string;
  getBMIKnowledge(): BMIKnowledge;
}

// 全局变量声明
declare const wx: WechatMiniprogram.Wx;
declare const App: (config: WechatMiniprogram.App) => void;
declare const Page: (config: WechatMiniprogram.Page) => void;
declare const getApp: () => WechatMiniprogram.App;

// 模块导出类型
declare module '*.js' {
  const content: any;
  export = content;
}

declare module '*.ts' {
  const content: any;
  export = content;
} 