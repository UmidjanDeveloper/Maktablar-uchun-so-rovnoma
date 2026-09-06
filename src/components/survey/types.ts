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
  // 3-qadam
  dreamJob: string;
  jobCategory: string;
  motivation: string;
  // 4-qadam — ta'lim markazi
  wantedCourses: string[];
  wantedLanguages: string[];
  travelWillingness: string;
  barriers: string[];
  availableTimes: string[];
  homeTech: string;
  // 5-qadam
  inspiration: string;
  studyAbroad: string;
  futureContribution: string;
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
  dreamJob: '',
  jobCategory: '',
  motivation: '',
  wantedCourses: [],
  wantedLanguages: [],
  travelWillingness: '',
  barriers: [],
  availableTimes: [],
  homeTech: '',
  inspiration: '',
  studyAbroad: '',
  futureContribution: '',
  consent: false,
};
