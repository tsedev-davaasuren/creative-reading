export interface StudentInfo {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  studentCode: string;
}

// Багш нарын зөвшөөрөгдсөн хаягууд
export const ALLOWED_TEACHERS = [
  "tsendao.teacher@moes.edu.mn",
  "teacher@moes.edu.mn"
];

// 9Е ангийн 20 сурагчийн мэдээлэл
export const ALLOWED_STUDENTS: StudentInfo[] = [
  { id: 1, studentCode: "BHP02123060201", lastName: "Хүрэлбаатар", firstName: "Алтанцэцэг", email: "altantsetseg4dgx@moes.edu.mn" },
  { id: 2, studentCode: "BHP02123060179", lastName: "Өнөржаргал", firstName: "Амин-Эрдэнэ", email: "amin-erdene4w4o@moes.edu.mn" },
  { id: 3, studentCode: "BHP02123060099", lastName: "Ууганбаяр", firstName: "Анар", email: "anar58s7@moes.edu.mn" },
  { id: 4, studentCode: "BHP02124070020", lastName: "Амарбаяр", firstName: "Бадамлянхуа", email: "badamlyankhua83r9@moes.edu.mn" },
  { id: 5, studentCode: "BHP02125070004", lastName: "Бат-Эрдэнэ", firstName: "Баялаг-Эрдэнэ", email: "bayalag-erdene12ve@moes.edu.mn" },
  { id: 6, studentCode: "BHP02123060200", lastName: "Баатар", firstName: "Баярчимэг", email: "bayarchimeg4jmt@moes.edu.mn" },
  { id: 7, studentCode: "BHP02123060195", lastName: "Энхболд", firstName: "Билэгмаа", email: "bilegmaa53u0@moes.edu.mn" },
  { id: 8, studentCode: "BHP02123060208", lastName: "Түмэн-Өлзий", firstName: "Билэгсайхан", email: "bilegsaikhan7gr6@moes.edu.mn" },
  { id: 9, studentCode: "BHP02123060202", lastName: "Ууганшарав", firstName: "Буянбилэг", email: "buyanbileg2nw5@moes.edu.mn" },
  { id: 10, studentCode: "BHP02123060188", lastName: "Мөнхжавхлан", firstName: "Дөлгөөн", email: "dulguun83o3@moes.edu.mn" },
  { id: 11, studentCode: "BHP02125080029", lastName: "Ганбат", firstName: "Золцацрал", email: "zoltsatsral3kto@moes.edu.mn" },
  { id: 12, studentCode: "BHP02123060182", lastName: "Амгаланбаяр", firstName: "Номин-Эрдэнэ", email: "nomin-erdene7nq2@moes.edu.mn" },
  { id: 13, studentCode: "BHP02123060199", lastName: "Бадрах-Өлзий", firstName: "Номунхишиг", email: "nomunkhishig839g@moes.edu.mn" },
  { id: 14, studentCode: "BHP02123060187", lastName: "Мөнх-Эрдэнэ", firstName: "Тэмүүлэн", email: "temuulen3949@moes.edu.mn" },
  { id: 15, studentCode: "BHP02123060205", lastName: "Баатархүү", firstName: "Ууганбаяр", email: "uuganbayar6f2x@moes.edu.mn" },
  { id: 16, studentCode: "BHP02124070022", lastName: "Ганбаатар", firstName: "Хашчулуун", email: "khashchuluun10zi@moes.edu.mn" },
  { id: 17, studentCode: "BHP02125080024", lastName: "Лхагвадорж", firstName: "Хишигбуян", email: "khishigbuyan87th@moes.edu.mn" },
  { id: 18, studentCode: "BHP02123060209", lastName: "Цэрэнжамц", firstName: "Цэлмүүн", email: "tselmuun2gb9@moes.edu.mn" },
  { id: 19, studentCode: "BHP02123060177", lastName: "Наранбаатар", firstName: "Энхдөлгөөн", email: "enkhdulguun46j0@moes.edu.mn" },
  { id: 20, studentCode: "BHP02123060186", lastName: "Мөнхбаатар", firstName: "Эрхэмбаяр", email: "erkhembayar64lf@moes.edu.mn" }
];