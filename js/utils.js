/**
 * 博客通用工具函数
 * 可以在这里添加各种实用的JavaScript功能
 */

console.log('🔧 Blog Utils Loading...');

// 通用工具对象
window.BlogUtils = {
    
    /**
     * 平滑滚动到指定位置
     * @param {number} top - 滚动到的位置
     * @param {string} behavior - 滚动行为 ('smooth' | 'auto')
     */
    scrollTo: function(top = 0, behavior = 'smooth') {
        window.scrollTo({ top, behavior });
    },
    
    /**
     * 获取当前滚动位置
     */
    getScrollTop: function() {
        return window.pageYOffset || document.documentElement.scrollTop;
    },
    
    /**
     * 检测是否在移动设备
     */
    isMobile: function() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 限制时间
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * 简单的事件发射器
     */
    EventEmitter: {
        events: {},
        
        on: function(event, callback) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(callback);
        },
        
        emit: function(event, data) {
            if (this.events[event]) {
                this.events[event].forEach(callback => callback(data));
            }
        },
        
        off: function(event, callback) {
            if (this.events[event]) {
                this.events[event] = this.events[event].filter(cb => cb !== callback);
            }
        }
    }
};

console.log('✅ Blog Utils Loaded');

// 示例：添加一个全局的回到顶部功能（备用）
BlogUtils.addBackToTop = function() {
    const backToTopBtn = document.createElement('div');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #007acc;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // 滚动显示/隐藏按钮
    const toggleButton = BlogUtils.throttle(() => {
        if (BlogUtils.getScrollTop() > 300) {
            backToTopBtn.style.opacity = '1';
        } else {
            backToTopBtn.style.opacity = '0';
        }
    }, 100);
    
    window.addEventListener('scroll', toggleButton);
    
    // 点击回到顶部
    backToTopBtn.addEventListener('click', () => {
        BlogUtils.scrollTo(0, 'smooth');
    });
    
    return backToTopBtn;
};
