import * as common from '../../common.js';

var periodStartDate = 20240101;
var periodEndDate = 20241231;

//予約受付データ (すべての項目が考慮されたデータ)
var reservationData = [];

//実施時間 (期間と受付時間を紐づけたリスト ほかの項目が考慮される前のもとになるデータ)
//defaultReceptionTimeList["20240321"] = [["0900","0930"],["1630","1830"]]
var defaultReceptionTimeList = [];

//実施期間の日付ごとに曜日IDを紐づけたリスト
//defaultReceptionDayOfWeekIdList["20240321"] = ["4"] (木)
var defaultReceptionDayOfWeekIdList = [];


//実施曜日
//bool配列 dayOfWeek
//要素 0=日 1=月 ... 6=土
//valid=true invalid=false
var isValidDayOfWeekList = new Array(true, true, true, true, true, true, true);

export function setPropertyPeriodStartDate(inputPeriodStartDate) {
    periodStartDate = inputPeriodStartDate;
}

export function setPropertyPeriodEndDate(inputPeriodEndDate) {
    periodEndDate = inputPeriodEndDate;
}

export function setIsValidDayOfWeekList(dayOfWeekId, isValid) {
    isValidDayOfWeekList[dayOfWeekId] = isValid;
}

export function getIsValidDayOfWeekList(){
    return isValidDayOfWeekList;
}

//予約受付データを取得
//ほとんどの場合は「予約受付データを更新」とセットで使用するが、
//カレンダーを前月翌月に切り替えるときは「予約受付データを更新」は不要
export function getReservationData(){
    return reservationData;
}

//予約受付データを更新
export function updateReservationData(){

    //受付時間を再読み込み
    loadDefaultReceptionTime();
    
    //予約受付データを初期化
    reservationData = {};

    // 曜日リストを初期化
    defaultReceptionDayOfWeekIdList = {};

    //期間内の日付を返り値に生成し、
    //受付時間を返り値に設定
    for(let i = periodStartDate; i <= periodEndDate; i++){

        //無効な日付の場合は処理をスキップ
        const dayOfWeekId = common.getDayOfWeekOfDate(i.toString());
        if(dayOfWeekId == null) continue;

        // 日付キーで配列を初期化
        reservationData[i] = reservationData[i] || [];
        
        for(let defaultReceptionTime of defaultReceptionTimeList){
            // 各受付時間を日付の配列に追加
            reservationData[i].push(defaultReceptionTime);
        }

        defaultReceptionDayOfWeekIdList[i] = dayOfWeekId;
    }

    //実施曜日を反映
    for (const date in reservationData) {
        const dayOfWeekId = defaultReceptionDayOfWeekIdList[date];

        //実施曜日でない場合はその日のデータを削除
        if(!isValidDayOfWeekList[dayOfWeekId]){
            delete reservationData[date];
        }
    }

    //曜日別受付時間を反映
    const individualDayOfWeekReceptionTimeList = getIndividualDayOfWeekReceptionTimeList();

    //曜日別受付時間に存在する曜日の予約を予約受付データから削除する、日付は残す
    for(let i = 0; i < 7; i++){
        if(i in individualDayOfWeekReceptionTimeList && i in reservationData){
            reservationData[i] = [];
        }
    }

    //曜日別受付時間の予約を予約受付データに追加する
    for (const date in reservationData) {
        const dayOfWeekId = defaultReceptionDayOfWeekIdList[date];

        if(dayOfWeekId in individualDayOfWeekReceptionTimeList){
            reservationData[date] = individualDayOfWeekReceptionTimeList[dayOfWeekId];
        }
    }

    //特定指定日受付時間を反映
    const individualDateReceptionTimeList = getIndividualDateReceptionTimeList();

    for (const date in individualDateReceptionTimeList){
        if(date in reservationData){
            reservationData[date] = individualDateReceptionTimeList[date];
        }
    }

    //除外日を反映
    const individualExclusionDateListList = getIndividualExclusionDateListList();

    for (let i = 0; i < individualExclusionDateListList.length; i++){
        const individualExclusionDate = individualExclusionDateListList[i];
        delete reservationData[individualExclusionDate];
    }

    console.log("reservationData:" + reservationData);
}

