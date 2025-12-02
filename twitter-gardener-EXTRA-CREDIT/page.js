// ===============================
// Evil Extension + Twitter Gardener - page.js (FINAL)
// ===============================

// ------------------------------
// 1. Evil Extension Transformations
// ------------------------------
const MATCH_LIST = {
    "there": "their",
    "There": "Their",
    "THERE": "THEIR",
    "their": "there",
    "Their": "There",
    "THEIR": "THERE",
    "they're": "there",
    "They're": "There",
    "THEY'RE": "THERE"
};

console.log("Evil extension loaded!");

// تابع بازگشتی برای تبدیل متن
function transformTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent;
        for (let key of Object.keys(MATCH_LIST)) {
            const parts = text.split(key);
            if (parts.length > 1) {
                text = parts.join(MATCH_LIST[key]);
            }
        }
        node.textContent = text;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.nodeName.toLowerCase();
        if (tag === "script" || tag === "style") return;
        for (let child of node.childNodes) {
            transformTextNodes(child);
        }
    }
}

// اعمال تبدیل روی کل صفحه
transformTextNodes(document.body);
console.log("Evil Extension text transformation completed.");


// ------------------------------
// 2. Twitter Gardener
// ------------------------------

// آرایه جملات مثبت
const POSITIVE_MESSAGES = [
    "تو عالی هستی! 🌸",
    "امروز روز شگفت‌انگیزی خواهد بود! 🌞",
    "تو می‌توانی هر کاری انجام دهی! 💪",
    "لبخند بزن، دنیا زیباست! 😊",
    "هر روز یک فرصت جدید است! 🌼",
    "تو الهام‌بخش هستی! ✨",
];

// نگهداری handlerها برای حذف هنگام توقف
let tweetMouseEnterHandler = null;
let tweetMouseLeaveHandler = null;
let tweetClickHandler = null;

// وضعیت باغبانی
let gardeningActive = false;

// انتخاب تمام توییت‌ها
function getAllTweets() {
    return document.querySelectorAll('article[role="article"]');
}

// تابع اصلی باغبانی
function onMessage(gardeningInProgress) {
    gardeningActive = gardeningInProgress;
    const tweets = getAllTweets();

    if (gardeningActive) {
        const cursorURL = chrome.runtime.getURL('images/rose-cursor.gif');
        const bgURL = chrome.runtime.getURL('images/sparkle.gif');

        // تعریف event handlerها
        tweetMouseEnterHandler = function() {
            this.style.cursor = `url(${cursorURL}) 4 12, auto`;
            this.style.backgroundImage = `url(${bgURL})`;
            this.style.opacity = '0.8';
            this.style.backgroundSize = 'cover';
        };

        tweetMouseLeaveHandler = function() {
            this.style.cursor = '';
            this.style.backgroundImage = '';
            this.style.opacity = '';
        };

        tweetClickHandler = function(event) {
            event.stopPropagation();
            const textElements = this.querySelectorAll('div[lang]');
            const randomMsg = POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
            textElements.forEach(el => el.textContent = randomMsg);
        };

        // افزودن listenerها به توییت‌ها
        tweets.forEach(tweet => {
            tweet.addEventListener('mouseenter', tweetMouseEnterHandler);
            tweet.addEventListener('mouseleave', tweetMouseLeaveHandler);
            tweet.addEventListener('click', tweetClickHandler);
        });

    } else {
        // حذف listenerها و بازگرداندن حالت پیش‌فرض
        tweets.forEach(tweet => {
            if (tweetMouseEnterHandler) tweet.removeEventListener('mouseenter', tweetMouseEnterHandler);
            if (tweetMouseLeaveHandler) tweet.removeEventListener('mouseleave', tweetMouseLeaveHandler);
            if (tweetClickHandler) tweet.removeEventListener('click', tweetClickHandler);
            tweet.style.cursor = '';
            tweet.style.backgroundImage = '';
            tweet.style.opacity = '';
        });
    }
}

// گوش دادن به پیام از popup.js برای Start/Stop Gardening
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'TOGGLE_GARDENING') {
        onMessage(message.gardeningInProgress);
    }
});

console.log("Twitter Gardener script loaded!");