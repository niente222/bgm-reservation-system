import * as calendarController from '../calendar.js';
import * as common from '../common.js';
import * as reservationDataController from '../admin/eventMake/reservationData.js';

// パラメータ イベントID
var eventId_urlpram = new URL(window.location.href).pathname.split('/').pop();

window.onload = function() {
    calendarController.createCalendar();

    calendarController.clickPrevMonthButton();
    calendarController.clickNextMonthButton();

    init();
}

async function init() {
    try {
        const data = await getEvent();
        
        if (data && data.eventData.length > 0) {
            setEventInfo(data);
        } else {
            console.error('イベント情報の取得に失敗しました。');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getEvent() {
    try {
        const response = await fetch(`/reservation/getEvent?eventId=${eventId_urlpram}`);
        if (!response.ok) {
            throw new Error('ネットワークレスポンスが正常ではありません');
        }
        const data = await response.json();
        console.log('getEvent data:', data);  // レスポンスデータをログに出力
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // エラーを呼び出し元に伝播させる
    }
}

function setEventInfo(data){


    //頑張ってプレビューカレンダーを反映
    //前回のは参考になりそうでならなさそう
    //反映項目ひとつずつ頑張る
    //カレンダーセルごとにその日の受付時間を持たせたいから、それを見越してどんなデータを持ちたいか考える


    reservationDataController.setReservationDataForReservation(data);
    calendarController.updatePreviewCalendar();
}