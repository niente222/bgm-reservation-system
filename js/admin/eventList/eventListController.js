
import * as common from '../../common.js';

window.onload = function() {
    
    //イベントリスト取得
    getEventList();

    //イベントリスト表示
    //addEventListRow();
}

function getEventList() {

    fetch(`/admin/getEventList`)
      .then(response => response.json())
      .then(data => {

        if (data.eventData.length == 0) {
            //throw new Error('イベント情報の取得に失敗しました。');
        }

        addEventListRow(data);
      })
      .catch(error => console.error('Error:', error));
}

function addEventListRow(eventListData) {

    // event-list-board 要素を取得
    const eventListBoard = document.querySelector('.event-list-board');

    for (const data of eventListData.eventData) {
        // 新しい event-row 要素を作成
        const eventRow = document.createElement('div');
        eventRow.className = 'event-row';

        // イベントタイトルの要素を作成
        const eventTitle = document.createElement('div');
        eventTitle.className = 'event-title';
        const titleLink = document.createElement('a');
        titleLink.href = '/admin/eventDashboard/' + data.event_id;
        titleLink.textContent = data.event_title;
        eventTitle.appendChild(titleLink);

        // イベント期間の要素を作成
        const eventPeriod = document.createElement('div');
        eventPeriod.className = 'event-period';
        const periodP = document.createElement('p');
        periodP.textContent = common.convertDBDateToYYYYMMDD(data.start_date) + ' ～ ' 
            + common.convertDBDateToYYYYMMDD(data.end_date);
        eventPeriod.appendChild(periodP);

        // イベント編集の要素を作成
        const eventEdit = document.createElement('div');
        eventEdit.className = 'event-edit';
        const editLink = document.createElement('a');
        editLink.href = '/admin/eventMake/edit/' + data.event_id;
        editLink.textContent = '編集';
        eventEdit.appendChild(editLink);

        // event-row 要素に各部分を追加
        eventRow.appendChild(eventTitle);
        eventRow.appendChild(eventPeriod);
        eventRow.appendChild(eventEdit);

        // event-list-board に event-row を追加
        eventListBoard.appendChild(eventRow);
    }
}
