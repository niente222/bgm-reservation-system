

//エラーメッセージ
export const createErrorMessageInputEmpty = () => `必須項目です`;
export const createErrorMessageWithoutLengthRange = (maxLength, minLength=1) => `${maxLength}文字以上、${minLength}文字以内で入力してください`;
export const createErrorMessageInvalidDateFormat = () => `入力された日付は無効です`;
export const createErrorMessageEndDateBeforeStartDate = () => `終了日は開始日よりも後の日付を入力してください`;
export const createErrorMessageInvalidNumberFormat = () => `数値を入力してください`;
export const createErrorMessageOutsideRange = (max, min) => `${max}以上、${min}以内で入力してください`;
export const createErrorMessageInvalidTimeFormat = () => `入力された時間は無効です`;
export const createErrorMessageEndTimeBeforeStartTime = () => `終了時間は開始時間よりも後の時間を入力してください`;
export const createErrorMessageInvalidDayOfWeekId = () => `入力された曜日は無効です`;