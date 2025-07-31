// pages/index/index.ts - 主页面逻辑（TypeScript版本）
const { 
  calculateBMI, 
  getBMICategory, 
  getDetailedAnalysis, 
  validateInput,
  getBMIKnowledge 
} = require('../../utils/calculator');

Page({
  // 页面的初始数据
  data: {
    height: '', // 身高输入值
    weight: '', // 体重输入值
    heightError: '', // 身高错误信息
    weightError: '', // 体重错误信息
    canCalculate: false, // 是否可以计算
    isCalculating: false, // 是否正在计算
    bmiResult: null as BMIAnalysisResult | null, // BMI计算结果
    bmiHistory: [] as BMIRecord[], // BMI历史记录
    showKnowledge: false, // 是否显示BMI知识
    bmiKnowledge: null as BMIKnowledge | null // BMI知识内容
  },

  // 生命周期函数--监听页面加载
  onLoad(options: any): void {
    console.log('页面加载');
    this.loadBMIHistory();
    this.loadBMIKnowledge();
  },

  // 生命周期函数--监听页面显示
  onShow(): void {
    console.log('页面显示');
    this.loadBMIHistory();
  },

  // 身高输入事件处理
  onHeightInput(e: any): void {
    const height: string = e.detail.value;
    this.setData({
      height: height,
      heightError: ''
    });
    this.validateInputs();
  },

  // 体重输入事件处理
  onWeightInput(e: any): void {
    const weight: string = e.detail.value;
    this.setData({
      weight: weight,
      weightError: ''
    });
    this.validateInputs();
  },

  // 验证身高输入
  validateHeight(): void {
    const height: number = parseFloat(this.data.height);
    let error: string = '';

    if (!this.data.height) {
      error = '请输入身高';
    } else if (isNaN(height)) {
      error = '请输入有效的数字';
    } else if (height < 50 || height > 300) {
      error = '身高应在50-300厘米之间';
    }

    this.setData({
      heightError: error
    });
    this.validateInputs();
  },

  // 验证体重输入
  validateWeight(): void {
    const weight: number = parseFloat(this.data.weight);
    let error: string = '';

    if (!this.data.weight) {
      error = '请输入体重';
    } else if (isNaN(weight)) {
      error = '请输入有效的数字';
    } else if (weight < 10 || weight > 500) {
      error = '体重应在10-500公斤之间';
    }

    this.setData({
      weightError: error
    });
    this.validateInputs();
  },

  // 验证所有输入
  validateInputs(): void {
    const height: number = parseFloat(this.data.height);
    const weight: number = parseFloat(this.data.weight);
    const hasHeightError: boolean = !!this.data.heightError;
    const hasWeightError: boolean = !!this.data.weightError;

    const canCalculate: boolean = !hasHeightError && 
                        !hasWeightError && 
                        !isNaN(height) && 
                        !isNaN(weight) && 
                        height > 0 && 
                        weight > 0;

    this.setData({
      canCalculate: canCalculate
    });
  },

  // 计算BMI
  calculateBMI(): void {
    if (!this.data.canCalculate || this.data.isCalculating) {
      return;
    }

    const height: number = parseFloat(this.data.height);
    const weight: number = parseFloat(this.data.weight);

    // 验证输入
    if (!validateInput(height, weight)) {
      wx.showToast({
        title: '输入数据无效',
        icon: 'error',
        duration: 2000
      });
      return;
    }

    this.setData({
      isCalculating: true
    });

    // 模拟计算延迟，提供更好的用户体验
    setTimeout(() => {
      try {
        // 获取详细分析结果
        const result: BMIAnalysisResult = getDetailedAnalysis(height, weight);
        
        this.setData({
          bmiResult: result,
          isCalculating: false
        });

        // 显示成功提示
        wx.showToast({
          title: '计算完成',
          icon: 'success',
          duration: 1500
        });

      } catch (error) {
        console.error('BMI计算失败:', error);
        this.setData({
          isCalculating: false
        });
        
        wx.showToast({
          title: error instanceof Error ? error.message : '计算失败',
          icon: 'error',
          duration: 2000
        });
      }
    }, 500);
  },

  // 保存记录
  saveRecord(): void {
    if (!this.data.bmiResult) {
      return;
    }

    const app = getApp();
    const { height, weight, bmi, category } = this.data.bmiResult;

    // 添加到全局历史记录
    app.addBMIRecord(height, weight, bmi, category);

    // 更新页面历史记录
    this.loadBMIHistory();

    wx.showToast({
      title: '记录已保存',
      icon: 'success',
      duration: 1500
    });
  },

  // 加载BMI历史记录
  loadBMIHistory(): void {
    const app = getApp();
    this.setData({
      bmiHistory: app.globalData.bmiHistory || []
    });
  },

  // 加载BMI知识
  loadBMIKnowledge(): void {
    const knowledge: BMIKnowledge = getBMIKnowledge();
    this.setData({
      bmiKnowledge: knowledge
    });
  },

  // 切换BMI知识显示
  toggleKnowledge(): void {
    this.setData({
      showKnowledge: !this.data.showKnowledge
    });
  },

  // 清空历史记录
  clearHistory(): void {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？此操作不可恢复。',
      success: (res: { confirm: boolean; cancel: boolean }) => {
        if (res.confirm) {
          const app = getApp();
          app.globalData.bmiHistory = [];
          app.saveBMIHistory();
          
          this.setData({
            bmiHistory: []
          });

          wx.showToast({
            title: '历史已清空',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  // 分享BMI计算结果
  shareResult(): void {
    if (!this.data.bmiResult) {
      wx.showToast({
        title: '请先计算BMI',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    const { bmiResult } = this.data;
    const shareContent = this.generateShareContent(bmiResult);

    wx.showActionSheet({
      itemList: ['分享给朋友', '分享到朋友圈', '复制分享内容'],
      success: (res: { tapIndex: number }) => {
        switch (res.tapIndex) {
          case 0:
            this.shareToFriend(shareContent);
            break;
          case 1:
            this.shareToTimeline(shareContent);
            break;
          case 2:
            this.copyShareContent(shareContent);
            break;
        }
      }
    });
  },

  // 生成分享内容
  generateShareContent(bmiResult: BMIAnalysisResult): string {
    const { bmi, category, idealWeightRange } = bmiResult;
    const date = new Date().toLocaleDateString('zh-CN');
    
    return `📊 BMI健康报告
    
📈 BMI指数：${bmi}
🏷️ 身体状态：${category.name}
📏 理想体重：${idealWeightRange.min}-${idealWeightRange.max}kg
💡 健康建议：${category.advice}
📅 测试时间：${date}

🔗 快来测试你的BMI指数吧！
#BMI健康计算器 #健康生活`;
  },

  // 分享给朋友
  shareToFriend(shareContent: string): void {
    wx.setClipboardData({
      data: shareContent,
      success: () => {
        wx.showToast({
          title: '分享内容已复制',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  // 分享到朋友圈
  shareToTimeline(shareContent: string): void {
    wx.setClipboardData({
      data: shareContent,
      success: () => {
        wx.showToast({
          title: '分享内容已复制',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  // 复制分享内容
  copyShareContent(shareContent: string): void {
    wx.setClipboardData({
      data: shareContent,
      success: () => {
        wx.showToast({
          title: '内容已复制',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  // 默认分享功能
  onShareAppMessage(): any {
    return {
      title: 'BMI健康计算器 - 科学计算身体质量指数',
      path: '/pages/index/index',
      imageUrl: '/images/share.png' // 如果有分享图片的话
    };
  },

  // 分享到朋友圈
  onShareTimeline(): any {
    return {
      title: 'BMI健康计算器 - 科学计算身体质量指数',
      imageUrl: '/images/share.png' // 如果有分享图片的话
    };
  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh(): void {
    // 刷新历史记录
    this.loadBMIHistory();
    
    wx.stopPullDownRefresh();
    wx.showToast({
      title: '刷新完成',
      icon: 'success',
      duration: 1000
    });
  },

  // 页面上拉触底事件的处理函数
  onReachBottom(): void {
    // 可以在这里加载更多历史记录
    console.log('触底事件');
  }
}); 