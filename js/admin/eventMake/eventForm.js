import * as calendarController from '../../calendar.js';
import * as common from '../../common.js';
import * as reservationDataController from './reservationData.js';

// 行追加系
export function addFormRowReceptionTime() {
    const formContainer = document.querySelector('.form.default-reception-time');

    // 新しい行を生成
    const newRow = document.createElement('div');
    newRow.className = 'form-row-default-reception-time form-additional-row';
    
    // 内容を追加
    newRow.innerHTML = `
    <div class="input-fields add-row">
        <input type="time" class="default-start-reception-time">
        <p class="tilde">～</p>
        <input type="time" class="default-end-reception-time">
    </div>
    `;

    // 削除ボタンを生成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '×';
    deleteButton.className = 'remove-row-default-reception-time-button remove-row-button';
    
    // 削除ボタンにイベントリスナーを追加
    deleteButton.addEventListener('click', function() {
        // 削除処理など
        formContainer.removeChild(newRow);
    });

    // 行に削除ボタンを追加
    newRow.appendChild(deleteButton);

    // 追加ボタンが最後に来るように、追加ボタンの前に新しい行を挿入
    const addButton = formContainer.querySelector('#add-row-default-reception-time-button');
    formContainer.insertBefore(newRow, addButton.parentNode);

    return newRow;
}

