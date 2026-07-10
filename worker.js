const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>邮件数据提取</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📧</text></svg>">
    <style>
        :root {
            --bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --surface: #fff;
            --card-bg: #f8f9fa;
            --card-hover: #e9ecef;
            --text: #333;
            --text-secondary: #666;
            --text-muted: #999;
            --border: #ddd;
            --border-soft: #eee;
            --accent: #667eea;
            --accent-hover: #5568d3;
            --accent-soft-bg: #edf0fe;
            --accent-soft-hover: #dfe4fd;
            --btn-secondary-bg: #e9ecef;
            --btn-secondary-hover: #dee2e6;
            --shadow: rgba(0,0,0,0.2);
            --focus-ring: rgba(102,126,234,0.1);
            --clear-hover-bg: #ffe3e3;
            --clear-btn-bg: #f1f3f5;
            color-scheme: light;
        }
        [data-theme="dark"] {
            --bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            --surface: #1e1e2a;
            --card-bg: #2a2a38;
            --card-hover: #34344a;
            --text: #e4e4e7;
            --text-secondary: #a1a1aa;
            --text-muted: #71717a;
            --border: #3a3a4a;
            --border-soft: #34344a;
            --accent: #8290f0;
            --accent-hover: #9aa6f5;
            --accent-soft-bg: rgba(130,144,240,0.18);
            --accent-soft-hover: rgba(130,144,240,0.28);
            --btn-secondary-bg: #34344a;
            --btn-secondary-hover: #3f3f57;
            --shadow: rgba(0,0,0,0.55);
            --focus-ring: rgba(130,144,240,0.25);
            --clear-hover-bg: rgba(220,53,69,0.22);
            --clear-btn-bg: #34344a;
            color-scheme: dark;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); min-height: 100vh; padding: 20px; }
        .container { position: relative; max-width: 800px; margin: 0 auto; background: var(--surface); border-radius: 12px; box-shadow: 0 10px 40px var(--shadow); padding: 30px; }
        h1 { color: var(--text); text-align: center; margin-bottom: 10px; font-size: 28px; }
        .subtitle { color: var(--text-secondary); text-align: center; margin-bottom: 25px; font-size: 14px; }
        .card { background: var(--card-bg); border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .card-title { font-size: 14px; color: var(--text-secondary); margin-bottom: 10px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
        .count { color: var(--accent); font-weight: 500; }
        textarea { width: 100%; height: 150px; margin: 10px 0; padding: 12px; font-family: monospace; font-size: 14px; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 6px; resize: vertical; }
        textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--focus-ring); }
        .btn-group { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
        button { padding: 12px 24px; cursor: pointer; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; transition: all 0.2s; }
        .btn-primary { background: var(--accent); color: #fff; }
        .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
        .btn-secondary { background: var(--btn-secondary-bg); color: var(--text); }
        .btn-secondary:hover { background: var(--btn-secondary-hover); }
        .output { background: #1e1e1e; color: #a9b7c6; border: 1px solid var(--border); padding: 15px; border-radius: 6px; white-space: pre-wrap; min-height: 100px; font-family: 'Monaco', 'Menlo', monospace; font-size: 13px; line-height: 1.6; }
        .history { margin-top: 20px; }
        .history-title { font-size: 14px; color: var(--text-secondary); margin-bottom: 10px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
        .history-list { max-height: 300px; overflow-y: auto; }
        .history-item { background: var(--card-bg); padding: 12px; border-radius: 6px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; position: relative; }
        .history-item:hover { background: var(--card-hover); transform: translateX(4px); }
        .history-item:hover .action-btns { opacity: 1; }
        .history-item .time { font-size: 12px; color: var(--text-muted); padding-right: 70px; }
        .history-item .content { font-size: 13px; color: var(--text); font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .action-btns { position: absolute; top: 8px; right: 8px; display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; }
        .action-btn { width: 24px; height: 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; line-height: 24px; text-align: center; padding: 0; }
        .delete-btn { background: #dc3545; color: #fff; }
        .delete-btn:hover { background: #c82333; }
        .copy-emails-btn { background: #28a745; color: #fff; }
        .copy-emails-btn:hover { background: #218838; }
        .toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: #28a745; color: #fff; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.3s; z-index: 1200; }
        .toast.show { transform: translateX(-50%) translateY(0); }
        button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .tabs { display: flex; gap: 4px; margin-bottom: 22px; border-bottom: 2px solid var(--border-soft); }
        .tab { background: none; padding: 12px 20px; font-size: 15px; color: var(--text-muted); border-bottom: 2px solid transparent; margin-bottom: -2px; border-radius: 0; }
        .tab:hover { color: var(--accent); }
        .tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }
        .tab-panel { display: none; }
        .tab-panel.active { display: block; }
        .mode-toggle { display: flex; gap: 6px; padding: 4px; margin-bottom: 16px; background: var(--card-bg); border-radius: 8px; }
        .mode-btn { flex: 1; padding: 10px 12px; background: transparent; color: var(--text-muted); border-radius: 6px; }
        .mode-btn:hover { color: var(--accent); background: var(--accent-soft-bg); }
        .mode-btn.active { color: var(--accent); background: var(--surface); font-weight: 600; box-shadow: 0 1px 4px var(--shadow); }
        .pwd-len { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; font-size: 13px; color: var(--text-secondary); }
        .pwd-len input { width: 80px; padding: 8px; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 6px; font-size: 14px; }
        .count-input { display: flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 13px; color: var(--text-secondary); }
        .count-input input { width: 120px; padding: 8px; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 6px; font-size: 14px; }
        .date-group-title { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--accent); font-weight: 600; margin: 16px 0 8px; padding-bottom: 6px; border-bottom: 1px dashed var(--border); }
        .date-clear-btn { padding: 4px 10px; font-size: 12px; background: var(--clear-btn-bg); color: var(--text-muted); }
        .date-clear-btn:hover { background: var(--clear-hover-bg); color: #dc3545; }
        .date-label { cursor: pointer; user-select: none; }
        .date-actions { display: flex; gap: 8px; }
        .date-copy-btn { padding: 4px 10px; font-size: 12px; background: var(--accent-soft-bg); color: var(--accent); }
        .date-copy-btn:hover { background: var(--accent-soft-hover); }
        .gen-idx { flex-shrink: 0; min-width: 22px; text-align: right; color: var(--text-muted); font-size: 12px; font-family: monospace; line-height: 1.5; }
        .gen-item { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; background: var(--card-bg); padding: 10px 12px; border-radius: 6px; margin-bottom: 8px; }
        .gen-item pre { margin: 0; flex: 1; font-family: monospace; font-size: 13px; color: var(--text); white-space: pre-wrap; word-break: break-all; line-height: 1.5; }
        .gen-item .copy-btn { flex-shrink: 0; padding: 6px 14px; font-size: 12px; background: var(--accent); color: #fff; }
        .gen-item .copy-btn:hover { background: var(--accent-hover); }
        .empty-tip { color: var(--text-muted); font-size: 13px; text-align: center; padding: 20px 0; }
        .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100; padding: 20px; overflow-y: auto; }
        .modal-overlay.show { display: flex; align-items: flex-start; justify-content: center; }
        .modal { background: var(--surface); border-radius: 12px; box-shadow: 0 10px 40px var(--shadow); padding: 24px; max-width: 560px; width: 100%; margin: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .modal-header h2 { font-size: 18px; color: var(--text); }
        .modal-close { background: none; font-size: 24px; color: var(--text-muted); padding: 0 6px; line-height: 1; }
        .modal-close:hover { color: var(--text); }
        .modal-body { max-height: 60vh; overflow-y: auto; }
        .modal-footer { display: flex; gap: 10px; margin-top: 16px; }
        .theme-toggle { position: absolute; top: 18px; right: 18px; width: 38px; height: 38px; padding: 0; border-radius: 50%; background: var(--card-bg); color: var(--text); font-size: 18px; line-height: 1; box-shadow: 0 2px 6px var(--shadow); }
        .theme-toggle:hover { background: var(--card-hover); }
        @media (max-width: 600px) {
            body { padding: 12px; }
            .container { padding: 20px 16px; border-radius: 10px; }
            h1 { font-size: 22px; margin-bottom: 6px; }
            .subtitle { font-size: 13px; margin-bottom: 18px; }
            .card { padding: 14px; margin-bottom: 14px; }
            textarea { height: 120px; font-size: 16px; padding: 10px; }
            .btn-group { flex-direction: column; gap: 8px; }
            button { width: 100%; padding: 14px; font-size: 15px; }
            .output { font-size: 14px; padding: 12px; min-height: 80px; }
            .history-item { padding: 10px; }
            .history-list { max-height: 250px; }
            .tab { flex: 1; width: auto; padding: 10px 8px; font-size: 14px; }
            .date-clear-btn, .date-copy-btn, .modal-close, .gen-item .copy-btn { width: auto; padding: 6px 12px; font-size: 12px; }
            .modal { padding: 18px 16px; }
            .gen-item { flex-direction: column; }
            .gen-item .copy-btn { align-self: flex-end; }
        }
    </style>
    <script>
        (function () {
            var t = localStorage.getItem('theme');
            if (t !== 'dark' && t !== 'light') {
                t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            document.documentElement.dataset.theme = t;
        })();
    </script>
</head>
<body>
    <div class="container">
        <button id="themeToggle" class="theme-toggle" onclick="toggleTheme()" title="切换主题" aria-label="切换主题">🌙</button>
        <h1>📧 邮件数据提取</h1>

        <div class="tabs">
            <button class="tab active" data-tab="extract" onclick="switchTab('extract')">邮件提取</button>
            <button class="tab" data-tab="generate" onclick="switchTab('generate')">信息生成</button>
        </div>

        <div id="panel-extract" class="tab-panel active">
        <p class="subtitle">格式: 邮箱----密码----授权码----日期 / 邮箱----授权码</p>

        <div class="card">
            <div class="card-title">输入数据 <span id="inputCount" class="count">0 条</span></div>
            <textarea id="input" placeholder="请输入数据，每行一个记录..."></textarea>
        </div>
        
        <div class="btn-group">
            <button class="btn-primary" onclick="extract()">提取</button>
            <button class="btn-secondary" onclick="copyResult()">复制结果</button>
            <button class="btn-secondary" onclick="copyEmails()">复制邮箱</button>
            <button class="btn-secondary" onclick="reverseResult()">反转结果</button>
            <button class="btn-secondary" onclick="clearAll()">清空</button>
        </div>
        
        <div class="card">
            <div class="card-title">输出结果 <span id="outputCount" class="count">0 条</span></div>
            <div id="output" class="output"></div>
        </div>
        
        <div class="history">
            <div class="history-title">
                <span>历史记录</span>
                <button onclick="clearHistory()" style="padding: 6px 12px; font-size: 12px;">清空历史</button>
            </div>
            <div id="historyList" class="history-list"></div>
        </div>
        </div>

        <div id="panel-generate" class="tab-panel">
            <p id="genSubtitle" class="subtitle">粘贴邮箱（每行一个），用 AI 生成用户名 + 随机密码</p>

            <div class="mode-toggle" role="group" aria-label="生成模式">
                <button id="normalModeBtn" class="mode-btn active" onclick="setGenMode('normal')" aria-pressed="true">普通模式</button>
                <button id="eduModeBtn" class="mode-btn" onclick="setGenMode('edu')" aria-pressed="false">Edu 模式</button>
            </div>

            <div id="normalGenSection" class="card">
                <div class="card-title">邮箱列表 <span id="genCount" class="count">0 条</span></div>
                <textarea id="genInput" placeholder="每行一个邮箱，例如：&#10;jiadan9621@163.com&#10;yangsitian@gmail.com"></textarea>
            </div>

            <div id="eduGenSection" class="card" style="display:none;">
                <div class="card-title">生成数量 <span id="eduCountText" class="count">10 条</span></div>
                <div class="count-input">
                    <label for="eduCount">数量</label>
                    <input id="eduCount" type="number" value="10" min="1" max="1000">
                </div>
            </div>

            <div id="pwdLenRow" class="pwd-len">
                <label for="pwdLen">密码长度</label>
                <input id="pwdLen" type="number" value="16" min="3" max="64">
            </div>

            <div class="btn-group">
                <button class="btn-primary" id="genBtn" onclick="generate()">生成</button>
                <button class="btn-secondary" onclick="clearGenInput()">清空</button>
            </div>

            <div class="history">
                <div class="history-title">
                    <span>生成历史</span>
                    <button id="genToggleBtn" onclick="toggleGenShowAll()" style="padding: 6px 12px; font-size: 12px;">显示全部</button>
                </div>
                <div id="genHistoryList" class="history-list"></div>
            </div>
        </div>
    </div>

    <div id="genModal" class="modal-overlay">
        <div class="modal">
            <div class="modal-header">
                <h2>生成结果 <span id="genResultCount" class="count"></span></h2>
                <button class="modal-close" onclick="closeGenModal()">×</button>
            </div>
            <div id="genModalBody" class="modal-body"></div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="copyAllGen()">全部复制</button>
                <button class="btn-secondary" onclick="closeGenModal()">关闭</button>
            </div>
        </div>
    </div>

    <div id="toast" class="toast">已复制到剪贴板</div>

    <script>
        const STORAGE_KEY = 'emailExtractorHistory';
        const MAX_HISTORY = 20;

        function getHistory() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            } catch { return []; }
        }

        function saveHistory(input, output, inputCount, outputCount) {
            if (!input.trim() || !output.trim()) return;
            let history = getHistory();
            history.unshift({ time: new Date().toLocaleString(), input, output, inputCount, outputCount });
            if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            renderHistory();
        }

        function renderHistory() {
            const history = getHistory();
            const list = document.getElementById('historyList');
            list.innerHTML = history.map((item, i) => \`
                <div class="history-item" onclick="loadHistory(\${i})">
                    <div class="action-btns">
                        <button class="action-btn copy-emails-btn" onclick="event.stopPropagation(); copyHistoryEmails(\${i})" title="复制邮箱">📧</button>
                        <button class="action-btn delete-btn" onclick="event.stopPropagation(); deleteHistoryItem(\${i})" title="删除">×</button>
                    </div>
                    <div class="time">\${item.time}    输入 \${item.inputCount} 条 → 输出 \${item.outputCount} 条</div>
                    <div class="content">\${item.output.split('\\n')[0]}...</div>
                </div>
            \`).join('');
        }

        function loadHistory(index) {
            const history = getHistory()[index];
            if (history) {
                document.getElementById('input').value = history.input;
                document.getElementById('output').textContent = history.output;
                document.getElementById('inputCount').textContent = (history.inputCount || 0) + ' 条';
                document.getElementById('outputCount').textContent = (history.outputCount || 0) + ' 条';
            }
        }

        function clearHistory() {
            localStorage.removeItem(STORAGE_KEY);
            renderHistory();
        }

        function deleteHistoryItem(index) {
            let history = getHistory();
            history.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            renderHistory();
        }

        function extract() {
            let input = document.getElementById('input').value;
            // 预处理：逗号格式转为标准 ---- 格式
            input = input.split('\\n').map(line => {
                if (!line.includes('----') && line.includes(',')) {
                    return line.replace(/,/g, '----');
                }
                return line;
            }).join('\\n');
            document.getElementById('input').value = input;
            const lines = input.split('\\n').filter(l => l.trim());
            const inputCount = lines.length;
            let result = '';

            for (let line of lines) {
                const parts = line.split('----');
                if (parts.length >= 3) {
                    result += parts[0].trim() + '----' + parts[2].trim() + '\\n';
                } else if (parts.length === 2) {
                    result += parts[0].trim() + '----' + parts[1].trim() + '\\n';
                }
            }
            
            const outputCount = result ? result.trim().split('\\n').length : 0;
            
            document.getElementById('output').textContent = result;
            document.getElementById('inputCount').textContent = inputCount + ' 条';
            document.getElementById('outputCount').textContent = outputCount + ' 条';
            if (result) saveHistory(input, result, inputCount, outputCount);
        }
        
        function copyResult() {
            const text = document.getElementById('output').textContent;
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    const toast = document.getElementById('toast');
                    toast.classList.add('show');
                    setTimeout(() => toast.classList.remove('show'), 3000);
                });
            }
        }
        
        function copyEmails() {
            const text = document.getElementById('output').textContent;
            if (text) {
                const emails = text.trim().split('\\n').map(line => line.split('----')[0].trim()).join('\\n');
                navigator.clipboard.writeText(emails).then(() => {
                    const toast = document.getElementById('toast');
                    toast.textContent = '已复制邮箱列表';
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                        toast.textContent = '已复制到剪贴板';
                    }, 3000);
                });
            }
        }

        function copyHistoryEmails(index) {
            const history = getHistory()[index];
            if (history && history.output) {
                const emailList = history.output.trim().split('\\n').map(line => line.split('----')[0].trim());
                const emails = emailList.join('\\n');
                navigator.clipboard.writeText(emails).then(() => {
                    const toast = document.getElementById('toast');
                    toast.textContent = '已复制 ' + emailList.length + ' 个邮箱';
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                        toast.textContent = '已复制到剪贴板';
                    }, 3000);
                });
            }
        }

        function reverseResult() {
            const outputEl = document.getElementById('output');
            const text = outputEl.textContent;
            if (!text.trim()) return;
            const reversed = text.trim().split('\\n').reverse().join('\\n');
            outputEl.textContent = reversed;
            const toast = document.getElementById('toast');
            toast.textContent = '已反转顺序';
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                toast.textContent = '已复制到剪贴板';
            }, 3000);
        }

        function clearAll() {
            document.getElementById('input').value = '';
            document.getElementById('output').textContent = '';
            document.getElementById('inputCount').textContent = '0 条';
            document.getElementById('outputCount').textContent = '0 条';
        }

        // ===== 信息生成 tab =====
        const GEN_STORAGE_KEY = 'genInfoHistory';
        const MAX_GEN = 1000;
        const LOWER_ALPHA = 'abcdefghijklmnopqrstuvwxyz';
        const USERNAME_CHARS = LOWER_ALPHA + '0123456789';
        const EDU_DIGITS = '012356789';
        const EDU_DOMAIN = '@stu.huel.edu.cn';
        let genMode = 'normal';
        let genShowAll = false;
        let currentGenAccounts = [];
        let genExpandedKeys = new Set();
        let genInited = false;

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); toast.textContent = '已复制到剪贴板'; }, 3000);
        }

        function switchTab(name) {
            document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + name));
        }

        function parseEmails() {
            return [...new Set(document.getElementById('genInput').value.split('\\n').map(l => l.trim()).filter(Boolean))];
        }

        function updateGenCount() {
            document.getElementById('genCount').textContent = parseEmails().length + ' 条';
        }

        function updateEduCount() {
            const count = parseInt(document.getElementById('eduCount').value, 10);
            document.getElementById('eduCountText').textContent = (count > 0 ? count : 0) + ' 条';
        }

        function setGenMode(mode) {
            genMode = mode === 'edu' ? 'edu' : 'normal';
            const isEdu = genMode === 'edu';
            document.getElementById('normalModeBtn').classList.toggle('active', !isEdu);
            document.getElementById('eduModeBtn').classList.toggle('active', isEdu);
            document.getElementById('normalModeBtn').setAttribute('aria-pressed', String(!isEdu));
            document.getElementById('eduModeBtn').setAttribute('aria-pressed', String(isEdu));
            document.getElementById('normalGenSection').style.display = isEdu ? 'none' : 'block';
            document.getElementById('eduGenSection').style.display = isEdu ? 'block' : 'none';
            document.getElementById('pwdLenRow').style.display = isEdu ? 'none' : 'flex';
            document.getElementById('genSubtitle').textContent = isEdu
                ? '输入数量，生成 stu.huel.edu.cn 邮箱账号'
                : '粘贴邮箱（每行一个），用 AI 生成用户名 + 随机密码';
            if (isEdu) updateEduCount();
            else updateGenCount();
        }

        function clearGenInput() {
            if (genMode === 'edu') {
                document.getElementById('eduCount').value = '';
                updateEduCount();
                return;
            }
            document.getElementById('genInput').value = '';
            updateGenCount();
        }

        const PWD_LOWER = 'abcdefghijkmnpqrstuvwxyz';
        const PWD_UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const PWD_DIGIT = '23456789';
        function randChar(set) { return set[crypto.getRandomValues(new Uint32Array(1))[0] % set.length]; }
        function randInt(min, max) { return min + (crypto.getRandomValues(new Uint32Array(1))[0] % (max - min + 1)); }
        function randomString(set, len) {
            let s = '';
            while (s.length < len) s += randChar(set);
            return s;
        }
        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
                const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
            }
            return arr;
        }
        function genPassword(len) {
            len = Math.max(3, parseInt(len, 10) || 16);
            const all = PWD_LOWER + PWD_UPPER + PWD_DIGIT;
            const body = [];
            if (len - 1 >= 3) body.push(randChar(PWD_LOWER), randChar(PWD_UPPER), randChar(PWD_DIGIT));
            while (body.length < len - 1) body.push(randChar(all));
            return randChar(PWD_LOWER + PWD_UPPER) + shuffle(body).join('');
        }

        function normalizeGenUsername(username, email) {
            let u = String(username || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const source = String(email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
            if (u.length < 6) u += source;
            while (u.length < 6) u += randChar(USERNAME_CHARS);
            return u.slice(0, 7);
        }

        function genEduAccount(used) {
            let email = '';
            let username = '';
            do {
                const nameLen = randInt(5, 6);
                username = randChar('uvwxyz') + randomString(LOWER_ALPHA, nameLen - 1);
                email = username + randomString(EDU_DIGITS, 13 - nameLen) + EDU_DOMAIN;
            } while (used.has(email));
            used.add(email);
            return { email, username };
        }

        function generateEdu() {
            const count = parseInt(document.getElementById('eduCount').value, 10);
            if (!Number.isFinite(count) || count < 1) { showToast('请输入生成数量'); return; }
            if (count > MAX_GEN) { showToast('单次最多生成 ' + MAX_GEN + ' 条'); return; }
            const batch = Date.now();
            const usedEmails = new Set();
            const accounts = [];
            for (let i = 0; i < count; i++) {
                accounts.push({
                    ts: batch,
                    batch,
                    ...genEduAccount(usedEmails),
                    password: genPassword(16),
                });
            }
            saveGenHistory(accounts);
            openGenModal(accounts);
        }

        function buildBlock(email, username, password) {
            return email + '\\n\\n' + username + '\\n' + password;
        }

        function escapeHtml(s) {
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function renderGenItem(a, i) {
            const block = buildBlock(a.email, a.username, a.password);
            return '<div class="gen-item"><span class="gen-idx">' + (i + 1) + '</span><pre>' + escapeHtml(block) + '</pre><button class="copy-btn" onclick="copyFromPre(this)">复制</button></div>';
        }

        function copyFromPre(btn) {
            const text = btn.parentElement.querySelector('pre').textContent;
            navigator.clipboard.writeText(text).then(() => showToast('已复制'));
        }

        async function generate() {
            if (genMode === 'edu') { generateEdu(); return; }
            const emails = parseEmails();
            if (emails.length === 0) { showToast('请先输入邮箱'); return; }
            if (emails.length > 50) { showToast('单次最多 50 个邮箱，请分批'); return; }
            const btn = document.getElementById('genBtn');
            btn.disabled = true; btn.textContent = '生成中…';
            try {
                const resp = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ emails })
                });
                const data = await resp.json();
                if (!resp.ok || data.error) throw new Error(data.error || ('HTTP ' + resp.status));
                const len = document.getElementById('pwdLen').value;
                const batch = Date.now();
                const accounts = (data.results || []).map(r => ({
                    ts: batch,
                    batch,
                    email: r.email,
                    username: normalizeGenUsername(r.username, r.email),
                    password: genPassword(len),
                }));
                saveGenHistory(accounts);
                openGenModal(accounts);
            } catch (err) {
                showToast('生成失败：' + (err.message || err));
            } finally {
                btn.disabled = false; btn.textContent = '生成';
            }
        }

        function openGenModal(accounts) {
            currentGenAccounts = accounts;
            document.getElementById('genModalBody').innerHTML = accounts.map(renderGenItem).join('');
            document.getElementById('genResultCount').textContent = accounts.length + ' 条';
            document.getElementById('genModal').classList.add('show');
        }
        function closeGenModal() { document.getElementById('genModal').classList.remove('show'); }

        function copyAllGen() {
            if (!currentGenAccounts.length) return;
            const text = currentGenAccounts.map(a => buildBlock(a.email, a.username, a.password)).join('\\n\\n');
            navigator.clipboard.writeText(text).then(() => showToast('已复制 ' + currentGenAccounts.length + ' 条'));
        }

        function getGenHistory() {
            try { return JSON.parse(localStorage.getItem(GEN_STORAGE_KEY)) || []; } catch { return []; }
        }
        function saveGenHistory(accounts) {
            if (!accounts || !accounts.length) return;
            let history = accounts.concat(getGenHistory());
            if (history.length > MAX_GEN) history = history.slice(0, MAX_GEN);
            localStorage.setItem(GEN_STORAGE_KEY, JSON.stringify(history));
            genExpandedKeys = new Set([taskKey(accounts[0])]);
            renderGenHistory();
        }
        function dayKey(ts) {
            const d = new Date(ts);
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return d.getFullYear() + '-' + m + '-' + day;
        }
        function taskKey(a) {
            return a.batch ? String(a.batch) : ('day-' + dayKey(a.ts));
        }
        function taskLabel(key) {
            return key.indexOf('day-') === 0 ? key.slice(4) : new Date(Number(key)).toLocaleString();
        }
        function toggleGenShowAll() {
            genShowAll = !genShowAll;
            document.getElementById('genToggleBtn').textContent = genShowAll ? '仅最近三天' : '显示全部';
            renderGenHistory();
        }
        function renderGenHistory() {
            const history = getGenHistory();
            const list = document.getElementById('genHistoryList');
            if (!history.length) { list.innerHTML = '<div class="empty-tip">暂无生成记录</div>'; return; }
            const groups = {};
            const order = [];
            for (const a of history) {
                const k = taskKey(a);
                if (!groups[k]) { groups[k] = []; order.push(k); }
                groups[k].push(a);
            }
            let keys = order;
            if (!genShowAll) {
                const cutoff = Date.now() - 2 * 86400000;
                keys = keys.filter(k => groups[k].some(a => a.ts >= cutoff));
            }
            if (!genInited && keys.length) { genExpandedKeys.add(keys[0]); genInited = true; }
            let html = '';
            for (const k of keys) {
                const items = groups[k];
                const open = genExpandedKeys.has(k);
                html += '<div class="date-group-title">'
                    + '<span class="date-label" onclick="toggleGenTask(\\'' + k + '\\')">' + (open ? '▼ ' : '▶ ') + taskLabel(k) + '（' + items.length + ' 条）</span>'
                    + '<span class="date-actions">'
                    + '<button class="date-copy-btn" onclick="copyGenByTask(\\'' + k + '\\')">复制全部</button>'
                    + '<button class="date-clear-btn" onclick="clearGenByTask(\\'' + k + '\\')">清理</button>'
                    + '</span></div>';
                html += '<div class="date-group-items"' + (open ? '' : ' style="display:none"') + '>'
                    + items.map((a, i) => renderGenItem(a, i)).join('') + '</div>';
            }
            if (!html) html = '<div class="empty-tip">最近三天暂无记录，点「显示全部」查看更早</div>';
            list.innerHTML = html;
        }
        function toggleGenTask(key) {
            if (genExpandedKeys.has(key)) genExpandedKeys.delete(key);
            else genExpandedKeys.add(key);
            renderGenHistory();
        }
        function tasksByKey(key) {
            return getGenHistory().filter(a => taskKey(a) === key);
        }
        function copyGenByTask(key) {
            const items = tasksByKey(key);
            if (!items.length) return;
            const text = items.map(a => buildBlock(a.email, a.username, a.password)).join('\\n\\n');
            navigator.clipboard.writeText(text).then(() => showToast('已复制 ' + items.length + ' 条'));
        }
        function clearGenByTask(key) {
            const items = tasksByKey(key);
            if (!confirm('确定清理该任务的 ' + items.length + ' 条记录？此操作不可恢复。')) return;
            localStorage.setItem(GEN_STORAGE_KEY, JSON.stringify(getGenHistory().filter(a => taskKey(a) !== key)));
            renderGenHistory();
            showToast('已清理 ' + items.length + ' 条');
        }

        function applyThemeIcon() {
            document.getElementById('themeToggle').textContent =
                document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
        }
        function toggleTheme() {
            var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            localStorage.setItem('theme', next);
            applyThemeIcon();
        }

        renderHistory();
        renderGenHistory();
        applyThemeIcon();
        document.getElementById('genInput').addEventListener('input', updateGenCount);
        document.getElementById('eduCount').addEventListener('input', updateEduCount);
        document.getElementById('genModal').addEventListener('click', function(e) { if (e.target === this) closeGenModal(); });
    </script>
</body>
</html>`;

// 用户名生成模型：支持 JSON Mode（response_format），输出受约束的干净 JSON。
const AI_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const USERNAME_SYS_PROMPT = `你是用户名生成助手。我会给你一批邮箱（每行一个）。把每个邮箱 @ 之前的部分当拼音、按音节切分，为每个邮箱生成一个简短好看的用户名。

对每个邮箱从下列规则随机选一条（不同邮箱尽量用不同规则）：
1. 取各音节首字母（yangsitian -> yst）
2. 第一个完整音节 + 其余音节首字母（jiadan -> jiad）
3. 第一个音节首字母 + 后一个完整音节（jiadan -> jdan）
4. 取中间某个完整音节（yangshenting -> shen）
5. 纯数字或无法识别为拼音时，用常见拼音/英文起一个 6-7 位用户名

要求：
- 用户名只含小写字母和数字、长度 6-7 位、自然好看。
- 如果缩写结果不足 6 位，用自然的字母或数字补足到 6-7 位。
- 忽略邮箱前缀的数字后缀（jiadan9621 按 jiadan 处理）。
- email 原样回填。
- 输出 JSON 对象 {"results":[{"email":"原始邮箱","username":"用户名"}]}，不要解释、不要 markdown。`;

const USERNAME_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
function randBackendChar(set) {
  return set[Math.floor(Math.random() * set.length)];
}

function normalizeUsername(username, email) {
  let u = String(username || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const source = String(email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  if (u.length < 6) u += source;
  while (u.length < 6) u += randBackendChar(USERNAME_CHARS);
  return u.slice(0, 7);
}

function fallbackUsername(email) {
  return normalizeUsername('', email);
}

function extractPairs(out) {
  if (out && typeof out === 'object') {
    return Array.isArray(out) ? out : (out.results || out.usernames || []);
  }
  let s = String(out || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<think>[\s\S]*$/i, '')
    .replace(/```(?:json)?/gi, '');
  try {
    const whole = JSON.parse(s.trim());
    return Array.isArray(whole) ? whole : (whole.results || []);
  } catch {}
  const arr = [];
  for (const chunk of s.match(/\{[^{}]*\}/g) || []) {
    try { const it = JSON.parse(chunk); if (it && it.email && it.username) arr.push(it); } catch {}
  }
  return arr;
}

function parseUsernameJson(out, emails) {
  const arr = extractPairs(out);
  const map = new Map();
  const ordered = [];
  for (const it of Array.isArray(arr) ? arr : []) {
    if (it && it.email && it.username) {
      const u = normalizeUsername(it.username, it.email);
      map.set(String(it.email).trim().toLowerCase(), u);
      ordered.push(String(it.username).trim());
    }
  }
  return emails.map((email, i) => {
    const hit = map.get(email.trim().toLowerCase());
    const byPos = ordered.length === emails.length ? normalizeUsername(ordered[i], email) : '';
    return { email, username: hit || byPos || fallbackUsername(email) };
  });
}

async function handleGenerate(request, env) {
  try {
    const body = await request.json();
    const emails = [...new Set((Array.isArray(body.emails) ? body.emails : [])
      .map(e => String(e).trim()).filter(Boolean))];
    if (emails.length === 0) {
      return Response.json({ error: '没有有效的邮箱' }, { status: 400 });
    }
    if (!env.AI) {
      return Response.json(
        { error: 'AI 绑定未配置，请在 Cloudflare 后台为该 Worker 添加 Workers AI 绑定（变量名 AI）' },
        { status: 500 }
      );
    }
    const ai = await env.AI.run(AI_MODEL, {
      messages: [
        { role: 'system', content: USERNAME_SYS_PROMPT },
        { role: 'user', content: emails.join('\n') },
      ],
      max_tokens: 4096,
      temperature: 0.8,
      response_format: {
        type: 'json_schema',
        json_schema: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: { email: { type: 'string' }, username: { type: 'string' } },
                required: ['email', 'username'],
              },
            },
          },
          required: ['results'],
        },
      },
    });
    const out = typeof ai === 'string' ? ai : (ai.response ?? ai.result ?? ai);
    return Response.json({ results: parseUsernameJson(out, emails) });
  } catch (err) {
    return Response.json({ error: String((err && err.message) || err) }, { status: 500 });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/api/generate') {
      return handleGenerate(request, env);
    }
    return new Response(HTML, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
  },
};
