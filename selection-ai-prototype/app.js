// Selection AI - App Logic

class SelectionAI {
    constructor() {
        this.categories = [
            { id: 'crm', title: '顧客管理・営業日報', desc: '顧客リスト、商談履歴、日報提出', icon: '👥' },
            { id: 'booking', title: '予約・スケジュール管理', desc: '面談予約、お店の予約、会議室予約', icon: '📅' },
            { id: 'inventory', title: '在庫・備品管理', desc: '商品の数確認、社用携帯の貸出管理', icon: '📦' },
            { id: 'catalog', title: '商品カタログ・メニュー', desc: '商品一覧、飲食店メニュー、紹介資料', icon: '📜' },
            { id: 'task', title: 'タスク・進捗管理', desc: 'やることリスト、プロジェクト進捗', icon: '✅' },
            { id: 'lms', title: '社内マニュアル・学習管理', desc: 'Q&A、手順書、研修資料', icon: '📖' }
        ];

        this.features = [
            { id: 'auth', title: 'ログイン・会員登録機能', category: 'ユーザー・セキュリティ', recommended: true, icon: '🔐' },
            { id: 'social', title: 'Googleアカウント連携', category: 'ユーザー・セキュリティ', recommended: false, icon: '🌐' },
            { id: 'rbac', title: '権限管理', category: 'ユーザー・セキュリティ', recommended: false, icon: '⚖️' },
            { id: 'list', title: '一覧表示・検索機能', category: 'データ・分析', recommended: true, icon: '🔍' },
            { id: 'dashboard', title: '集計・分析ダッシュボード', category: 'データ・分析', recommended: false, icon: '📊' },
            { id: 'export', title: 'CSV出力・データ書き出し', category: 'データ・分析', recommended: false, icon: '📤' },
            { id: 'notify', title: '自動通知機能', category: '外部連携・通知', recommended: false, icon: '🔔' },
            { id: 'stripe', title: 'クレジットカード決済', category: '外部連携・通知', recommended: false, icon: '💳' },
            { id: 'api', title: '外部ツール連携', category: '外部連携・通知', recommended: false, icon: '🔗' }
        ];

        this.designs = [
            { id: 'dark', title: 'ダークテーマ', class: 'dark-preview' },
            { id: 'light', title: 'ライトテーマ', class: 'light-preview' },
            { id: 'gradient', title: 'グラデーション', class: 'gradient-preview' },
            { id: 'minimal', title: 'ミニマル', class: 'minimal-preview' }
        ];

        this.state = {
            currentStep: 1,
            selectedCategory: null,
            selectedFeatures: [],
            selectedDesign: null
        };

        this.init();
    }

    init() {
        this.renderCategories();
        this.renderFeatures();
        this.renderDesigns();
        this.bindEvents();
        this.updateUI();
    }

    renderCategories() {
        const grid = document.getElementById('category-grid');
        grid.innerHTML = this.categories.map(cat => `
            <div class="app-card" data-category="${cat.id}">
                <div class="card-icon">${cat.icon}</div>
                <h3 class="card-title">${cat.title}</h3>
                <p class="card-description">${cat.desc}</p>
            </div>
        `).join('');
    }

