
import * as reservationDataController from './admin/eventMake/reservationData.js';
import * as common from './common.js';
import * as constants from './constants.js';

//プレビューカレンダーの表示に使用する変数
var targetDate = new Date();

//予約リストを保持する変数
//プレビューカレンダーの通知に設定する用
var reservedData;

//最後にクリックしたセルの日付を保持
var clickingCellId;

//カレンダーセルをクリックしたときのコールバック関数
var handleCellClick;

//カレンダーセルをホバーしたときのコールバック関数
var handleCellMouseover;
var handleCellMouseout;

export function createCalendar(){
    const weeks = constants.weeks
    const date = targetDate
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
    const endDate = new Date(year, month,  0) // 月の最後の日を取得
    const endDayCount = endDate.getDate() // 月の末日
    const lastMonthEndDate = new Date(year, month - 1, 0) // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate() // 前月の末日
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1); // 来月の初日を設定
    const startDay = startDate.getDay() // 月の最初の日の曜日を取得
    let dayCount = 1 // 日にちのカウント
    let calendarHtml = '' // HTMLを組み立てる変数

    //カレンダーの年月を更新
    document.getElementById('preview-calendat-year-label').textContent = year;
    document.getElementById('preview-calendat-month-label').textContent = month + '月';

    calendarHtml += '<table>'
    calendarHtml += '<tr class="calendar-header">'

    // 曜日の行を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += '<th>' + weeks[i] + '</th>'
    }

    calendarHtml += '</tr>'

    const lastMonth_YYYYMM = lastMonthEndDate.getFullYear() + (lastMonthEndDate.getMonth() + 1).toString().padStart( 2, '0');
    const thisMonth_YYYYMM = date.getFullYear() + (date.getMonth() + 1).toString().padStart( 2, '0');
    const nextMonth_YYYYMM = nextMonth.getFullYear() + (nextMonth.getMonth() + 1).toString().padStart( 2, '0');

    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr class="calendar-cells">'

        for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1
                const id = lastMonth_YYYYMM + num .toString().padStart( 2, '0'); 
                
                calendarHtml += '<td id="' + id + '" class="calendar-cell"><div class="notification-badge no-notification"></div>' + num + '</td>'
                lastMonthEndDate.setDate(lastMonthEndDate.getDate() - 1)
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount
                const id = nextMonth_YYYYMM + num .toString().padStart( 2, '0'); 

                calendarHtml += '<td id="' + id + '" class="calendar-cell"><div class="notification-badge no-notification"></div>' + num + '</td>'
                dayCount++
            } else {
                const id = thisMonth_YYYYMM + dayCount .toString().padStart( 2, '0'); 
                calendarHtml += '<td id="' + id + '" class="calendar-cell"><div class="notification-badge no-notification"></div>' + dayCount + '</td>'
                dayCount++
            }
        }
        calendarHtml += '</tr>'

        if (dayCount > endDayCount){
            break;
        }
    }
    calendarHtml += '</table>'

    document.querySelector('#calendar').innerHTML = calendarHtml

    setNotificationBadge();
    if(clickingCellId) clickCell(clickingCellId);
}

//プレビューカレンダーのヘッダーの曜日の有効、無効を設定する
//要素 0=日 1=月 ... 6=土
//valid=true invalid=false
export function setPreviewCalendarHeaderDayOfWeek(dayOfWeek){
    const calendarHeaders = document.querySelector('.calendar-header').querySelectorAll('th');

    for(var i = 0; i < dayOfWeek.length; i++) {
        if (dayOfWeek[i]) {
            calendarHeaders[i].classList.remove('is-invalid');
        }else{
            calendarHeaders[i].classList.add('is-invalid');
        }
    }
}

export function showPrevMonth(){
    targetDate = new Date(targetDate.getFullYear(), targetDate.getMonth() - 1, 1); // 前月の初日を設定
    createCalendar();

    //プレビューカレンダーを表示 予約データは変わらないため更新は不要
    updatePreviewCalendar();
}

export function showNextMonth(){
    targetDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1); // 次月の初日を設定
    createCalendar();

    //プレビューカレンダーを表示 予約データは変わらないため更新は不要
    updatePreviewCalendar();
}