export function addFormRowIndividualDayOfWeek() {
    const formContainer = document.querySelector('.individual-day-of-week');

    // 新しい行を生成
    const newRow = document.createElement('div');
    newRow.className = 'form-row-individual-day-of-week form-additional-row';
    
    // 内容を追加
    newRow.innerHTML = `
        <select class="individual-day-of-week-pulldown">
            <option value="1" selected>月</option>
            <option value="2">火</option>
            <option value="3">水</option>
            <option value="4">木</option>
            <option value="5">金</option>
            <option value="6">土</option>
            <option value="0">日</option>
        </select>
        <input type="time" class="individual-day-of-week-start-reception-time">
        <p class="tilde">～</p>
        <input type="time" class="individual-day-of-week-end-reception-time">
    `;

    // ここでイベントリスナーを追加する
    const pulldown = newRow.querySelector('.individual-day-of-week-pulldown');
    const startTimeInput = newRow.querySelector('.individual-day-of-week-start-reception-time');
    const endTimeInput = newRow.querySelector('.individual-day-of-week-end-reception-time');
    
    pulldown.addEventListener('change', function() {
        // selectの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    startTimeInput.addEventListener('change', function() {
        // 開始時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    endTimeInput.addEventListener('change', function() {
        // 終了時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    // 削除ボタンを生成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '×';
    deleteButton.className = 'remove-row-individual-day-of-week-button remove-row-button';
    
    // 削除ボタンにイベントリスナーを追加
    deleteButton.addEventListener('click', function() {
        // 削除処理など
        formContainer.removeChild(newRow);
    });

    // 行に削除ボタンを追加
    newRow.appendChild(deleteButton);

    // 追加ボタンが最後に来るように、追加ボタンの前に新しい行を挿入
    const addButton = formContainer.querySelector('#add-row-individual-day-of-week-button');
    formContainer.insertBefore(newRow, addButton.parentNode);

    return newRow;
}

export function addFormRowIndividualDate() {
    const formContainer = document.querySelector('.individual-date');

    // 新しい行を生成
    const newRow = document.createElement('div');
    newRow.className = 'form-row-individual-date form-additional-row';
    
    // 内容を追加
    newRow.innerHTML = `
        <input type="date" class="input-individual-date">
        <input type="time" class="individual-date-start-reception-time">
        <p class="tilde">～</p>
        <input type="time" class="individual-date-end-reception-time">
    `;

    // ここでイベントリスナーを追加する
    const dateInput = newRow.querySelector('.input-individual-date');
    const startTimeInput = newRow.querySelector('.individual-date-start-reception-time');
    const endTimeInput = newRow.querySelector('.individual-date-end-reception-time');
    
    dateInput.addEventListener('change', function() {
        // selectの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    startTimeInput.addEventListener('change', function() {
        // 開始時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    endTimeInput.addEventListener('change', function() {
        // 終了時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    // 削除ボタンを生成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '×';
    deleteButton.className = 'remove-row-individual-date-button remove-row-button';
    
    // 削除ボタンにイベントリスナーを追加
    deleteButton.addEventListener('click', function() {
        // 削除処理など
        formContainer.removeChild(newRow);
    });

    // 行に要素を追加
    newRow.appendChild(deleteButton);

    // 追加ボタンが最後に来るように、追加ボタンの前に新しい行を挿入
    const addButton = formContainer.querySelector('#add-row-individual-date-button');
    formContainer.insertBefore(newRow, addButton.parentNode);

    return newRow;
}

export function addFormRowIndividualExclusionDate() {
    const formContainer = document.querySelector('.individual-exclusion-date');

    // 新しい行を生成
    const newRow = document.createElement('div');
    newRow.className = 'form-row-individual-exclusion-date form-additional-row';

    // 内容を追加
    newRow.innerHTML = `
        <input type="date" class="input-individual-exclusion-date">
    `;

    // ここでイベントリスナーを追加する
    const dateInput = newRow.querySelector('.input-individual-exclusion-date');

    dateInput.addEventListener('change', function() {
        // 終了時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    // 削除ボタンを生成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '×';
    deleteButton.className = 'remove-row-individual-exclusion-date-button remove-row-button';
    
    // 削除ボタンにイベントリスナーを追加
    deleteButton.addEventListener('click', function() {
        // 削除処理など
        formContainer.removeChild(newRow);
    });

    // 行に要素を追加
    newRow.appendChild(deleteButton);

    // 追加ボタンが最後に来るように、追加ボタンの前に新しい行を挿入
    const addButton = formContainer.querySelector('#add-row-individual-exclusion-date-button');
    formContainer.insertBefore(newRow, addButton.parentNode);

    return newRow;
}

//値設定系
export function setEventTitle(eventTitle) {
    const form = document.querySelector('.form.event-title input');
    form.value = eventTitle;
}

export function setPeriodStartDate(startDate) {
    const form = document.getElementById('input-period-start-date')
    form.value = startDate;

    // 'change' イベントを手動で作成
    var event = new Event('change', {
        'bubbles': true,
        'cancelable': true
    });

    // イベントを input 要素にディスパッチ
    form.dispatchEvent(event);
}

export function setPeriodEndDate(endDate) {
    const form = document.getElementById('input-period-end-date')
    form.value = endDate;

    // 'change' イベントを手動で作成
    var event = new Event('change', {
        'bubbles': true,
        'cancelable': true
    });

    // イベントを input 要素にディスパッチ
    form.dispatchEvent(event);
}

export function setReservationSlotTime(reservationSlotTime) {
    const form = document.querySelector('.form.reservation-slot-time .input-fields input');
    form.value = reservationSlotTime;
}

export function setDayToggle(offDayTogglesStr) {
    const offDayToggles = offDayTogglesStr.split('');

    for (const offday of offDayToggles) {
        const dayToggle = document.getElementById('day-toggle-' + offday);
    
        var event = new Event('click', {
            'bubbles': true,
            'cancelable': true
        });
    
        // イベントを dayToggle 要素にディスパッチ
        dayToggle.dispatchEvent(event);
    }
}

export function setDefaultReceptionTime(receptionTimeData) {

    //一行目を設定
    const startTimeFirstRow = document.querySelector('.form.default-reception-time .input-fields .default-start-reception-time');
    const endTimeFirstRow = document.querySelector('.form.default-reception-time .input-fields .default-end-reception-time');
    
    startTimeFirstRow.value = receptionTimeData.filter(item => item.is_default_row === 1)[0].start_time;
    endTimeFirstRow.value = receptionTimeData.filter(item => item.is_default_row === 1)[0].end_time;

    //二行目以降を設定
    for (const receptionTime of receptionTimeData.filter(item => item.is_default_row === 0)) {
        const formRow  = addFormRowReceptionTime();

        formRow.querySelector('.default-start-reception-time').value = receptionTime.start_time;
        formRow.querySelector('.default-end-reception-time').value = receptionTime.end_time;
    }
}

export function setDowReceptionTimeRow(dowReceptionTimeData) {

    //一行目を設定
    const dpwPulldownFirstRow = document.querySelector('.form.individual-day-of-week .input-fields .individual-day-of-week-pulldown');
    const startTimeFirstRow = document.querySelector('.form.individual-day-of-week .input-fields .individual-day-of-week-start-reception-time');
    const endTimeFirstRow = document.querySelector('.form.individual-day-of-week .input-fields .individual-day-of-week-end-reception-time');
    
    dpwPulldownFirstRow.value = dowReceptionTimeData[0].day_of_week_id;
    startTimeFirstRow.value = dowReceptionTimeData[0].start_time;
    endTimeFirstRow.value = dowReceptionTimeData[0].end_time;

    //二行目以降を設定
    for (const dowReceptionTime of dowReceptionTimeData.slice(1)) {
        const formRow  = addFormRowIndividualDayOfWeek();
        
        formRow.querySelector('.individual-day-of-week-pulldown').value = dowReceptionTime.day_of_week_id;
        formRow.querySelector('.individual-day-of-week-start-reception-time').value = dowReceptionTime.start_time;
        formRow.querySelector('.individual-day-of-week-end-reception-time').value = dowReceptionTime.end_time;
    }
}

export function setDateReceptionTimeRow(dateReceptionTimeData) {

    //一行目を設定
    const dateFirstRow = document.querySelector('.form.individual-date .input-fields .input-individual-date');
    const startTimeFirstRow = document.querySelector('.form.individual-date .input-fields .individual-date-start-reception-time');
    const endTimeFirstRow = document.querySelector('.form.individual-date .input-fields .individual-date-end-reception-time');
    
    dateFirstRow.value = common.convertDBDateToYYYY-MM-DD(dateReceptionTimeData[0].date);
    startTimeFirstRow.value = dateReceptionTimeData[0].start_time;
    endTimeFirstRow.value = dateReceptionTimeData[0].end_time;
    
    //二行目以降を設定
    for (const dateReceptionTime of dateReceptionTimeData.slice(1)) {
        const formRow  = addFormRowIndividualDate();
        
        formRow.querySelector('.input-individual-date').value = common.convertDBDateToYYYY-MM-DD(dateReceptionTime.date);
        formRow.querySelector('.individual-date-start-reception-time').value = dateReceptionTime.start_time;
        formRow.querySelector('.individual-date-end-reception-time').value = dateReceptionTime.end_time;
    }
}

export function setExclusionDateRow(exclusionData) {

    //一行目を設定
    const dateFirstRow = document.querySelector('.form.individual-exclusion-date .input-fields .input-individual-exclusion-date');
    
    dateFirstRow.value = common.convertDBDateToYYYY-MM-DD(exclusionData[0].date);
    
    //二行目以降を設定
    for (const exclusionDate of exclusionData.slice(1)) {
        const formRow  = addFormRowIndividualExclusionDate();
        
        formRow.querySelector('.input-individual-exclusion-date').value = common.convertDBDateToYYYY-MM-DD(exclusionDate.date);
    }
}

//値取得系 
export function getEventTitle() {
    const form = document.querySelector('.form.event-title input');
    return form.value;
}

export function getPeriodStartDate() {
    const form = document.getElementById('input-period-start-date');
    return common.convertDBDateToYYYY-MM-DD(form.value);
}

export function getPeriodEndDate() {
    const form = document.getElementById('input-period-end-date')
    return common.convertDBDateToYYYY-MM-DD(form.value);
}

export function getReservationSlotTime() {
    const form = document.querySelector('.form.reservation-slot-time .input-fields input');
    return form.value;
}

export function getDayToggle() {

    let dayTogglesStr = '';

    for (let i = 0; i < 7; i++ ) {
        const dayToggle = document.getElementById('day-toggle-' + i);
        dayTogglesStr += dayToggle.classList.contains('day-toggle-off') ? '0' : '1';
    }

    console.log(dayTogglesStr)
    return dayTogglesStr;
}

export function getDefaultReceptionTime(eventId) {

    let defaultReceptionTimes = [];

    // .form.default-reception-time 内のすべての行をループする
    document.querySelectorAll('.form.default-reception-time .form-row-default-reception-time').forEach((row) => {

        // 行削除ボタンの行をスキップ
        if (row.classList.contains('only-add-button-row')) return;

        // 各行から開始時間と終了時間を取得
        const startTime = row.querySelector('.default-start-reception-time').value;
        const endTime = row.querySelector('.default-end-reception-time').value;
        const isDefaultRow = row.classList.contains('form-initial-row') ? 1 : 0;// 一行目はデフォルト行として登録

        // もし開始時間と終了時間が存在すれば配列に追加
        if (startTime && endTime) {
            defaultReceptionTimes.push({
                event_id: eventId,
                day_of_week_id: 7, // defaultReceptionTimeの曜日は全(7)で固定
                is_default_row: isDefaultRow, 
                start_time: startTime,
                end_time: endTime
            });
        }
    });

    return defaultReceptionTimes;
}

export function getDowReceptionTime(eventId) {

    let dowReceptionTimes = [];

    // .form.default-reception-time 内のすべての行をループする
    document.querySelectorAll('.form.individual-day-of-week .form-row-individual-day-of-week').forEach((row) => {

        // 行削除ボタンの行をスキップ
        if (row.classList.contains('only-add-button-row')) return;

        // 各行から開始時間と終了時間を取得
        const dowId = row.querySelector('.individual-day-of-week-pulldown').value
        const startTime = row.querySelector('.individual-day-of-week-start-reception-time').value;
        const endTime = row.querySelector('.individual-day-of-week-end-reception-time').value;
        const isDefaultRow = row.classList.contains('form-initial-row') ? 1 : 0;// 一行目はデフォルト行として登録

        // もし開始時間と終了時間が存在すれば配列に追加
        if (startTime && endTime) {
            dowReceptionTimes.push({
                event_id: eventId,
                day_of_week_id: dowId,
                is_default_row: isDefaultRow, 
                start_time: startTime,
                end_time: endTime
            });
        }
    });

    return dowReceptionTimes;
}

export function getDateReceptionTime(eventId) {

    let dateReceptionTimes = [];

    // .form.individual-date 内のすべての行をループする
    document.querySelectorAll('.form.individual-date .form-row-individual-date').forEach((row) => {

        // 行削除ボタンの行をスキップ
        if (row.classList.contains('only-add-button-row')) return;

        // 各行から開始時間と終了時間を取得
        const date = row.querySelector('.input-individual-date').value;
        const startTime = row.querySelector('.individual-date-start-reception-time').value;
        const endTime = row.querySelector('.individual-date-end-reception-time').value;

        // もし開始時間と終了時間が存在すれば配列に追加
        if (startTime && endTime) {
            dateReceptionTimes.push({
                event_id: eventId,
                date: date,
                start_time: startTime,
                end_time: endTime
            });
        }
    });

    return dateReceptionTimes;
}

export function getExclusionDate(eventId) {

    let exclusionDate = [];

    // .individual-exclusion-date 内のすべての行をループする
    document.querySelectorAll('.form.individual-exclusion-date .form-row-individual-exclusion-date').forEach((row) => {

        // 行削除ボタンの行をスキップ
        if (row.classList.contains('only-add-button-row')) return;

        // 各行から開始時間と終了時間を取得
        const date = row.querySelector('.input-individual-exclusion-date').value;

        // もし日付が存在すれば配列に追加
        if (date) {
            exclusionDate.push({
                event_id: eventId,
                date: date
            });
        }
    });

    return exclusionDate;
}