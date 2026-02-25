export type Locale = 'uk' | 'en';

const en = {
  // screen titles
  titleHome: 'Air Raid Alert',
  titleState: 'Air Raid State',
  titlePrediction: 'Air Raid Prediction',
  titleInfo: 'Additional Information',

  // errors / snackbar
  errorLocationDenied: 'Location access denied',
  errorLocationFailed: 'Failed to fetch location',
  errorGeneric: 'An error occurred. Please try again later.',

  // index / OutsideUkraineMessage
  outsideUkraine:
    'You appear to be outside Ukraine. However, you can still check the current air raid alert status below.',
  getAlertState: 'Get Air Alert State',

  // AdditionalInfoSection
  moreInfoPrompt: 'For more detailed information, click the button below',
  additionalInfo: 'Additional Information',

  // air-raid-state
  chooseRegion: 'Choose your region',
  selectRegionPlaceholder: 'Please select region',
  getState: 'Get the state',
  predict: 'Predict',
  alertActive: (region: string) =>
    `There is an existing alert in ${region}, be careful`,
  alertPartial: (region: string) =>
    `There is partial alert in ${region}, it is better to stay at home today`,
  alertNone: (region: string) =>
    `Currently there is no existing alert in ${region}`,

  // UkraineAlertStatus
  regionLabel: 'Region:',
  statusAlert: 'Air alert is active in your region!',
  statusSafe: 'No active alerts in your region.',

  // air-raid-prediction
  predictionFor: 'Prediction for',
  probabilityLabel: 'Probability of Air Raid Alert:',
  predictionHigh: 'High risk — active alert or frequent history',
  predictionMedium: 'Moderate risk — multiple alerts per day historically',
  predictionLow: 'Low risk — rare alerts in this region',

  // additional-information
  infoTitle: 'Air Raid Risk Insight',
  infoBody1:
    'This app helps users assess the current level of danger in specific regions based on official alert data.',
  infoBody2:
    'For a complete overview of alerts across all regions and sources, visit',
  infoLink: 'this page',
};

const uk: typeof en = {
  titleHome: 'Повітряна тривога',
  titleState: 'Стан тривоги',
  titlePrediction: 'Прогноз тривоги',
  titleInfo: 'Додаткова інформація',

  errorLocationDenied: 'Доступ до геолокації заборонено',
  errorLocationFailed: 'Не вдалося визначити місцезнаходження',
  errorGeneric: 'Сталася помилка. Будь ласка, спробуйте пізніше.',

  outsideUkraine:
    'Схоже, ви знаходитесь за межами України. Однак ви можете перевірити поточний стан повітряної тривоги нижче.',
  getAlertState: 'Перевірити стан тривоги',

  moreInfoPrompt: 'Для детальнішої інформації натисніть кнопку нижче',
  additionalInfo: 'Додаткова інформація',

  chooseRegion: 'Оберіть ваш регіон',
  selectRegionPlaceholder: 'Будь ласка, оберіть регіон',
  getState: 'Дізнатися стан',
  predict: 'Прогноз',
  alertActive: (region: string) =>
    `У регіоні ${region} оголошено тривогу, будьте обережні`,
  alertPartial: (region: string) =>
    `У регіоні ${region} часткова тривога, краще залишитися вдома`,
  alertNone: (region: string) =>
    `На даний момент тривоги в регіоні ${region} немає`,

  regionLabel: 'Регіон:',
  statusAlert: 'У вашому регіоні оголошено повітряну тривогу!',
  statusSafe: 'Активних тривог у вашому регіоні немає.',

  predictionFor: 'Прогноз для',
  probabilityLabel: 'Ймовірність повітряної тривоги:',
  predictionHigh: 'Високий ризик — активна тривога або часта історія',
  predictionMedium: 'Помірний ризик — кілька тривог на день в історії',
  predictionLow: 'Низький ризик — рідкісні тривоги в цьому регіоні',

  infoTitle: 'Аналіз ризику повітряної тривоги',
  infoBody1:
    'Цей додаток допомагає користувачам оцінити поточний рівень небезпеки в певних регіонах на основі офіційних даних про тривоги.',
  infoBody2:
    'Для повного огляду тривог по всіх регіонах і джерелах відвідайте',
  infoLink: 'цю сторінку',
};

export const translations: Record<Locale, typeof en> = { en, uk };
