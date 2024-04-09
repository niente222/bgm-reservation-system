
// 曜日
export const weeks = ['日', '月', '火', '水', '木', '金', '土']

//URL
export const originURL = 'http://162.43.27.122:3000';

//エラーメッセージ
export const createErrorMessageInputEmpty = () => `必須項目です`;
export const createErrorMessageWithoutLengthRange = (maxLength, minLength=1) => `${maxLength}文字以上、${minLength}文字以内で入力してください`;
export const createErrorMessageDuplication = (input) => `「${input}」は既に登録されています`;
export const createErrorMessageInvalidDateFormat = () => `入力された日付は無効です`;
export const createErrorMessageEndDateBeforeStartDate = () => `終了日は開始日よりも後の日付を入力してください`;
export const createErrorMessageInvalidNumberFormat = () => `数値を入力してください`;
export const createErrorMessageOutsideRange = (max, min) => `${min}以上、${max}以内で入力してください`;
export const createErrorMessageInvalidTimeFormat = () => `入力された時間は無効です`;
export const createErrorMessageEndTimeBeforeStartTime = () => `終了時間は開始時間よりも後の時間を入力してください`;
export const createErrorMessageInvalidDayOfWeekId = () => `入力された曜日は無効です`;
export const createErrorMessageExclusion = () => `先に登録されてしまいました`;