// 受付時間リストを初期化して再読み込み
function loadDefaultReceptionTime(){
    //受付時間を再生成
    const rows = document.querySelectorAll('.form-row-default-reception-time');
    defaultReceptionTimeList = [];

    // 各行の要素をループ処理
    for (let row of rows) {
        // '.default-start-reception-time' と '.default-end-reception-time' のinput要素を探す
        const startTimeInput = row.querySelector('.default-start-reception-time');
        const endTimeInput = row.querySelector('.default-end-reception-time');

        // input要素のどちらかが見つからない場合は、この反復処理をスキップ
        if (!startTimeInput || !endTimeInput) {
            continue; // 次のループの反復処理へ
        }

        // input要素から時間を取得し、times配列に追加
        const startTime = startTimeInput.value ? startTimeInput.value.replace(/:/g, "") : "0000";
        const endTime = endTimeInput.value ? endTimeInput.value.replace(/:/g, "") : "2359";
        defaultReceptionTimeList.push({ start: startTime, end: endTime });
    }
}

// 曜日別受付時間リストを取得 曜日IDと受付時間を紐づけたリスト
// individualDayOfWeekReceptionTimeList["0"] = [["0900","0930"],["1630","1830"]]
function getIndividualDayOfWeekReceptionTimeList(){
    //曜日別受付時間リストを生成
    const rows = document.querySelectorAll('.form-row-individual-day-of-week');
    const individualDayOfWeekReceptionTimeList = {};

    // 各行の要素をループ処理
    for (let row of rows) {
        const dayOfWeekIdInput = row.querySelector('.individual-day-of-week-pulldown');
        const startTimeInput = row.querySelector('.individual-day-of-week-start-reception-time');
        const endTimeInput = row.querySelector('.individual-day-of-week-end-reception-time');

        // input要素のどちらかが見つからない場合は、この反復処理をスキップ
        if (!dayOfWeekIdInput || !startTimeInput || !endTimeInput) {
            continue; // 次のループの反復処理へ
        }

        // input要素から時間を取得し、times配列に追加
        const dayOfWeekId = dayOfWeekIdInput.value;
        const startTime = startTimeInput.value.replace(/:/g, "");
        const endTime = endTimeInput.value.replace(/:/g, "");

        // 未入力の項目があればこの処理をスキップ
        if (!dayOfWeekId || !startTime || !endTime) {
            continue; // 次のループの反復処理へ
        }

        // dayOfWeekIdのキーで配列がなければ作成
        individualDayOfWeekReceptionTimeList[dayOfWeekId] = individualDayOfWeekReceptionTimeList[dayOfWeekId] || [];

        individualDayOfWeekReceptionTimeList[dayOfWeekId].push({ start: startTime, end: endTime });
    }

    return individualDayOfWeekReceptionTimeList;
}

// 特定指定日受付時間リストを取得 日付と受付時間を紐づけたリスト
// individualDateReceptionTimeList["20240323"] = [["0900","0930"],["1630","1830"]]
function getIndividualDateReceptionTimeList(){
    //曜日別受付時間リストを生成
    const rows = document.querySelectorAll('.form-row-individual-date');
    const individualDateReceptionTimeList = {};

    // 各行の要素をループ処理
    for (let row of rows) {
        const individualDateInput = row.querySelector('.input-individual-date');
        const startTimeInput = row.querySelector('.individual-date-start-reception-time');
        const endTimeInput = row.querySelector('.individual-date-end-reception-time');

        // input要素のどちらかが見つからない場合は、この反復処理をスキップ
        if (!individualDateInput || !startTimeInput || !endTimeInput) {
            continue; // 次のループの反復処理へ
        }

        // input要素から時間を取得し、times配列に追加
        const individualDate = individualDateInput.value.replace(/-/g, "");
        const startTime = startTimeInput.value.replace(/:/g, "");
        const endTime = endTimeInput.value.replace(/:/g, "");

        // 未入力の項目があればこの処理をスキップ
        if (!individualDate || !startTime || !endTime) {
            continue; // 次のループの反復処理へ
        }
        
        // dayOfWeekIdのキーで配列がなければ作成
        individualDateReceptionTimeList[individualDate] = individualDateReceptionTimeList[individualDate] || [];

        individualDateReceptionTimeList[individualDate].push({ start: startTime, end: endTime });
    }

    return individualDateReceptionTimeList;
}