    renderFeatures() {
        const groups = {};
        this.features.forEach(f => {
            if (!groups[f.category]) groups[f.category] = [];
            groups[f.category].push(f);
        });

        const container = document.getElementById('feature-groups');
        container.innerHTML = Object.entries(groups).map(([name, items]) => `
            <div class="feature-group">
                <h3 class="group-title">${name}</h3>
                <div class="features-grid">
                    ${items.map(item => `
                        <label class="feature-card">
                            <input type="checkbox" name="feature" value="${item.id}" ${item.recommended ? 'checked' : ''}>
                            <div class="feature-content">
                                <div class="feature-icon">${item.icon}</div>
                                <span class="feature-name">${item.title}</span>
                                ${item.recommended ? '<span class="recommended-badge">おすすめ✨</span>' : ''}
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    renderDesigns() {
        const grid = document.getElementById('design-grid');
        grid.innerHTML = this.designs.map(d => `
            <div class="design-card" data-design="${d.id}">
                <div class="design-preview ${d.class}">
                    <div class="preview-header"></div>
                    <div class="preview-sidebar"></div>
                    <div class="preview-content">
                        <div class="preview-card"></div>
                        <div class="preview-card"></div>
                    </div>
                </div>
                <span class="design-name">${d.title}</span>
            </div>
        `).join('');
    }

    bindEvents() {
        // App Category Cards
        document.getElementById('category-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.app-card');
            if (card) this.selectCategory(card.dataset.category);
        });

        // Design Style Cards
        document.getElementById('design-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.design-card');
            if (card) this.selectDesign(card.dataset.design);
        });

        // Feature Checkboxes
        document.getElementById('feature-groups').addEventListener('change', (e) => {
            if (e.target.name === 'feature') this.updateSelectedFeatures();
        });

        // Navigation Buttons
        document.getElementById('back-to-step-1').addEventListener('click', () => this.goToStep(1));
        document.getElementById('to-step-3').addEventListener('click', () => this.goToStep(3));
        document.getElementById('back-to-step-2').addEventListener('click', () => this.goToStep(2));
        document.getElementById('generate-app').addEventListener('click', () => this.generateApp());
        document.getElementById('start-over').addEventListener('click', () => this.reset());

        // Wizard Step Buttons
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.addEventListener('click', () => {
                const stepNum = parseInt(step.dataset.step);
                if (this.canNavigateTo(stepNum)) this.goToStep(stepNum);
            });
        });
    }

    selectCategory(category) {
        this.state.selectedCategory = category;
        const catData = this.categories.find(c => c.id === category);

        document.querySelectorAll('.app-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.category === category);
        });

        document.getElementById('selected-category-name').textContent = catData ? catData.title : 'カテゴリ';

        setTimeout(() => this.goToStep(2), 300);
    }

    selectDesign(design) {
        this.state.selectedDesign = design;
        document.querySelectorAll('.design-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.design === design);
        });
    }

    updateSelectedFeatures() {
        const checkboxes = document.querySelectorAll('input[name="feature"]:checked');
        this.state.selectedFeatures = Array.from(checkboxes).map(cb => cb.value);
    }

    canNavigateTo(step) {
        if (step === 1) return true;
        return this.state.selectedCategory !== null;
    }

    goToStep(step) {
        this.state.currentStep = step;
        this.updateUI();
    }

    updateUI() {
        const { currentStep } = this.state;

        document.querySelectorAll('.wizard-step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.toggle('active', stepNum === currentStep);
            step.classList.toggle('completed', stepNum < currentStep);
        });

        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.remove('active');
        });

        const activeStep = document.getElementById(`step-${currentStep}`);
        if (activeStep) activeStep.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    generateApp() {
        const category = this.categories.find(c => c.id === this.state.selectedCategory);
        const design = this.designs.find(d => d.id === this.state.selectedDesign);

        document.getElementById('final-category').textContent = category ? category.title : '';
        document.getElementById('final-design').textContent = design ? design.title : '';

        const featuresList = document.getElementById('final-features');
        featuresList.innerHTML = '';

        this.updateSelectedFeatures(); // Ensure state is fresh

        const selectedFeatureData = this.features.filter(f => this.state.selectedFeatures.includes(f.id));

        if (selectedFeatureData.length === 0) {
            featuresList.innerHTML = '<li>基本機能</li>';
        } else {
            selectedFeatureData.forEach(f => {
                const li = document.createElement('li');
                li.textContent = f.title;
                featuresList.appendChild(li);
            });
        }

        document.querySelectorAll('.step-content').forEach(content => content.classList.remove('active'));
        document.getElementById('step-complete').classList.add('active');

        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });
    }

    reset() {
        this.state = {
            currentStep: 1,
            selectedCategory: null,
            selectedFeatures: [],
            selectedDesign: null
        };

        document.querySelectorAll('.app-card').forEach(card => card.classList.remove('selected'));
        document.querySelectorAll('.design-card').forEach(card => card.classList.remove('selected'));
        this.renderFeatures(); // Re-render to reset checkboxes
        this.updateUI();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.selectionAI = new SelectionAI();
});
