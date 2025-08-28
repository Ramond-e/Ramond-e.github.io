/**
 * Aurora Dia 机器人增强功能
 * 功能：点击返回页面顶部
 */

console.log('🤖 Dia Enhancement Script Loading...');

function initializeDiaEnhancement() {
    console.log('🔍 Searching for Dia element...');
    
    // 尝试多种可能的选择器
    const possibleSelectors = [
        '#Aurora-Dia',
        '.aurora-dia',
        '[data-dia]',
        '.dia-container',
        '.bot-container',
        '.aurora-bot'
    ];
    
    let diaElement = null;
    let foundSelector = '';
    
    // 遍历所有可能的选择器
    for (const selector of possibleSelectors) {
        diaElement = document.querySelector(selector);
        if (diaElement) {
            foundSelector = selector;
            console.log('✅ Found Dia element with selector: ' + selector);
            break;
        }
    }
    
    // 如果还没找到，尝试查找所有包含"dia"的元素
    if (!diaElement) {
        const allElements = document.querySelectorAll('*');
        for (const element of allElements) {
            if (element.id && element.id.toLowerCase().includes('dia')) {
                diaElement = element;
                foundSelector = '#' + element.id;
                console.log('✅ Found Dia element by ID search: ' + foundSelector);
                break;
            }
            if (element.className && element.className.toString().toLowerCase().includes('dia')) {
                diaElement = element;
                foundSelector = '.' + element.className.toString().split(' ')[0];
                console.log('✅ Found Dia element by class search: ' + foundSelector);
                break;
            }
        }
    }
    
    if (diaElement) {
        console.log('🎯 Dia element found, adding click handler...');
        console.log('Element info:', diaElement.outerHTML.substring(0, 200) + '...');
        
        // 移除可能存在的其他点击事件监听器
        diaElement.onclick = null;
        
        // 添加新的点击事件监听器
        diaElement.addEventListener('click', function(event) {
            console.log('🚀 Dia clicked! Scrolling to top...');
            event.preventDefault(); // 阻止默认行为
            event.stopPropagation(); // 阻止事件冒泡
            
            // 平滑滚动到页面顶部
            window.scrollTo({
                top: 0, 
                behavior: 'smooth'
            });
            
            console.log('✨ Scroll to top executed');
        }, true); // 使用捕获阶段
        
        // 添加鼠标悬停效果
        diaElement.style.cursor = 'pointer';
        diaElement.title = '点击返回顶部';
        
        // 标记已增强
        diaElement.setAttribute('data-enhanced', 'true');
        
        console.log('🎉 Dia enhancement completed!');
        
    } else {
        console.warn('❌ Aurora Dia element not found with any selector');
        console.log('Available elements with "dia" in ID or class:');
        const allElements = document.querySelectorAll('*');
        for (const element of allElements) {
            if ((element.id && element.id.toLowerCase().includes('dia')) || 
                (element.className && element.className.toString().toLowerCase().includes('dia'))) {
                console.log('- Found element:', element.tagName, element.id, element.className);
            }
        }
    }
}

// 多重初始化策略
console.log('📄 Document ready state:', document.readyState);

// 策略1: DOMContentLoaded事件
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOMContentLoaded fired');
    setTimeout(initializeDiaEnhancement, 1000);
});

// 策略2: 如果DOM已经加载完成
if (document.readyState !== 'loading') {
    console.log('📋 DOM already loaded');
    setTimeout(initializeDiaEnhancement, 1000);
}

// 策略3: Window load事件 (确保所有资源都加载完成)
window.addEventListener('load', function() {
    console.log('🌐 Window load fired');
    setTimeout(function() {
        if (!document.querySelector('[data-enhanced="true"]')) {
            console.log('🔄 Retrying initialization after window load...');
            initializeDiaEnhancement();
        }
    }, 2000);
});

// 策略4: 定时重试机制
let retryCount = 0;
const maxRetries = 10;
const retryInterval = setInterval(function() {
    retryCount++;
    if (document.querySelector('[data-enhanced="true"]') || retryCount >= maxRetries) {
        clearInterval(retryInterval);
        if (retryCount >= maxRetries) {
            console.log('⏰ Max retries reached, giving up...');
        }
        return;
    }
    
    console.log('🔄 Retry attempt ' + retryCount + '/' + maxRetries);
    initializeDiaEnhancement();
}, 3000);
