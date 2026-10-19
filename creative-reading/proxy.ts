import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ALLOWED_STUDENTS, ALLOWED_TEACHERS } from './lib/allowedUsers';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname, searchParams } = url;
  const email = searchParams.get('email');

  // 1. Багшийн хэсгийг хамгаалах (/teacher болон /analytics)
  if (pathname.startsWith('/teacher') || pathname.startsWith('/analytics')) {
    if (email) {
      const isTeacher = ALLOWED_TEACHERS.some(
        (t) => t.toLowerCase() === email.trim().toLowerCase()
      );
      if (!isTeacher) {
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    }
  }

  // 2. Сурагчийн сорилын хэсгийг хамгаалах (/student болон /exam)
  if (pathname.startsWith('/student') || pathname.startsWith('/exam')) {
    if (!email) {
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    const cleanEmail = email.trim().toLowerCase();
    
    // Зөвшөөрөгдсөн сурагч эсвэл Багш мөн эсэхийг шалгана
    const isStudent = ALLOWED_STUDENTS.some((s) => s.email.toLowerCase() === cleanEmail);
    const isTeacher = ALLOWED_TEACHERS.some((t) => t.toLowerCase() === cleanEmail);

    if (!isStudent && !isTeacher) {
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/teacher/:path*', '/analytics/:path*', '/student/:path*', '/exam/:path*'],
};