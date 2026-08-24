import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GetStudentPautaUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(studentId: string, classId: string, institutionId: string) {
    // 1. Fetch class to get grade (e.g. "6ª Classe")
    const classInfo = await this.prisma.class.findFirst({
      where: { id: classId, institutionId },
    });
    if (!classInfo) {
      throw new Error('Class not found');
    }

    const gradeString = classInfo.grade?.toLowerCase() || '';
    const isExamClass = ['6ª', '9ª', '12ª', '13ª'].some(g => gradeString.includes(g));

    // 2. Fetch all subjects for this class
    const classSubjects = await this.prisma.classSubject.findMany({
      where: { classId },
      include: { subject: true }
    });

    // 3. Fetch all grades for this student in this class
    const grades = await this.prisma.grade.findMany({
      where: { studentId, classId, institutionId },
      include: { subject: true }
    });

    // 4. Calculate for each subject
    const result = classSubjects.map(cs => {
      const subject = cs.subject;
      const subjectName = subject.name?.toLowerCase() || '';
      const isPortuguese = subjectName.includes('portugu') || subjectName.includes('português');

      const subjectGrades = grades.filter(g => g.subjectId === subject.id);

      const getAverage = (term: string, type: string) => {
        const termGrades = subjectGrades.filter(g => g.term === term && g.type === type);
        if (termGrades.length === 0) return null;
        return termGrades.reduce((acc, curr) => acc + curr.value, 0) / termGrades.length;
      };

      const getSingle = (term: string, types: string[]) => {
        const g = subjectGrades.find(g => g.term === term && types.includes(g.type));
        return g ? g.value : null;
      };

      const getGrade = (types: string[]) => {
        const g = subjectGrades.find(g => types.includes(g.type));
        return g ? g.value : null;
      };

      const calculateMT = (term: string) => {
        const mac = getAverage(term, 'AC');
        const npt = getSingle(term, ['NPT', 'PT']);

        if (mac === null || npt === null) return { mac, npt, mt: null };
        return { mac, npt, mt: (mac + npt) / 2 };
      };

      const t1 = calculateMT('first');
      const t2 = calculateMT('second');
      const t3 = calculateMT('third');

      let mt1 = t1.mt;
      let mt2 = t2.mt;
      let mt3 = t3.mt;

      if (isExamClass) {
        if (mt1 !== null && mt2 !== null && t3.mac !== null) {
          mt3 = (mt1 + mt2 + t3.mac) / 3;
        } else {
          mt3 = null;
        }
      }

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
        if (mt1 !== null && mt2 !== null && mt3 !== null) {
          mfd = (mt1 + mt2 + mt3) / 3;
        }
      }

      return {
        subject: { id: subject.id, name: subject.name },
        terms: {
          first: { mac: t1.mac, npt: t1.npt, mt: mt1 },
          second: { mac: t2.mac, npt: t2.npt, mt: mt2 },
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

    // Sort by subject name
    result.sort((a, b) => a.subject.name.localeCompare(b.subject.name));

    return {
      classInfo: { name: classInfo.name, grade: classInfo.grade, isExamClass },
      subjects: result
    };
  }
}
