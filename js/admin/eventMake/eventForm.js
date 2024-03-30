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

export function setWodReceptionTimeRow(dowReceptionTimeData) {

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
    
    dateFirstRow.value = common.convertDBDateToYYYYMMDD(dateReceptionTimeData[0].date);
    startTimeFirstRow.value = dateReceptionTimeData[0].start_time;
    endTimeFirstRow.value = dateReceptionTimeData[0].end_time;
    
    //二行目以降を設定
    for (const dateReceptionTime of dateReceptionTimeData.slice(1)) {
        const formRow  = addFormRowIndividualDate();
        
        formRow.querySelector('.input-individual-date').value = common.convertDBDateToYYYYMMDD(dateReceptionTime.date);
        formRow.querySelector('.individual-date-start-reception-time').value = dateReceptionTime.start_time;
        formRow.querySelector('.individual-date-end-reception-time').value = dateReceptionTime.end_time;
    }
}

export function setExclusionDateRow(exclusionData) {

    //一行目を設定
    const dateFirstRow = document.querySelector('.form.individual-exclusion-date .input-fields .input-individual-exclusion-date');
    
    dateFirstRow.value = common.convertDBDateToYYYYMMDD(exclusionData[0].date);
    
    //二行目以降を設定
    for (const exclusionDate of exclusionData.slice(1)) {
        const formRow  = addFormRowIndividualExclusionDate();
        
        formRow.querySelector('.input-individual-exclusion-date').value = common.convertDBDateToYYYYMMDD(exclusionDate.date);
    }
}