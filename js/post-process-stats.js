/**
 * 博客统计后处理脚本
 * 在页面生成后直接修改HTML，添加访客数和点赞数
 * 这是最直接有效的方法
 */

console.log('📊 Post Process Stats Loading...');

// 统计数据管理
const PostProcessStats = {
    // 配置
    config: {
        visitCountKey: 'blog-visit-count',
        likeCountKey: 'blog-like-count',
        initialVisits: 100,
        initialLikes: 50,
        // 使用免费的CountAPI服务
        countapi: {
            baseUrl: 'https://api.countapi.xyz',
            namespace: 'ramond-blog-v2', // 唯一命名空间
            visitKey: 'visits',
            likeKey: 'likes'
        }
    },



    // 初始化
    async init() {
        console.log('📊 Initializing stats with CountAPI...');
        
        // 从CountAPI获取统计数据
        await this.loadStatsFromCountAPI();
        
        // 增加访问计数
        await this.incrementVisitCount();
        
        console.log('📊 Stats initialized - Visits:', this.visitCount, 'Likes:', this.likeCount);
        
        // 立即处理当前页面
        this.processCurrentPage();
    },

    // 处理当前页面
    processCurrentPage() {
        console.log('🔄 Processing current page...');
        
        // 等待页面完全加载
        if (document.readyState !== 'complete') {
            window.addEventListener('load', () => this.addStatsToPage());
        } else {
            this.addStatsToPage();
        }
        
        // 也在DOM加载后尝试
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.addStatsToPage(), 1000);
            });
        }
        
        // 定时重试，应对Vue SPA
        let retryCount = 0;
        const maxRetries = 10;
        const retryInterval = setInterval(() => {
            if (retryCount >= maxRetries) {
                clearInterval(retryInterval);
                return;
            }
            
            if (!this.addStatsToPage()) {
                retryCount++;
                console.log(`🔄 Retry ${retryCount}/${maxRetries}...`);
            } else {
                clearInterval(retryInterval);
            }
        }, 2000);
    },

    // 从CountAPI加载统计数据
    async loadStatsFromCountAPI() {
        try {
            console.log('🔄 Loading stats from CountAPI...');
            
            // 获取访问数
            const visitResponse = await fetch(`${this.config.countapi.baseUrl}/get/${this.config.countapi.namespace}/${this.config.countapi.visitKey}`);
            const visitData = await visitResponse.json();
            
            // 获取点赞数
            const likeResponse = await fetch(`${this.config.countapi.baseUrl}/get/${this.config.countapi.namespace}/${this.config.countapi.likeKey}`);
            const likeData = await likeResponse.json();
            
            this.visitCount = visitData.value || this.config.initialVisits;
            this.likeCount = likeData.value || this.config.initialLikes;
            
            console.log('✅ Stats loaded from CountAPI - Visits:', this.visitCount, 'Likes:', this.likeCount);
        } catch (error) {
            console.warn('⚠️ Failed to load stats from CountAPI:', error);
            // 使用初始值
            this.visitCount = this.config.initialVisits;
            this.likeCount = this.config.initialLikes;
        }
    },



    // 增加访问计数
    async incrementVisitCount() {
        try {
            // 通过CountAPI增加访问计数
            const response = await fetch(`${this.config.countapi.baseUrl}/hit/${this.config.countapi.namespace}/${this.config.countapi.visitKey}`);
            const data = await response.json();
            
            if (data.value) {
                this.visitCount = data.value;
                console.log('📊 Visit count updated via CountAPI:', this.visitCount);
            } else {
                throw new Error('CountAPI response invalid');
            }
        } catch (error) {
            console.warn('⚠️ CountAPI failed, using local increment:', error);
            this.visitCount++;
            localStorage.setItem(this.config.visitCountKey, this.visitCount.toString());
        }
    },



    // 添加统计到页面
    addStatsToPage() {
        console.log('🔍 Creating fixed position stats...');
        
        // 首先检查是否已经添加过了（全局检查）
        if (document.querySelector('.post-process-stats')) {
            console.log('✅ Stats already exists on page');
            return true;
        }
        
        // 直接创建固定位置的统计框
        this.createFixedStats();
        console.log('✅ Fixed stats created successfully!');
        return true;
    },





    // 添加统计HTML到固定位置（头像左侧）
    addStatsHTML(element) {
        // 不再添加到找到的元素，而是创建固定位置的统计框
        this.createFixedStats();
    },

    // 创建固定位置的统计框
    createFixedStats() {
        // 移除可能存在的旧统计框
        const existingStats = document.querySelector('.post-process-stats');
        if (existingStats) {
            existingStats.remove();
        }

        const statsHTML = `
            <div class="post-process-stats" style="
                position: fixed;
                bottom: 20px;
                right: 120px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 14px;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 15px;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
            ">
                <span style="
                    display: flex; 
                    align-items: center; 
                    gap: 5px;
                    opacity: 0.9;
                ">
                    👁️ <span id="pp-visit-count">${this.visitCount}</span>
                </span>
                <button id="pp-like-btn" style="
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: white;
                    font: inherit;
                    padding: 3px 8px;
                    border-radius: 15px;
                    transition: all 0.2s;
                    opacity: 0.9;
                " title="点击点赞">
                    👍 <span id="pp-like-count">${this.likeCount}</span>
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', statsHTML);
        this.bindEvents();
        
        // 添加悬停效果
        const statsBox = document.querySelector('.post-process-stats');
        if (statsBox) {
            statsBox.addEventListener('mouseenter', () => {
                statsBox.style.transform = 'translateY(-2px)';
                statsBox.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
            });
            
            statsBox.addEventListener('mouseleave', () => {
                statsBox.style.transform = 'translateY(0)';
                statsBox.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            });
        }
    },

    // 绑定事件
    bindEvents() {
        const likeBtn = document.getElementById('pp-like-btn');
        if (!likeBtn) return;

        likeBtn.addEventListener('mouseenter', () => {
            likeBtn.style.background = 'rgba(25, 118, 210, 0.1)';
            likeBtn.style.opacity = '1';
        });

        likeBtn.addEventListener('mouseleave', () => {
            likeBtn.style.background = 'none';
            likeBtn.style.opacity = '0.8';
        });

        likeBtn.addEventListener('click', () => {
            this.handleLike();
        });
    },

    // 处理点赞
    async handleLike() {
        try {
            // 通过CountAPI增加点赞计数
            const response = await fetch(`${this.config.countapi.baseUrl}/hit/${this.config.countapi.namespace}/${this.config.countapi.likeKey}`);
            const data = await response.json();
            
            if (data.value) {
                this.likeCount = data.value;
                console.log('👍 Like count updated via CountAPI:', this.likeCount);
            } else {
                throw new Error('CountAPI response invalid');
            }
        } catch (error) {
            console.warn('⚠️ CountAPI failed, using local increment:', error);
            this.likeCount++;
            localStorage.setItem(this.config.likeCountKey, this.likeCount.toString());
        }
        
        // 更新显示
        const likeCountElement = document.getElementById('pp-like-count');
        if (likeCountElement) {
            likeCountElement.textContent = this.likeCount;
        }
        
        // 点赞动画
        const likeBtn = document.getElementById('pp-like-btn');
        if (likeBtn) {
            likeBtn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                likeBtn.style.transform = 'scale(1)';
            }, 150);
        }
        
        console.log('👍 Liked! New count:', this.likeCount);
    }
};

// 启动后处理统计
PostProcessStats.init();

console.log('📊 Post Process Stats Script Loaded');
