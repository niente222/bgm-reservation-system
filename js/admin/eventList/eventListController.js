
import * as common from '../../common.js';
import * as constants from '../../constants.js';

var eventList;

window.onload = function() {

    //イベントリスナー登録
    document.getElementById('event-make-button-at-list').addEventListener('click', () => {
        window.location.href = '/admin/eventMake/new';
    });

    document.getElementById('before-event-button').addEventListener('click', function() {
        resetClickingClass();
        this.classList.add('is-clicking');
        clickBeforeEventButton();
    });

    document.getElementById('in-event-button').addEventListener('click', function() {
        resetClickingClass();
        this.classList.add('is-clicking');
        clickInEventButton();
    });

    document.getElementById('after-event-button').addEventListener('click', function() {
        resetClickingClass();
        this.classList.add('is-clicking');
        clickAfterEventButton();
    });

    document.getElementById('all-event-button').addEventListener('click', function() {
        resetClickingClass();
        this.classList.add('is-clicking');
        clickAllEventButton();
    });

    //イベントリスト取得
    getEventList();
}

function getEventList() {

    fetch(`/admin/getEventList`)
      .then(response => response.json())
      .then(data => {

        if (data.eventData.length == 0) {
            //throw new Error('イベント情報の取得に失敗しました。');
        }

        eventList = data.eventData;
        console.log(JSON.stringify(eventList));

        // 開催前ボタンをクリック
        common.clickEvent(document.getElementById('before-event-button'));
        })
      .catch(error => console.error('Error:', error));
}

function addEventListRow(eventListData) {
    removeAllEventRow();

    const eventListBoard = document.querySelector('.event-list-board');
    
    for (const data of eventListData) {
        const eventRow = document.createElement('div');
        eventRow.className = 'event-row';

        const urlArea = document.createElement('div');
        urlArea.className = 'url-area';

        const inputUrl = document.createElement('input');
        inputUrl.type = 'text';
        inputUrl.id = `event-url-id-${data.event_id}`;
        inputUrl.className = `event-url-text`;
        inputUrl.value = constants.originURL + '/reservation/reserve/' + data.event_id;
        inputUrl.disabled = true;
        urlArea.appendChild(inputUrl);

        const urlCopyButton = document.createElement('div');
        urlCopyButton.className = 'copy-url-button';
        urlCopyButton.textContent = 'COPY';
        urlArea.appendChild(urlCopyButton);

        urlCopyButton.addEventListener('click', () => {
            common.copyText(`event-url-id-${data.event_id}`, urlCopyButton);
        });

        const mainArea = document.createElement('div');
        mainArea.className = 'main-area';

        const eventInfo = document.createElement('div');
        eventInfo.className = 'event-info';

        eventInfo.addEventListener('click', () => {
            window.location.href = `/admin/eventDashboard/${data.event_id}`;
        });

        const eventInfoColumnLeft = document.createElement('div');
        eventInfoColumnLeft.className = 'event-info-column-left';

        const eventTitle = document.createElement('div');
        eventTitle.className = 'event-title';
        const titleP = document.createElement('p');
        titleP.textContent = data.event_title;
        eventTitle.appendChild(titleP);

        const eventPeriod = document.createElement('div');
        eventPeriod.className = 'event-period';
        const periodP = document.createElement('p');
        periodP.textContent = `${common.convertDBDateToYYYYMMDD(data.start_date)} ～ ${common.convertDBDateToYYYYMMDD(data.end_date)}`;
        eventPeriod.appendChild(periodP);

        eventInfoColumnLeft.appendChild(eventTitle);
        eventInfoColumnLeft.appendChild(eventPeriod);

        const eventInfoColumnRight = document.createElement('div');
        eventInfoColumnRight.className = 'event-info-column-right';

        const reservationCountTitle = document.createElement('div');
        const reservationCountTitleP = document.createElement('p');
        reservationCountTitleP.textContent = '予約数';
        reservationCountTitle.appendChild(reservationCountTitleP);

        const reservationCount = document.createElement('div');
        const reservationCountP = document.createElement('p');
        reservationCountP.textContent = `${data.reservation_count}件`;
        reservationCount.appendChild(reservationCountP);

        eventInfoColumnRight.appendChild(reservationCountTitle);
        eventInfoColumnRight.appendChild(reservationCount);

        eventInfo.appendChild(eventInfoColumnLeft);
        eventInfo.appendChild(eventInfoColumnRight);

        mainArea.appendChild(eventInfo);

        const eventEdit = document.createElement('div');
        eventEdit.className = 'event-edit';

        eventEdit.addEventListener('click', () => {
            window.location.href = `/admin/eventMake/edit/${data.event_id}`;
        });

        const editImage = document.createElement('img');
        editImage.src = "/images/admin/icon_eventEdit.png";
        editImage.className = "icon-event-edit";

        eventEdit.appendChild(editImage);
        mainArea.appendChild(eventEdit);

        eventRow.appendChild(urlArea);
        eventRow.appendChild(mainArea);

        eventListBoard.appendChild(eventRow);
    }
}

function removeAllEventRow(){
    // クラス名 'event-row' を持つすべての要素を選択
    const eventRows = document.querySelectorAll('.event-row');

    // 選択された要素をループし、それぞれをDOMから削除
    eventRows.forEach(row => {
        row.remove();
    });
}

function clickBeforeEventButton(){
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredEvents = eventList.filter(event => {
        const startDate = new Date(event.start_date);
        return startDate > today;
    });

    addEventListRow(filteredEvents);
}

function clickInEventButton(){
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredEvents = eventList.filter(event => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        return startDate <= today && endDate >= today;
    });

    addEventListRow(filteredEvents);
}

function clickAfterEventButton(){
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredEvents = eventList.filter(event => {
        const endDate = new Date(event.end_date);
        return endDate < today;
    });

    addEventListRow(filteredEvents);
}

function clickAllEventButton(){
    addEventListRow(eventList);
}

function resetClickingClass(){
    const filterButtons = document.querySelectorAll('.filter-button');

    filterButtons.forEach(button => {
        if (button.classList.contains('is-clicking')) {
            button.classList.remove('is-clicking');
        }
    });
}