

// 未入力チェック
// return true 未入力
export function isInputEmpty(input){
    return input.trim() === '';
}

// 文字数チェック
// return true 文字数が指定範囲外
export function isWithoutLengthRange(input ,maxLength, minLength=1){
    return input.length < minLength || input.length > maxLength;
}

// 重複チェック
// return true 重複あり
export function isDuplication(){

}

// 日付フォーマットチェック
// return true 入力値がyyyy-mm-ddの形になっていない
export function isInvalidDateFormat(input) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return !regex.test(input);
}

// 日付論理チェック
// return true 終了日が開始日よりも前の日付になっている
export function isEndDateBeforeStartDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return end < start;
}

// 数値フォーマットチェック
// return true 入力値が数値になっていない
export function isInvalidNumberFormat(input) {
    // parseFloat を使用して数値に変換を試み、元の入力と比較します
    // isNaNを使って数値かどうかを判断します
    return isNaN(parseFloat(input)) || input.toString().trim() !== parseFloat(input).toString();
}

// 数値範囲チェック
// return true 数値が指定範囲外
export function isOutsideRange(input, max, min) {
    const number = parseFloat(input);
    return number <= min || number > max;
}

// 時間フォーマットチェック
// return true 入力値がhh:mmの形になっていない
export function isInvalidTimeFormat(input) {
    const regex = /^\d{2}:\d{2}$/;
    return !regex.test(input);
}

// 時間論理チェック
// return true 終了時間が開始時間よりも前の時価になっている
export function isEndTimeBeforeStartTime(startTime, endTime) {
    // HH:mm 形式の時刻を分に変換する関数
    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    return endMinutes < startMinutes;
}

export function removeErrorMessageToForm(form){
    // フォームの中身を空にする
    form.innerHTML = '';
}

export function addErrorMessageToForm(form,errorMessageList){
    // フォームの中身を空にする
    form.innerHTML = '';

    // エラーメッセージのリストを作成
    const errorListHtml = errorMessageList.map(message => `<li>${message}</li>`).join('');

    // リストを含むHTMLを作成
    const errorHtml = `<ul class="error-messages">${errorListHtml}</ul>`;

    // フォームにエラーメッセージを追加
    form.innerHTML += errorHtml;
}

// 日付Idチェック
// return true 0～6の数値ではない
export function isInvalidDowId(input) {
    const dayId = Number(input);
    return !(Number.isInteger(dayId) && dayId >= 0 && dayId <= 6);
}