export function updatePreviewCalendar(){

    const reservationData = reservationDataController.getReservationData();

    //曜日の有効、無効を設定
    setPreviewCalendarHeaderDayOfWeek(reservationDataController.getIsValidDayOfWeekList());

    //予約データがないとき(画面に来てすぐにカレンダーの翌月前月を切り替えた時) 以降の処理をしない
    if(reservationData.length == 0) return;

    // "calendar-cells"クラスを持つ全ての要素を取得
    const calendarCells = document.querySelectorAll('.calendar-cells');

    // 各"calendar-cells"要素に対する処理
    calendarCells.forEach((calendarCell) => {
        // 各子要素の<td>に対する処理
        const tdElements = calendarCell.querySelectorAll('td');
        tdElements.forEach((td) => {
            // 日付がに存在したらis-invalidを付与
            if (parseInt(td.id) in reservationData) {
                td.classList.remove('is-invalid');
            }else{
                td.classList.add('is-invalid');
            }
        });
    });
    
    if(handleCellClick) clickCalendarCell(handleCellClick);
    if(handleCellMouseover && handleCellMouseout) hoverCalendarCell(handleCellMouseover,handleCellMouseout);
}

export function setReservedData(settingReservedData){
    reservedData = settingReservedData;
}

export function setNotificationBadge(){

    if(!reservedData) return;

    // "calendar-cells"クラスを持つ全ての要素を取得
    const calendarCells = document.querySelectorAll('.calendar-cells');

    // 各"calendar-cells"要素に対する処理
    calendarCells.forEach((calendarCell) => {
        // 各子要素の<td>に対する処理
        const tdElements = calendarCell.querySelectorAll('td');
        tdElements.forEach((td) => {
            const badgeElement = td.querySelector('.notification-badge');
            const reservedAtId = common.filterReservationsByDate(reservedData, td.id);

            badgeElement.textContent = reservedAtId.length;

            if(reservedAtId.length === 0){
                if(!badgeElement.classList.contains('no-notification')){
                    badgeElement.classList.add('no-notification');
                };
            }else {
                badgeElement.textContent = reservedAtId.length;
                badgeElement.classList.remove('no-notification');
            }
        });
    });
}

// セルの状態を変化させる
export function clickCell(cellId){
    clickingCellId = cellId;

    document.querySelectorAll('.calendar-cell').forEach(function(cell) {
        cell.classList.remove('is-clicking');
    });

    const cell = document.getElementById(cellId);
    if (cell) {
        cell.classList.add('is-clicking');
    }
}

export function mouseoverCell(cellId) {
    const cell = document.getElementById(cellId);
    if (cell) {
        cell.classList.add('is-hovered');
    }
}

export function mouseoutCell(cellId) {
    const cell = document.getElementById(cellId);
    if (cell) {
        cell.classList.remove('is-hovered');
    }
}

//イベントリスナー設定
export function clickPrevMonthButton(){
    document.querySelector('.previous-month-button').addEventListener('click', function() {
        showPrevMonth();
    });
}

export function clickNextMonthButton(){
    document.querySelector('.next-month-button').addEventListener('click', function() {
        showNextMonth();
    });
}

//イベントハンドラー設定
export function setHandleCellClick(callback){
    handleCellClick = callback;
}

export function clickCalendarCell(callback){
    document.querySelectorAll('.calendar-cell').forEach(function(cell) {
        // cellにis-invalidクラスがない場合のみイベントリスナーを追加する
        if (!cell.classList.contains('is-invalid')) {
            cell.addEventListener('click', function() {
                callback(cell.id);  // コールバック関数を呼び出し、cellのidを渡す
            });
        }
    });
}

export function setHandleCellHover(mouseoverCallback,mouseoutCallback){
    handleCellMouseover = mouseoverCallback;
    handleCellMouseout = mouseoutCallback;
}

export function hoverCalendarCell(mouseoverCallback,mouseoutCallback){
    document.querySelectorAll('.calendar-cell').forEach(function(cell) {
        if (!cell.classList.contains('is-invalid')) {
            cell.addEventListener('mouseover', function() {
                mouseoverCallback(cell.id);  // コールバック関数を呼び出し、cellのidを渡す
            });
        }
    });

    document.querySelectorAll('.calendar-cell').forEach(function(cell) {
        if (!cell.classList.contains('is-invalid')) {
            cell.addEventListener('mouseout', function() {
                mouseoutCallback(cell.id);  // コールバック関数を呼び出し、cellのidを渡す
            });
        }
    });
}
