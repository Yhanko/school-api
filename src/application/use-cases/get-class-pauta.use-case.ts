import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GetClassPautaUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(classId: string, subjectId: string, institutionId: string) {
    // 1. Fetch class to get grade (e.g. "6ª Classe")
    const classInfo = await this.prisma.class.findFirst({
      where: { id: classId, institutionId },
    });
    if (!classInfo) {
      throw new Error('Class not found');
    }

    // Identify if it's an exam class
    const gradeString = classInfo.grade?.toLowerCase() || '';
    const isExamClass = ['6ª', '9ª', '12ª', '13ª'].some(g => gradeString.includes(g));

    // 2. Fetch subject to know if it's Portuguese
    const subjectInfo = await this.prisma.subject.findFirst({
      where: { id: subjectId, institutionId }
    });
    const subjectName = subjectInfo?.name?.toLowerCase() || '';
    const isPortuguese = subjectName.includes('portugu') || subjectName.includes('português');

    // 3. Fetch students in the class
    const enrollments = await this.prisma.enrollment.findMany({
      where: { classId },
      include: {
        student: {
          select: { id: true, name: true, code: true }
        }
      }
    });

    // 4. Fetch all grades for this class and subject
    const grades = await this.prisma.grade.findMany({
      where: { classId, subjectId, institutionId }
    });

    const result = enrollments.map(enrollment => {
      const studentGrades = grades.filter(g => g.studentId === enrollment.studentId);
      
      const getAverage = (term: string, type: string) => {
        const termGrades = studentGrades.filter(g => g.term === term && g.type === type);
        if (termGrades.length === 0) return null;
        return termGrades.reduce((acc, curr) => acc + curr.value, 0) / termGrades.length;
      };

      const getSingle = (term: string, types: string[]) => {
        const g = studentGrades.find(g => g.term === term && types.includes(g.type));
        return g ? g.value : null;
      };

      const getGrade = (types: string[]) => {
        const g = studentGrades.find(g => types.includes(g.type));
        return g ? g.value : null;
      };

      // Calculate MT for each term
      const calculateMT = (term: string, isThirdTermExam: boolean = false) => {
        const mac = getAverage(term, 'AC');
        const npt = getSingle(term, ['NPT', 'PT']); // fallback for PT

        if (mac === null || npt === null) return { mac, npt, mt: null };

        let mt = (mac + npt) / 2;
        return { mac, npt, mt };
      };

      const t1 = calculateMT('first');
      const t2 = calculateMT('second');
      const t3 = calculateMT('third');

      // EXAM CLASS LOGIC: MT3 is different
      let mt1 = t1.mt;
      let mt2 = t2.mt;
      let mt3 = t3.mt; // defaults to (MAC+NPT)/2 for transition classes

      if (isExamClass) {
        if (mt1 !== null && mt2 !== null && t3.mac !== null) {
          mt3 = (mt1 + mt2 + t3.mac) / 3;
        } else {
          mt3 = null;
        }
      }

      // Calculate MFD
      let mfd = null;
      let menc = null;
      let nee = getGrade(['NEE', 'EX']);
      let neo = getGrade(['NEO']);

      if (isExamClass) {
        if (isPortuguese) {
          if (nee !== null && neo !== null) {
            menc = (nee + neo) / 2;
          }
        } else {
          menc = nee;
        }

        if (mt3 !== null && menc !== null) {
          mfd = (mt3 * 0.6) + (menc * 0.4);
        }
      } else {
        // Transition class
        if (mt1 !== null && mt2 !== null && mt3 !== null) {
          mfd = (mt1 + mt2 + mt3) / 3;
        }
      }

      return {
        student: enrollment.student,
        terms: {
          first: { mac: t1.mac, npt: t1.npt, mt: t1.mt },
          second: { mac: t2.mac, npt: t2.npt, mt: t2.mt },
          third: { mac: t3.mac, npt: t3.npt, mt: mt3 },
        },
        final: {
          nee,
          neo,
          menc,
          mfd
        }
      };
    });

    // Sort alphabetically by student name
    result.sort((a, b) => a.student.name.localeCompare(b.student.name));

    return {
      classInfo: { name: classInfo.name, grade: classInfo.grade, isExamClass },
      subjectInfo: { name: subjectInfo?.name, isPortuguese },
      students: result
    };
  }
}
