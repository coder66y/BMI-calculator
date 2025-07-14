// app.ts - 微信小程序应用入口文件（TypeScript版本）
App({
    // 全局数据
    globalData: {
        userInfo: null,
        bmiHistory: [] // BMI计算历史记录
    },
    // 应用启动时执行
    onLaunch() {
        console.log('BMI健康计算器启动');
        // 从本地存储加载历史记录
        this.loadBMIHistory();
    },
    // 应用显示时执行
    onShow() {
        console.log('应用显示');
    },
    // 应用隐藏时执行
    onHide() {
        console.log('应用隐藏');
        // 保存历史记录到本地存储
        this.saveBMIHistory();
    },
    // 加载BMI历史记录
    loadBMIHistory() {
        try {
            const history = wx.getStorageSync('bmiHistory');
            if (history) {
                this.globalData.bmiHistory = history;
            }
        }
        catch (e) {
            console.error('加载历史记录失败:', e);
        }
    },
    // 保存BMI历史记录
    saveBMIHistory() {
        try {
            wx.setStorageSync('bmiHistory', this.globalData.bmiHistory);
        }
        catch (e) {
            console.error('保存历史记录失败:', e);
        }
    },
    // 添加BMI记录
    addBMIRecord(height, weight, bmi, category) {
        const record = {
            id: Date.now(),
            height: height,
            weight: weight,
            bmi: bmi,
            category: category,
            timestamp: new Date().toLocaleString()
        };
        this.globalData.bmiHistory.unshift(record);
        // 限制历史记录数量，保留最近20条
        if (this.globalData.bmiHistory.length > 20) {
            this.globalData.bmiHistory = this.globalData.bmiHistory.slice(0, 20);
        }
        this.saveBMIHistory();
    }
});
