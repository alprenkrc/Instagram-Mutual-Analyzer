// Bu kodu Instagram web sayfasında konsola yapıştırarak çalıştırabilirsiniz
async function createMutualAnalyzer() {
    // Dil çevirileri
    const translations = {
        tr: {
            title: 'Instagram Mutual Analyzer',
            minMutualLabel: 'Minimum ortak arkadaş sayısı:',
            exceptionListLabel: 'İstisna hesaplar:',
            exceptionInputPlaceholder: 'Kullanıcı adı',
            addButton: 'Ekle',
            removeButton: 'Sil',
            noExceptionsYet: 'Henüz istisna hesap eklenmedi',
            exceptionListHelp: 'Çok fazla takip eden/edilen hesapları buraya ekleyerek analiz dışında bırakabilirsiniz.',
            startAnalysis: 'Analizi Başlat',
            analyzing: 'Analiz Yapılıyor...',
            gettingFollowers: 'Takip ettikleriniz ve takipçileriniz alınıyor...',
            securityNote: 'Not: Güvenlik önlemleri nedeniyle işlem normalden daha uzun sürebilir.',
            requestsThisHour: 'Son 1 saatte yapılan istek sayısı:',
            remainingRequests: 'Kalan istek hakkı:',
            elapsedTime: 'Geçen süre:',
            analyzingFollowed: 'Takip ettiğiniz hesapların takip ettikleri inceleniyor...',
            batchWaitInfo: 'Her {batchSize} istekte bir {batchPause} saniye bekleme yapılacak.',
            analyzingAccount: 'İncelenen hesap: @{username}',
            noResults: 'Kriterlere uygun hesap bulunamadı.',
            totalElapsedTime: 'Toplam geçen süre:',
            mutualFriends: 'ortak arkadaş',
            error: 'Hata:',
            hour: 'saat',
            minute: 'dakika',
            second: 'saniye',
            processing: 'İşleniyor...',
            stopAnalysis: 'Analizi Durdur',
            analysisStopped: 'Analiz durduruldu.',
            skipped: 'atlandı'
        },
        en: {
            title: 'Instagram Mutual Analyzer',
            minMutualLabel: 'Minimum mutual friends:',
            exceptionListLabel: 'Exception accounts:',
            exceptionInputPlaceholder: 'Username',
            addButton: 'Add',
            removeButton: 'Remove',
            noExceptionsYet: 'No exception accounts added yet',
            exceptionListHelp: 'Add accounts with too many followers/following here to exclude them from analysis.',
            startAnalysis: 'Start Analysis',
            analyzing: 'Analyzing...',
            gettingFollowers: 'Getting your followers and following...',
            securityNote: 'Note: Process might take longer due to security measures.',
            requestsThisHour: 'Requests made in the last hour:',
            remainingRequests: 'Remaining requests:',
            elapsedTime: 'Elapsed time:',
            analyzingFollowed: 'Analyzing accounts you follow...',
            batchWaitInfo: 'Will wait {batchPause} seconds after every {batchSize} requests.',
            analyzingAccount: 'Analyzing account: @{username}',
            noResults: 'No accounts matching the criteria found.',
            totalElapsedTime: 'Total elapsed time:',
            mutualFriends: 'mutual friends',
            error: 'Error:',
            hour: 'hour',
            minute: 'minute',
            second: 'second',
            processing: 'Processing...',
            stopAnalysis: 'Stop Analysis',
            analysisStopped: 'Analysis stopped.',
            skipped: 'skipped'
        }
    };

    // Dil seçimi için kullanıcı tercihi (varsayılan: tr)
    let currentLang = localStorage.getItem('mutualAnalyzerLang') || 'tr';
    
    // İstisna hesaplar listesi
    let exceptionAccounts = [];

    // İstisna hesap ekleme fonksiyonu
    function addExceptionAccount(username) {
        username = username.trim().toLowerCase();
        if (username && !exceptionAccounts.includes(username)) {
            exceptionAccounts.push(username);
            updateExceptionDisplay();
        }
    }

    // İstisna hesap silme fonksiyonu
    function removeExceptionAccount(username) {
        const index = exceptionAccounts.indexOf(username);
        if (index > -1) {
            exceptionAccounts.splice(index, 1);
            updateExceptionDisplay();
        }
    }

    // İstisna hesaplar görüntüsünü güncelleme fonksiyonu
    function updateExceptionDisplay() {
        const listDiv = document.getElementById('exception-list');
        if (exceptionAccounts.length === 0) {
            listDiv.innerHTML = `<small style="color: #8e8e8e;">${t('noExceptionsYet')}</small>`;
        } else {
            listDiv.innerHTML = exceptionAccounts.map(username => `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: white;
                    padding: 6px 10px;
                    margin-bottom: 4px;
                    border-radius: 4px;
                    border: 1px solid #dbdbdb;
                ">
                    <span style="color: #262626; font-weight: 500;">@${username}</span>
                    <button onclick="removeExceptionAccount('${username}')" style="
                        background: #ed4956;
                        color: white;
                        border: none;
                        padding: 2px 6px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 11px;
                        font-weight: 600;
                    ">${t('removeButton')}</button>
                </div>
            `).join('');
        }
    }

    // Metin çeviri fonksiyonu
    function t(key, replacements = {}) {
        let text = translations[currentLang][key] || translations.tr[key];
        Object.keys(replacements).forEach(key => {
            text = text.replace(`{${key}}`, replacements[key]);
        });
        return text;
    }

    // Önce mevcut UI'ı temizle
    const existingUI = document.getElementById('mutual-analyzer-ui');
    if (existingUI) {
        existingUI.remove();
    }

    // Ana container'ı oluştur
    const container = document.createElement('div');
    container.id = 'mutual-analyzer-ui';
    container.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    `;

    // Başlık
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 15px;
        background: #0095f6;
        color: white;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    header.innerHTML = `
        <span>${t('title')}</span>
        <div>
            <select id="lang-selector" style="
                margin-right: 10px;
                background: white;
                border: none;
                padding: 2px 5px;
                border-radius: 3px;
                cursor: pointer;
            ">
                <option value="tr" ${currentLang === 'tr' ? 'selected' : ''}>TR</option>
                <option value="en" ${currentLang === 'en' ? 'selected' : ''}>EN</option>
            </select>
            <button id="close-analyzer" style="
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
            ">×</button>
        </div>
    `;

    // Ayarlar bölümü
    const settings = document.createElement('div');
    settings.style.cssText = `
        padding: 15px;
        border-bottom: 1px solid #dbdbdb;
    `;
    settings.innerHTML = `
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px; color: #262626; font-weight: 600;">${t('minMutualLabel')}</label>
            <input type="number" id="min-mutual" value="2" min="1" style="
                color: #262626;
                width: 100%;
                padding: 8px;
                border: 1px solid #dbdbdb;
                border-radius: 4px;
            ">
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px; color: #262626; font-weight: 600;">${t('exceptionListLabel')}</label>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <input type="text" id="exception-input" placeholder="${t('exceptionInputPlaceholder')}" style="
                    color: #262626;
                    flex: 1;
                    padding: 8px;
                    border: 1px solid #dbdbdb;
                    border-radius: 4px;
                ">
                <button id="add-exception" type="button" style="
                    background: #0095f6;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    white-space: nowrap;
                ">${t('addButton')}</button>
            </div>
            <div id="exception-list" style="
                min-height: 40px;
                border: 1px solid #dbdbdb;
                border-radius: 4px;
                padding: 8px;
                background: #fafafa;
                max-height: 120px;
                overflow-y: auto;
            ">
                <small style="color: #8e8e8e;">${t('noExceptionsYet')}</small>
            </div>
            <small style="color: #8e8e8e; display: block; margin-top: 4px;">
                ${t('exceptionListHelp')}
            </small>
        </div>
        <button id="start-analysis" style="
            background: #0095f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            font-weight: 600;
        ">${t('startAnalysis')}</button>
    `;

    // Sonuçlar bölümü
    const results = document.createElement('div');
    results.id = 'analysis-results';
    results.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 15px;
    `;

    // Analiz durumu için global değişken
    let isAnalysisStopped = false;

    // Progress div'ini oluştur
    const progress = document.createElement('div');
    progress.style.cssText = `
        padding: 15px;
        display: none;
    `;
    progress.innerHTML = `
        <div style="margin-bottom: 10px;">
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            ">
                <div style="color: #262626; font-weight: 500;">
                    <span id="progress-text">${t('processing')} 0%</span>
                </div>
                <button id="stop-analysis" style="
                    background: #ed4956;
                    color: white;
                    border: none;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 600;
                ">${t('stopAnalysis')}</button>
            </div>
            <div id="current-user" style="
                color: #0095f6;
                font-size: 13px;
                margin-bottom: 8px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            "></div>
        </div>
        <div style="
            height: 4px;
            background: #dbdbdb;
            border-radius: 2px;
            overflow: hidden;
        ">
            <div id="progress-bar" style="
                width: 0%;
                height: 100%;
                background: #0095f6;
                transition: width 0.3s;
            "></div>
        </div>
    `;

    // Elementleri container'a ekle
    container.appendChild(header);
    container.appendChild(settings);
    container.appendChild(progress);
    container.appendChild(results);
    document.body.appendChild(container);

    // Fonksiyonları global hale getir
    window.removeExceptionAccount = removeExceptionAccount;

    // Dil değiştirme event listener'ı
    document.getElementById('lang-selector').addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('mutualAnalyzerLang', currentLang);
        createMutualAnalyzer(); // UI'ı yeniden oluştur
    });

    // Event listener'ları ekle
    document.getElementById('close-analyzer').addEventListener('click', () => {
        container.remove();
    });

    // İstisna hesap ekleme event listener'ları
    document.getElementById('add-exception').addEventListener('click', () => {
        const input = document.getElementById('exception-input');
        const username = input.value.trim();
        if (username) {
            addExceptionAccount(username);
            input.value = '';
        }
    });

    document.getElementById('exception-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const username = e.target.value.trim();
            if (username) {
                addExceptionAccount(username);
                e.target.value = '';
            }
        }
    });

    document.getElementById('start-analysis').addEventListener('click', async () => {
        isAnalysisStopped = false; // Analiz başlarken flag'i sıfırla
        const minMutual = parseInt(document.getElementById('min-mutual').value) || 2;
        const exceptionList = [...exceptionAccounts]; // İstisna hesapları kopyala
        const startButton = document.getElementById('start-analysis');
        const progressDiv = progress;
        const resultsDiv = document.getElementById('analysis-results');

        startButton.disabled = true;
        startButton.textContent = t('analyzing');
        progressDiv.style.display = 'block';
        resultsDiv.innerHTML = '';

        // Durdurma butonu event listener'ı
        document.getElementById('stop-analysis').addEventListener('click', () => {
            isAnalysisStopped = true;
            document.getElementById('stop-analysis').disabled = true;
        });

        try {
            await runAnalysis(minMutual, exceptionList, progressDiv, resultsDiv);
        } catch (error) {
            resultsDiv.innerHTML = `<div style="color: red; padding: 10px;">${t('error')} ${error.message}</div>`;
        } finally {
            startButton.disabled = false;
            startButton.textContent = t('startAnalysis');
            progressDiv.style.display = 'none';
        }
    });

    // Rate limiting ve güvenlik ayarları
    const SAFETY_SETTINGS = {
        MIN_DELAY: 400,   // Minimum bekleme süresi 800ms'den 400ms'e düşürüldü
        MAX_DELAY: 1000,  // Maximum bekleme süresi 2000ms'den 1000ms'e düşürüldü
        BATCH_SIZE: 48,   // Tek seferde alınacak kullanıcı sayısı 24'ten 48'e çıkarıldı
        MAX_REQUESTS_PER_HOUR: 750,  // Saatlik maksimum istek sayısı 500'den 750'ye çıkarıldı
        BATCH_PAUSE: 8000, // Her batch sonrası bekleme süresi 15000ms'den 8000ms'e düşürüldü
        REQUEST_WINDOW: 60 * 60 * 1000, // 1 saat (milisaniye)
        INITIAL_BATCH_SIZE: 72 // İlk yüklemede daha fazla veri almak için 48'den 72'ye çıkarıldı
    };

    // İstek sayacı ve zaman damgalarını tutacak dizi
    let requestTimestamps = [];

    // Rate limit kontrolü
    function checkRateLimit() {
        const now = Date.now();
        // Son bir saat içindeki istekleri filtrele
        requestTimestamps = requestTimestamps.filter(timestamp => 
            now - timestamp < SAFETY_SETTINGS.REQUEST_WINDOW
        );
        
        if (requestTimestamps.length >= SAFETY_SETTINGS.MAX_REQUESTS_PER_HOUR) {
            const oldestRequest = Math.min(...requestTimestamps);
            const waitTime = SAFETY_SETTINGS.REQUEST_WINDOW - (now - oldestRequest);
            throw new Error(`Saatlik istek limiti aşıldı. ${Math.ceil(waitTime / 60000)} dakika sonra tekrar deneyin.`);
        }
        
        requestTimestamps.push(now);
    }

    // Güvenli API çağrısı yapan yardımcı fonksiyon
    async function safeApiCall(apiCall, isInitialLoad = false) {
        try {
            checkRateLimit();
            
            // İlk yükleme sırasında daha az bekleme süresi
            if (isInitialLoad) {
                await new Promise(resolve => setTimeout(resolve, SAFETY_SETTINGS.MIN_DELAY));
            } else {
                // Her BATCH_SIZE istekte bir uzun mola ver
                if (requestTimestamps.length % SAFETY_SETTINGS.BATCH_SIZE === 0) {
                    await new Promise(resolve => setTimeout(resolve, SAFETY_SETTINGS.BATCH_PAUSE));
                } else {
                    await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
                }
            }
            
            return await apiCall();
        } catch (error) {
            if (error.message.includes('limiti aşıldı')) {
                throw error;
            }
            console.error('API çağrısı hatası:', error);
            await new Promise(resolve => setTimeout(resolve, SAFETY_SETTINGS.MAX_DELAY));
            return await apiCall();
        }
    }

    // Rastgele bekleme süresi oluştur
    function getRandomDelay() {
        return Math.floor(Math.random() * (SAFETY_SETTINGS.MAX_DELAY - SAFETY_SETTINGS.MIN_DELAY + 1)) + SAFETY_SETTINGS.MIN_DELAY;
    }

    async function runAnalysis(minMutual, exceptionList, progressDiv, resultsDiv) {
        // Kendi kullanıcı ID'nizi almak için
        let userId;
        try {
            const getData = await fetch('/data/shared_data/');
            const jsonData = await getData.json();
            userId = jsonData.config.viewerId;
            
            if (!userId) {
                const response = await fetch('/accounts/get_account_data/');
                const data = await response.json();
                userId = data.user_id;
            }
            
            if (!userId) {
                throw new Error('Kullanıcı ID\'si bulunamadı. Lütfen Instagram\'a giriş yaptığınızdan emin olun.');
            }
        } catch (error) {
            throw new Error('Kullanıcı ID\'si alınamadı: ' + error.message);
        }

        // Takip edilenleri al
        async function getFollowing() {
            const following = new Map();
            let hasNext = true;
            let endCursor = null;
            let isFirstBatch = true;
            
            while (hasNext) {
                const variables = {
                    "id": userId,
                    "first": isFirstBatch ? SAFETY_SETTINGS.INITIAL_BATCH_SIZE : SAFETY_SETTINGS.BATCH_SIZE,
                    "after": endCursor
                };
                
                const data = await safeApiCall(async () => {
                    const response = await fetch(`https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=${JSON.stringify(variables)}`);
                    if (!response.ok) {
                        throw new Error(`API yanıt hatası: ${response.status}`);
                    }
                    return await response.json();
                }, isFirstBatch);

                const edges = data.data.user.edge_follow.edges;
                edges.forEach(edge => following.set(edge.node.id, edge.node.username));
                
                hasNext = data.data.user.edge_follow.page_info.has_next_page;
                endCursor = data.data.user.edge_follow.page_info.end_cursor;
                isFirstBatch = false;
            }
            
            return following;
        }

        // Takipçileri al
        async function getFollowers() {
            const followers = new Map();
            let hasNext = true;
            let endCursor = null;
            let isFirstBatch = true;
            
            while (hasNext) {
                const variables = {
                    "id": userId,
                    "first": isFirstBatch ? SAFETY_SETTINGS.INITIAL_BATCH_SIZE : SAFETY_SETTINGS.BATCH_SIZE,
                    "after": endCursor
                };
                
                const data = await safeApiCall(async () => {
                    const response = await fetch(`https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=${JSON.stringify(variables)}`);
                    if (!response.ok) {
                        throw new Error(`API yanıt hatası: ${response.status}`);
                    }
                    return await response.json();
                }, isFirstBatch);

                const edges = data.data.user.edge_followed_by.edges;
                edges.forEach(edge => followers.set(edge.node.id, edge.node.username));
                
                hasNext = data.data.user.edge_followed_by.page_info.has_next_page;
                endCursor = data.data.user.edge_followed_by.page_info.end_cursor;
                isFirstBatch = false;
            }
            
            return followers;
        }

        // Bir kullanıcının takip ettiklerini al
        async function getUserFollowing(userId) {
            const following = new Map();
            let hasNext = true;
            let endCursor = null;
            let retryCount = 0;
            const MAX_RETRIES = 3;
            
            while (hasNext && retryCount < MAX_RETRIES) {
                const variables = {
                    "id": userId,
                    "first": SAFETY_SETTINGS.BATCH_SIZE,
                    "after": endCursor
                };
                
                try {
                    const data = await safeApiCall(async () => {
                        const response = await fetch(`https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=${JSON.stringify(variables)}`);
                        if (!response.ok) {
                            throw new Error(`API yanıt hatası: ${response.status}`);
                        }
                        return await response.json();
                    });

                    const edges = data.data.user.edge_follow.edges;
                    edges.forEach(edge => following.set(edge.node.id, edge.node.username));
                    
                    hasNext = data.data.user.edge_follow.page_info.has_next_page;
                    endCursor = data.data.user.edge_follow.page_info.end_cursor;
                } catch (error) {
                    console.error(`Takip edilenler alınamadı (${userId}):`, error);
                    retryCount++;
                    if (retryCount >= MAX_RETRIES) {
                        console.warn(`Maksimum deneme sayısına ulaşıldı (${userId})`);
                        hasNext = false;
                    } else {
                        await new Promise(resolve => setTimeout(resolve, SAFETY_SETTINGS.MAX_DELAY * 2));
                    }
                }
            }
            
            return following;
        }

        // Progress bar'ı güncelle
        function updateProgress(current, total, currentUsername) {
            const percentage = Math.round((current / total) * 100);
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            const currentUser = document.getElementById('current-user');

            if (progressBar) progressBar.style.width = `${percentage}%`;
            if (progressText) progressText.textContent = `${t('processing')} ${percentage}%`;
            if (currentUser) currentUser.textContent = t('analyzingAccount', { username: currentUsername });
        }

        // Geçen süre sayacı
        function formatElapsedTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            
            let timeString = '';
            if (hours > 0) timeString += `${hours} ${t('hour')} `;
            if (minutes > 0) timeString += `${minutes} ${t('minute')} `;
            timeString += `${remainingSeconds} ${t('second')}`;
            
            return timeString;
        }

        // Sonuç kartı oluştur
        function createResultCard(username, mutualCount) {
            return `
                <div style="
                    border: 1px solid #dbdbdb;
                    border-radius: 4px;
                    padding: 15px;
                    margin-bottom: 10px;
                    background: white;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <a href="https://www.instagram.com/${username}" target="_blank" style="
                            color: #262626;
                            text-decoration: none;
                            font-weight: 600;
                            font-size: 14px;
                        ">@${username}</a>
                        <span style="
                            background: #0095f6;
                            color: white;
                            padding: 4px 8px;
                            border-radius: 12px;
                            font-size: 12px;
                            font-weight: 500;
                        ">${mutualCount} ${t('mutualFriends')}</span>
                    </div>
                </div>
            `;
        }

        // Ana analiz fonksiyonu
        resultsDiv.innerHTML = `
            <div style="padding: 10px;">
                <small style="color: #8e8e8e;">
                    ${t('gettingFollowers')}
                </small>
                <br><small style="color: #8e8e8e;">
                    ${t('securityNote')}
                    <br>${t('requestsThisHour')} ${requestTimestamps.length}
                    <br>${t('remainingRequests')} ${SAFETY_SETTINGS.MAX_REQUESTS_PER_HOUR - requestTimestamps.length}
                    <br><span id="elapsed-time">${t('elapsedTime')} 0 ${t('second')}</span>
                </small>
            </div>
        `;
        
        try {
            const startTime = Date.now();
            let elapsedTimeInterval = setInterval(() => {
                const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                document.getElementById('elapsed-time').textContent = 
                    `${t('elapsedTime')} ${formatElapsedTime(elapsedSeconds)}`;
            }, 1000);

            const following = await getFollowing();
            const followers = await getFollowers();

            resultsDiv.innerHTML = `
                <div style="padding: 10px; color: #262626;">
                    ${t('analyzingFollowed')}
                    <br><small style="color: #8e8e8e;">
                        ${t('batchWaitInfo', { batchSize: SAFETY_SETTINGS.BATCH_SIZE, batchPause: SAFETY_SETTINGS.BATCH_PAUSE/1000 })}
                        <br>${t('remainingRequests')} ${SAFETY_SETTINGS.MAX_REQUESTS_PER_HOUR - requestTimestamps.length}
                        <br><span id="elapsed-time">${t('elapsedTime')} 0 ${t('second')}</span>
                    </small>
                </div>
            `;

            const potentialAccounts = new Map();
            let processedCount = 0;

            for (const [followedId, followedUsername] of following) {
                // Analiz durduruldu mu kontrol et
                if (isAnalysisStopped) {
                    clearInterval(elapsedTimeInterval);
                    resultsDiv.innerHTML = `
                        <div style="padding: 10px; color: #262626;">
                            ${t('analysisStopped')}
                            <br><small style="color: #8e8e8e;">
                                ${t('totalElapsedTime')} ${formatElapsedTime(Math.floor((Date.now() - startTime) / 1000))}
                            </small>
                        </div>
                    `;
                    return;
                }

                // İstisna listesinde yer alan hesapları atla
                if (exceptionList.includes(followedUsername.toLowerCase())) {
                    processedCount++;
                    updateProgress(processedCount, following.size, `@${followedUsername} (${t('skipped')})`);
                    continue;
                }

                processedCount++;
                updateProgress(processedCount, following.size, followedUsername);
                
                const theirFollowing = await getUserFollowing(followedId);
                
                for (const [potentialId, potentialUsername] of theirFollowing) {
                    if (exceptionList.includes(potentialUsername.toLowerCase())) {
                        continue;
                    }

                    if (!following.has(potentialId) && !followers.has(potentialId)) {
                        if (!potentialAccounts.has(potentialId)) {
                            potentialAccounts.set(potentialId, {
                                username: potentialUsername,
                                mutualCount: 1
                            });
                        } else {
                            const account = potentialAccounts.get(potentialId);
                            account.mutualCount++;
                        }
                    }
                }
            }

            // Analiz bittiğinde interval'i temizle
            clearInterval(elapsedTimeInterval);

            // Sonuçları filtrele ve sırala
            const sortedResults = Array.from(potentialAccounts.entries())
                .filter(([_, info]) => info.mutualCount >= minMutual)
                .sort((a, b) => b[1].mutualCount - a[1].mutualCount);

            // Toplam geçen süreyi son kez göster
            const totalElapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            
            // Sonuçları göster
            if (sortedResults.length === 0) {
                resultsDiv.innerHTML = `
                    <div style="padding: 10px; color: #262626;">
                        ${t('noResults')}
                        <br><small style="color: #8e8e8e;">
                            ${t('totalElapsedTime')} ${formatElapsedTime(totalElapsedSeconds)}
                        </small>
                    </div>`;
            } else {
                resultsDiv.innerHTML = `
                    <div style="padding: 10px; color: #8e8e8e; margin-bottom: 10px;">
                        ${t('totalElapsedTime')} ${formatElapsedTime(totalElapsedSeconds)}
                    </div>
                    ${sortedResults
                        .map(([_, info]) => createResultCard(info.username, info.mutualCount))
                        .join('')}`;
            }
        } catch (error) {
            clearInterval(elapsedTimeInterval);
            resultsDiv.innerHTML = `<div style="color: red; padding: 10px;">${t('error')} ${error.message}</div>`;
        }
    }
}

// Analiz arayüzünü başlat
createMutualAnalyzer(); 

// Analiz arayüzünü başlat
createMutualAnalyzer(); 
