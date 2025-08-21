document.addEventListener('DOMContentLoaded', () => {
    // Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('progressBar').style.width = scrolled + '%';
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const isExpanded = mobileMenu.classList.contains('hidden') ? 'false' : 'true';
        mobileMenuButton.setAttribute('aria-expanded', isExpanded);
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
        themeToggle.querySelector('i').classList.toggle('fa-moon');
        themeToggle.querySelector('i').classList.toggle('fa-sun');
    });

    // Chatbot Functionality
    const chatToggleButton = document.getElementById('chatToggleButton');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotOverlay = document.getElementById('chatbotOverlay');
    const closeChat = document.getElementById('closeChat');
    const sendButton = document.getElementById('sendButton');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    // Load chat history from localStorage
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(msg => appendMessage(msg.text, msg.type));

    // Initialize with bot greeting if chat history is empty
    if (chatHistory.length === 0) {
        const greeting = 'Hello! How can I help you with your network today?';
        appendMessage(greeting, 'bot');
        chatHistory.push({ text: greeting, type: 'bot' });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }

    const responses = {
        'bytes sent': 'Bytes sent in the last 15 minutes: 85.2 MB.',
        'bytes received': 'Bytes received in the last 15 minutes: 120.5 MB.',
        'latency': 'Current average latency: 25 ms.',
        'report': 'You can generate a report by clicking the "Generate Report" button in the Reports section.'
    };

    function appendMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message flex items-start space-x-2 p-3 rounded-lg max-w-[80%] ${type === 'user' ? 'user-message self-end' : 'bot-message self-start'}`;
        const avatar = document.createElement('div');
        avatar.className = 'w-8 h-8 rounded-full flex items-center justify-center';
        avatar.innerHTML = type === 'user' ? '<i class="fas fa-user text-white"></i>' : '<i class="fas fa-robot text-gray-600"></i>';
        avatar.style.backgroundColor = type === 'user' ? '#1e3a8a' : '#d1d5db';
        const textDiv = document.createElement('div');
        textDiv.textContent = text;
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(textDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator p-3 bot-message';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    chatToggleButton.addEventListener('click', () => {
        chatbotContainer.classList.toggle('open');
        chatbotOverlay.classList.toggle('open');
        if (chatbotContainer.classList.contains('open')) chatInput.focus();
    });

    closeChat.addEventListener('click', () => {
        chatbotContainer.classList.remove('open');
        chatbotOverlay.classList.remove('open');
    });

    sendButton.addEventListener('click', () => {
        const input = chatInput.value.trim().toLowerCase();
        if (input) {
            appendMessage(input, 'user');
            chatHistory.push({ text: input, type: 'user' });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

            const typingDiv = showTypingIndicator();
            setTimeout(() => {
                typingDiv.remove();
                const response = responses[input] || 'Sorry, I don’t understand that query.';
                appendMessage(response, 'bot');
                chatHistory.push({ text: response, type: 'bot' });
                localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
            }, 1000);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendButton.click();
    });

    // Optional: API-based chatbot integration (uncomment and add API key to use)
    /*
    async function sendMessageWithAPI() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;
        appendMessage(userMessage, 'user');
        chatHistory.push({ text: userMessage, type: 'user' });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

        const typingDiv = showTypingIndicator();
        try {
            const apiKey = 'YOUR_API_KEY_HERE'; // Add your Google Gemini API key
            const payload = {
                contents: chatHistory.map(msg => ({ role: msg.type === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }))
            };
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            const botResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not get a response.';
            appendMessage(botResponseText, 'bot');
            chatHistory.push({ text: botResponseText, type: 'bot' });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        } catch (error) {
            console.error('Error fetching bot response:', error);
            appendMessage('An error occurred. Please try again.', 'bot');
        } finally {
            typingDiv.remove();
            chatInput.value = '';
        }
    }
    */

    // Chart Initialization
    const ctx = document.getElementById('myLineChart').getContext('2d');
    let myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '00:15', '00:30', '00:45', '01:00'],
            datasets: [{
                label: 'Bytes Sent',
                data: [65, 59, 80, 81, 56],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#3b82f6'
            }, {
                label: 'Bytes Received',
                data: [28, 48, 40, 19, 86],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true },
                tooltip: { mode: 'index', intersect: false },
                title: {
                    display: true,
                    text: 'Network Traffic Over Time',
                    font: { size: 18 }
                }
            },
            scales: {
                x: { title: { display: true, text: 'Time' } },
                y: { title: { display: true, text: 'Data Usage (MB)' }, beginAtZero: true }
            }
        }
    });

    // Mock Real-Time Data
    const mockData = [
        { time: '00:00', bytesSent: 65, bytesReceived: 28 },
        { time: '00:15', bytesSent: 59, bytesReceived: 48 },
        { time: '00:30', bytesSent: 80, bytesReceived: 40 },
        { time: '00:45', bytesSent: 81, bytesReceived: 19 },
        { time: '01:00', bytesSent: 56, bytesReceived: 86 }
    ];

    function updateDashboard(data) {
        document.getElementById('bytesSent').textContent = `${(data[data.length - 1].bytesSent / 1).toFixed(1)} MB`;
        document.getElementById('bytesReceived').textContent = `${(data[data.length - 1].bytesReceived / 1).toFixed(1)} MB`;
        document.getElementById('latency').textContent = `${Math.floor(Math.random() * 10 + 20)} ms`;

        myLineChart.data.labels = data.map(d => d.time);
        myLineChart.data.datasets[0].data = data.map(d => d.bytesSent);
        myLineChart.data.datasets[1].data = data.map(d => d.bytesReceived);
        myLineChart.update();
    }

    // Simulate Real-Time Data Fetch
    async function fetchNetworkData(range = '15m') {
        let filteredData = mockData;
        if (range === '1h') {
            filteredData = mockData.slice(-4);
        } else if (range === '24h') {
            filteredData = mockData.slice(-3);
        }
        updateDashboard(filteredData);
    }

    // Time Range Selector
    document.getElementById('timeRange').addEventListener('change', (e) => {
        fetchNetworkData(e.target.value);
    });

    // Initial Data Fetch and Periodic Updates
    fetchNetworkData();
    setInterval(() => fetchNetworkData(document.getElementById('timeRange').value), 15000);

    // Generate Report
    document.getElementById('generateReport').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text('Network Performance Report', 10, 10);
        doc.text(`Bytes Sent: ${document.getElementById('bytesSent').textContent}`, 10, 20);
        doc.text(`Bytes Received: ${document.getElementById('bytesReceived').textContent}`, 10, 30);
        doc.text(`Latency: ${document.getElementById('latency').textContent}`, 10, 40);
        doc.save('network-report.pdf');
    });
});
    
