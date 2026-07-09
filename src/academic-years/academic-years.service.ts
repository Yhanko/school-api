import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicYearsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calcula qual deve ser o ano letivo ativo com base na data atual.
   * Regra Angola: Setembro (mês 8 em JS, onde 0 é Janeiro) a Junho (mês 5)
   * Janeiro a Agosto (mês 0 a 7): Ano Anterior / Ano Atual
   * Setembro a Dezembro (mês 8 a 11): Ano Atual / Ano Seguinte
   */
  async getActiveYear(institutionId: string) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentFullYear = now.getFullYear();

    let yearString = '';
    let startDate: Date;
    let endDate: Date;

    if (currentMonth >= 8) { // Setembro a Dezembro
      yearString = `${currentFullYear}/${currentFullYear + 1}`;
      startDate = new Date(currentFullYear, 8, 1); // 1 de Setembro do ano atual
      endDate = new Date(currentFullYear + 1, 6, 31); // 31 de Julho do ano seguinte
    } else { // Janeiro a Agosto
      yearString = `${currentFullYear - 1}/${currentFullYear}`;
      startDate = new Date(currentFullYear - 1, 8, 1); // 1 de Setembro do ano anterior
      endDate = new Date(currentFullYear, 6, 31); // 31 de Julho do ano atual
    }

    // Procura se já existe um ano letivo com esta string para a instituição
    let activeYear = await this.prisma.academicYear.findFirst({
      where: {
        institutionId,
        year: yearString
      }
    });

    if (!activeYear) {
      // Se não existe, vamos criá-lo e marcar todos os outros como inativos
      await this.prisma.academicYear.updateMany({
        where: { institutionId },
        data: { isActive: false }
      });

      activeYear = await this.prisma.academicYear.create({
        data: {
          year: yearString,
          startDate,
          endDate,
          isActive: true,
          institutionId
        }
      });
    } else if (!activeYear.isActive) {
      // Se existe mas não está ativo, ativamo-lo e desativamos os outros
      await this.prisma.academicYear.updateMany({
        where: { institutionId, id: { not: activeYear.id } },
        data: { isActive: false }
      });

      activeYear = await this.prisma.academicYear.update({
        where: { id: activeYear.id },
        data: { isActive: true }
      });
    }

    return activeYear;
  }

  async findAll(institutionId: string) {
    return this.prisma.academicYear.findMany({
      where: { institutionId },
      orderBy: { year: 'desc' }
    });
  }
}
