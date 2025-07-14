// utils/calculator.ts - BMI计算工具函数（TypeScript版本）

/**
 * BMI计算器类
 * 提供BMI计算、分类判断和健康建议功能
 */
class BMICalculator {
  public readonly bmiCategories: {
    [key: string]: {
      min: number;
      max: number;
      name: string;
      color: string;
      advice: string;
    };
  };

  constructor() {
    // BMI分类标准（WHO标准）
    this.bmiCategories = {
      underweight: { 
        min: 0, 
        max: 18.4, 
        name: '偏瘦', 
        color: '#2196F3', 
        advice: '建议适当增加营养摄入，注意均衡饮食' 
      },
      normal: { 
        min: 18.5, 
        max: 23.9, 
        name: '正常', 
        color: '#4CAF50', 
        advice: '保持健康的生活方式，继续维持理想体重' 
      },
      overweight: { 
        min: 24.0, 
        max: 27.9, 
        name: '超重', 
        color: '#FF9800', 
        advice: '建议适当控制饮食，增加运动量' 
      },
      obese: { 
        min: 28.0, 
        max: 999, 
        name: '肥胖', 
        color: '#F44336', 
        advice: '建议咨询医生，制定科学的减重计划' 
      }
    };
  }

  /**
   * 计算BMI指数
   * @param height - 身高（厘米）
   * @param weight - 体重（公斤）
   * @returns BMI值
   */
  public calculateBMI(height: number, weight: number): number {
    // 输入验证
    if (!this.validateInput(height, weight)) {
      throw new Error('输入数据无效');
    }

    // 将身高从厘米转换为米
    const heightInMeters: number = height / 100;
    
    // BMI计算公式：体重(kg) / 身高(m)²
    const bmi: number = weight / (heightInMeters * heightInMeters);
    
    // 保留一位小数
    return Math.round(bmi * 10) / 10;
  }

  /**
   * 验证输入数据
   * @param height - 身高（厘米）
   * @param weight - 体重（公斤）
   * @returns 验证结果
   */
  public validateInput(height: number, weight: number): boolean {
    // 检查数据类型
    if (typeof height !== 'number' || typeof weight !== 'number') {
      return false;
    }

    // 检查数值范围
    if (height <= 0 || weight <= 0) {
      return false;
    }

    // 身高范围检查（50cm - 300cm）
    if (height < 50 || height > 300) {
      return false;
    }

    // 体重范围检查（10kg - 500kg）
    if (weight < 10 || weight > 500) {
      return false;
    }

    return true;
  }

  /**
   * 获取BMI分类信息
   * @param bmi - BMI值
   * @returns 分类信息
   */
  public getBMICategory(bmi: number): BMICategory {
    for (const [key, category] of Object.entries(this.bmiCategories)) {
      if (bmi >= category.min && bmi <= category.max) {
        return {
          key: key,
          name: category.name,
          color: category.color,
          advice: category.advice,
          range: `${category.min}-${category.max}`
        };
      }
    }
    
    // 默认返回正常范围
    const normalCategory = this.bmiCategories['normal'];
    if (!normalCategory) {
      throw new Error('BMI分类配置错误');
    }
    return {
      key: 'normal',
      name: normalCategory.name,
      color: normalCategory.color,
      advice: normalCategory.advice,
      range: `${normalCategory.min}-${normalCategory.max}`
    };
  }

  /**
   * 获取健康建议
   * @param bmi - BMI值
   * @returns 健康建议
   */
  public getHealthAdvice(bmi: number): string {
    const category: BMICategory = this.getBMICategory(bmi);
    return category.advice;
  }

  /**
   * 计算理想体重范围
   * @param height - 身高（厘米）
   * @returns 理想体重范围
   */
  public getIdealWeightRange(height: number): { min: number; max: number } {
    const heightInMeters: number = height / 100;
    
    // 根据BMI正常范围计算理想体重
    const normalCategory = this.bmiCategories['normal'];
    if (!normalCategory) {
      throw new Error('BMI分类配置错误');
    }
    const minBMI: number = normalCategory.min;
    const maxBMI: number = normalCategory.max;
    
    const minWeight: number = minBMI * heightInMeters * heightInMeters;
    const maxWeight: number = maxBMI * heightInMeters * heightInMeters;
    
    return {
      min: Math.round(minWeight * 10) / 10,
      max: Math.round(maxWeight * 10) / 10
    };
  }

  /**
   * 获取BMI详细分析
   * @param height - 身高（厘米）
   * @param weight - 体重（公斤）
   * @returns 详细分析结果
   */
  public getDetailedAnalysis(height: number, weight: number): BMIAnalysisResult {
    try {
      const bmi: number = this.calculateBMI(height, weight);
      const category: BMICategory = this.getBMICategory(bmi);
      const idealRange: { min: number; max: number } = this.getIdealWeightRange(height);
      
      return {
        bmi: bmi,
        category: category,
        idealWeightRange: idealRange,
        currentWeight: weight,
        weight: weight,
        height: height,
        isHealthy: category.key === 'normal',
        timestamp: new Date().toLocaleString()
      };
    } catch (error) {
      throw new Error(`计算失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 格式化显示数值
   * @param value - 数值
   * @param decimals - 小数位数
   * @returns 格式化后的字符串
   */
  public formatNumber(value: number, decimals: number = 1): string {
    return value.toFixed(decimals);
  }

  /**
   * 获取BMI知识科普
   * @returns BMI知识信息
   */
  public getBMIKnowledge(): BMIKnowledge {
    return {
      title: '什么是BMI？',
      content: 'BMI（身体质量指数）是衡量人体胖瘦程度的常用指标，计算公式为体重(kg)除以身高(m)的平方。',
      benefits: [
        '帮助评估身体健康状况',
        '指导体重管理',
        '预防健康风险'
      ],
      tips: [
        'BMI仅供参考，不能完全反映身体健康状况',
        '运动员和孕妇等特殊人群的BMI可能不准确',
        '建议结合其他指标综合评估健康状态'
      ]
    };
  }
}

// 创建全局实例
const bmiCalculator: BMICalculator = new BMICalculator();

// 导出工具函数（使用CommonJS格式，兼容微信小程序）
module.exports = {
  bmiCalculator,
  calculateBMI: (height: number, weight: number): number => bmiCalculator.calculateBMI(height, weight),
  getBMICategory: (bmi: number): BMICategory => bmiCalculator.getBMICategory(bmi),
  getHealthAdvice: (bmi: number): string => bmiCalculator.getHealthAdvice(bmi),
  getDetailedAnalysis: (height: number, weight: number): BMIAnalysisResult => bmiCalculator.getDetailedAnalysis(height, weight),
  validateInput: (height: number, weight: number): boolean => bmiCalculator.validateInput(height, weight),
  getIdealWeightRange: (height: number): { min: number; max: number } => bmiCalculator.getIdealWeightRange(height),
  getBMIKnowledge: (): BMIKnowledge => bmiCalculator.getBMIKnowledge()
}; 