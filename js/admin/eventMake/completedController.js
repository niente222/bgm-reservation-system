import * as common from '../../common.js';

// 画面モード
// mode = 'new' 登録画面
// mode = 'edit' 更新画面
var mode = '';
const currentUrl = window.location.pathname;
// URLに含まれるパスによって条件分岐
if (currentUrl.includes('/admin/eventMake/completed/new')) {
    mode = 'new';
} else if (currentUrl.includes('/admin/eventMake/completed/edit')) {
    mode = 'edit';
}

// 更新画面用 パラメータ イベントID
var eventId_urlpram = new URL(window.location.href).pathname.split('/').pop();

window.onload = function() {
    getCompletedEvent(eventId_urlpram);

    document.getElementById('to-list-link').addEventListener('click', () => {
        window.location.href = '/admin/eventList';
    });
}

async function getCompletedEvent(eventId) {
    try {
        // イベントの情報を取得
        const eventResponse = await fetch(`/admin/getEvent?eventId=${eventId}`);
        const eventData = await eventResponse.json();

        if (eventData.eventData.length === 0) {
            throw new Error('イベント情報の取得に失敗しました。');
        }

        setCompletedEventInfo(eventData.eventData[0]);

        // 編集画面の場合は予約データも取得
        if (mode === 'edit') {
            setEditMode();
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

function setCompletedEventInfo(completedData){

    const eventTitle = document.querySelector('.completed-event-title');
    eventTitle.textContent  = completedData.event_title;

    const eventPeriod = document.querySelector('.completed-event-period');
    eventPeriod.textContent  = common.formatDateSlashNoPadding(completedData.start_date)
         + " ～ " + common.formatDateSlashNoPadding(completedData.end_date);
}

function setEditMode(){
    document.title='イベント更新完了ページ';

    const header = document.querySelector('.header');
    header.textContent  = 'イベント更新完了ページ';

    const link = document.querySelector('.completed-message');
    link.textContent  = '更新完了しました。';
}