// 除外日リストを取得
// individualExclusionDateList = ["20240323","20240328"]
function getIndividualExclusionDateListList(){
    //除外日リストを生成
    const rows = document.querySelectorAll('.form-row-individual-exclusion-date');
    const individualExclusionDateList = [];

    // 各行の要素をループ処理
    for (let row of rows) {
        const individualExclusionDateInput = row.querySelector('.input-individual-exclusion-date');

        // input要素が見つからない場合は、この反復処理をスキップ
        if (!individualExclusionDateInput) {
            continue; // 次のループの反復処理へ
        }

        // input要素から時間を取得し、times配列に追加
        const individualExclusionDate = individualExclusionDateInput.value.replace(/-/g, "");

        // 未入力の項目があればこの処理をスキップ
        if (!individualExclusionDate) {
            continue; // 次のループの反復処理へ
        }
        
        // 入力された除外日が重複してデータに入るのを防ぐ
        if (!individualExclusionDateList.includes(individualExclusionDate)) {
            individualExclusionDateList.push(individualExclusionDate);
        }
    }

    return individualExclusionDateList;
}

//予約受付データを設定 (予約画面用)
export function setReservationDataForReservation(data){

    //予約受付データを初期化
    reservationData = {};

    // 曜日リストを初期化
    defaultReceptionDayOfWeekIdList = {};
    
    let eventData = data.eventData[0];
    let defaultReceptionTimeData = data.dowData.filter(item => item.day_of_week_id === 7);
    let dowReceptionTimeData = data.dowData.filter(item => item.day_of_week_id != 7);
    let dateData = data.dateData;
    let exclusionData = data.exclusionData;

    setPropertyPeriodStartDate(common.convertDBDateToYYYYMMDDCompact(eventData.start_date));
    setPropertyPeriodEndDate(common.convertDBDateToYYYYMMDDCompact(eventData.end_date));

    for (let i = 0; i < 7; i++){
        setIsValidDayOfWeekList(i, !eventData.off_day_toggles.includes(i.toString()));
    }

    //defaultReceptionTimeListを設定
    setDefaultReceptionTimeForReservation(defaultReceptionTimeData);

    //受付時間を設定
    for(let i = periodStartDate; i <= periodEndDate; i++){

        //無効な日付の場合は処理をスキップ
        const dayOfWeekId = common.getDayOfWeekOfDate(i.toString());
        if(dayOfWeekId == null) continue;

        // 日付キーで配列を初期化
        reservationData[i] = reservationData[i] || [];
        
        for(let defaultReceptionTime of defaultReceptionTimeList){
            // 各受付時間を日付の配列に追加
            reservationData[i].push(defaultReceptionTime);
        }

        defaultReceptionDayOfWeekIdList[i] = dayOfWeekId;
    }

    //実施曜日を反映
    for (const date in reservationData) {
        const dayOfWeekId = defaultReceptionDayOfWeekIdList[date];

        //実施曜日でない場合はその日のデータを削除
        if(!isValidDayOfWeekList[dayOfWeekId]){
            delete reservationData[date];
        }
    }

    //曜日別受付時間を反映
    // individualDayOfWeekReceptionTimeList["0"] = [["0900","0930"],["1630","1830"]]
    let individualDayOfWeekReceptionTimeList = {};

    for (let dowReceptionTime of dowReceptionTimeData){
        const dayOfWeekId = dowReceptionTime.day_of_week_id;
        const startTime = common.convertDBTimeToHHMM(dowReceptionTime.start_time);
        const endTime = common.convertDBTimeToHHMM(dowReceptionTime.end_time);

        // dayOfWeekIdのキーで配列がなければ作成
        individualDayOfWeekReceptionTimeList[dayOfWeekId] 
            = individualDayOfWeekReceptionTimeList[dayOfWeekId] || [];

        individualDayOfWeekReceptionTimeList[dayOfWeekId]
            .push({ start: startTime, end: endTime });
    }

    //曜日別受付時間に存在する曜日の予約を予約受付データから削除する、日付は残す
    for (let dayOfWeekId = 0; dayOfWeekId < 7; dayOfWeekId++) {

        // dayOfWeekIdがindividualDayOfWeekReceptionTimeListに含まれるかチェック
        if (dayOfWeekId in individualDayOfWeekReceptionTimeList) {
            // defaultReceptionDayOfWeekIdListのキーを取得
            const matchingDates = Object.keys(defaultReceptionDayOfWeekIdList).filter(date => defaultReceptionDayOfWeekIdList[date] === dayOfWeekId);
            
            // 取得した日付に対して処理を行う
            matchingDates.forEach(date => {
                reservationData[date] = [];
            });
        }
    }

    //曜日別受付時間の予約を予約受付データに追加する
    for (const date in reservationData) {
        const dayOfWeekId = defaultReceptionDayOfWeekIdList[date];

        if(dayOfWeekId in individualDayOfWeekReceptionTimeList){
            reservationData[date] = individualDayOfWeekReceptionTimeList[dayOfWeekId];
        }
    }

    // //特定指定日受付時間を反映
    // individualDateReceptionTimeList["20240323"] = [["0900","0930"],["1630","1830"]]
    const individualDateReceptionTimeList = {};

    for (let dateReceptionTime of dateData){
        const date = common.convertDBDateToYYYYMMDDCompact(dateReceptionTime.date);
        const startTime = common.convertDBTimeToHHMM(dateReceptionTime.start_time);
        const endTime = common.convertDBTimeToHHMM(dateReceptionTime.end_time);

        // dateのキーで配列がなければ作成
        individualDateReceptionTimeList[date] 
            = individualDateReceptionTimeList[date] || [];

        individualDateReceptionTimeList[date]
            .push({ start: startTime, end: endTime });
    }

    for (const date in individualDateReceptionTimeList){
        if(date in reservationData){
            reservationData[date] = individualDateReceptionTimeList[date];
        }
    }

    // //除外日を反映
    // individualExclusionDateList = ["20240323","20240328"]
    const individualExclusionDateListList = [...new Set(exclusionData.map(item => common.convertDBDateToYYYYMMDDCompact(item.date)))];

    
    console.log("individualExclusionDateListList:" + JSON.stringify(individualExclusionDateListList));

    for (let i = 0; i < individualExclusionDateListList.length; i++){
        const individualExclusionDate = individualExclusionDateListList[i];
        delete reservationData[individualExclusionDate];
    }

    console.log("reservationData:" + JSON.stringify(reservationData));
}

// 受付時間を設定 (予約画面用)
function setDefaultReceptionTimeForReservation(defaultReceptionTimeData){
    //受付時間を再生成
    const rows = defaultReceptionTimeData;
    defaultReceptionTimeList = [];

    // 各行の要素をループ処理
    for (let row of rows) {
        // input要素から時間を取得し、times配列に追加
        const startTime = common.convertDBTimeToHHMM(row.start_time);
        const endTime = common.convertDBTimeToHHMM(row.end_time);
        defaultReceptionTimeList.push({ start: startTime, end: endTime });
    }
}