/** Anketa formasining brauzerdagi holati (barcha maydonlar birga) */
export interface FormState {
  // 1-qadam
  firstName: string;
  lastName: string;
  gender: string;
  mahalla: string;
  school: string;
  grade: number | '';
  phone: string;
  parentPhone: string;
  region: string;
  district: string;
  // 2-qadam
  favoriteSubjects: string[];
  clubs: string[];
  /** «Hech qaysi» tanlanganda majburiy */
  barriers: string[];
  // 3-qadam (faqat 10-11-sinf)
  dreamJob: string;
  jobCategory: string;
  // 4-qadam — ta'lim markazi
  wantedCourses: string[];
  wantedLanguages: string[];
  travelWillingness: string;
  availableTimes: string[];
  homeTech: string;
  // 5-qadam
  consent: boolean;
}

/** Bo'sh forma — kiosk rejimida har bir yangi o'quvchi uchun boshlang'ich holat */
export const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  gender: '',
  mahalla: '',
  school: '',
  grade: '',
  phone: '',
  parentPhone: '',
  region: 'Navoiy',
  district: 'Xatirchi',
  favoriteSubjects: [],
  clubs: [],
  barriers: [],
  dreamJob: '',
  jobCategory: '',
  wantedCourses: [],
  wantedLanguages: [],
  travelWillingness: '',
  availableTimes: [],
  homeTech: '',
  consent: false,
};
