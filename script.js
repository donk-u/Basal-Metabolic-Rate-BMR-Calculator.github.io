// 基础代谢率计算器

/**
 * 使用Harris-Benedict公式计算基础代谢率
 * 男性：BMR = 88.362 + (13.397 × 体重kg) + (4.799 × 身高cm) - (5.677 × 年龄)
 * 女性：BMR = 447.593 + (9.247 × 体重kg) + (3.098 × 身高cm) - (4.330 × 年龄)
 */

/**
 * 计算基础代谢率
 * @param {string} gender - 性别 ('male' 或 'female')
 * @param {number} age - 年龄
 * @param {number} height - 身高 (cm)
 * @param {number} weight - 体重 (kg)
 * @returns {number} 基础代谢率 (卡路里/天)
 */
function calculateBMR(gender, age, height, weight) {
    let bmr;
    
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    return Math.round(bmr);
}

/**
 * 验证输入数据
 * @param {number} age - 年龄
 * @param {number} height - 身高
 * @param {number} weight - 体重
 * @returns {object} 验证结果 {isValid: boolean, message: string}
 */
function validateInputs(age, height, weight) {
    if (!age || age < 1 || age > 120) {
        return { isValid: false, message: '请输入有效的年龄（1-120岁）' };
    }
    
    if (!height || height < 50 || height > 250) {
        return { isValid: false, message: '请输入有效的身高（50-250厘米）' };
    }
    
    if (!weight || weight < 20 || weight > 300) {
        return { isValid: false, message: '请输入有效的体重（20-300公斤）' };
    }
    
    return { isValid: true, message: '' };
}

/**
 * 显示错误消息
 * @param {string} message - 错误消息
 */
function showError(message) {
    // 创建错误提示元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: #ff6b6b;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: 500;
        animation: slideDown 0.3s ease-out;
    `;
    
    // 插入到计算器顶部
    const calculator = document.querySelector('.calculator');
    const firstChild = calculator.firstChild;
    calculator.insertBefore(errorDiv, firstChild);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 3000);
}

/**
 * 主要计算函数
 */
function performCalculation() {
    // 获取输入值
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const age = parseInt(document.getElementById('age').value);
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    
    // 验证输入
    const validation = validateInputs(age, height, weight);
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }
    
    // 计算BMR
    const bmr = calculateBMR(gender, age, height, weight);
    
    // 显示结果
    displayResult(bmr);
}

/**
 * 显示计算结果
 * @param {number} bmr - 基础代谢率
 */
function displayResult(bmr) {
    // 更新结果数值
    document.getElementById('bmrResult').textContent = bmr.toLocaleString();
    
    // 显示结果区域
    const resultSection = document.getElementById('resultSection');
    const inputSection = document.querySelector('.input-section');
    
    resultSection.style.display = 'block';
    inputSection.style.display = 'none';
    
    // 滚动到结果区域
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * 重置计算器
 */
function resetCalculator() {
    // 隐藏结果区域
    document.getElementById('resultSection').style.display = 'none';
    
    // 显示输入区域
    document.querySelector('.input-section').style.display = 'block';
    
    // 清空输入框
    document.getElementById('age').value = '';
    document.getElementById('height').value = '';
    document.getElementById('weight').value = '';
    
    // 重置性别选择
    document.querySelector('input[name="gender"][value="male"]').checked = true;
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 添加CSS动画样式
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * 添加输入框回车键支持
 */
function addEnterKeySupport() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performCalculation();
            }
        });
    });
}

/**
 * 初始化页面
 */
document.addEventListener('DOMContentLoaded', function() {
    // 添加动画样式
    addAnimationStyles();
    
    // 添加回车键支持
    addEnterKeySupport();
    
    // 为输入框添加实时验证
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value && this.checkValidity()) {
                this.style.borderColor = '#51cf66';
            } else if (this.value) {
                this.style.borderColor = '#ff6b6b';
            } else {
                this.style.borderColor = '#e1e5e9';
            }
        });
    });
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// 暴露全局函数供HTML调用
window.performCalculation = performCalculation;
window.resetCalculator = resetCalculator;