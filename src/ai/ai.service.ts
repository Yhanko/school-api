import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async generateStudentAnalysis(studentId: string, classId: string, institutionId: string) {
    // Validate student
    const student = await this.prisma.user.findFirst({
      where: { id: studentId, institutionId, role: 'STUDENT' },
    });

    if (!student) {
      throw new NotFoundException('Aluno não encontrado');
    }

    // Fetch grades for this student
    const whereClause: any = { studentId };
    if (classId) {
      whereClause.classId = classId;
    }

    const grades = await this.prisma.grade.findMany({
      where: whereClause,
      include: {
        subject: true
      }
    });

    // Group grades by subject
    const subjectGrades: Record<string, number[]> = {};
    for (const g of grades) {
      const subj = g.subject?.name || 'Geral';
      if (!subjectGrades[subj]) {
        subjectGrades[subj] = [];
      }
      subjectGrades[subj].push(g.value);
    }

    // Calculate averages
    const subjectAverages: { subject: string; average: number }[] = [];
    for (const [subj, vals] of Object.entries(subjectGrades)) {
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      subjectAverages.push({ subject: subj, average: Number(avg.toFixed(1)) });
    }

    // Determine strengths and weaknesses
    const strongSubjects = subjectAverages.filter((s) => s.average >= 14);
    const weakSubjects = subjectAverages.filter((s) => s.average < 10);
    const mediumSubjects = subjectAverages.filter((s) => s.average >= 10 && s.average < 14);

    let geralStatus = 'Estável';
    if (weakSubjects.length > strongSubjects.length + mediumSubjects.length) {
      geralStatus = 'Crítico (Em risco escolar)';
    } else if (strongSubjects.length > weakSubjects.length) {
      geralStatus = 'Excelente';
    } else if (weakSubjects.length > 0) {
      geralStatus = 'Atenção Necessária';
    }

    // Generate heuristics-based text
    let summaryText = `A análise do aluno **${student.name}** indica um desempenho **${geralStatus}**. `;
    
    if (grades.length === 0) {
      summaryText = `O aluno **${student.name}** ainda não possui notas lançadas no sistema para podermos gerar uma análise detalhada.`;
      return {
        studentName: student.name,
        status: 'Sem dados',
        summary: summaryText,
        strengths: [],
        weaknesses: [],
        recommendations: [
          'Aguarde o lançamento de notas para obter um relatório pedagógico automatizado.'
        ],
        chartData: []
      };
    }

    const strengthsList = strongSubjects.map(s => s.subject);
    const weaknessesList = weakSubjects.map(s => s.subject);

    const recommendations: string[] = [];

    if (strengthsList.length > 0) {
      summaryText += `O aluno demonstra grande facilidade em ${strengthsList.join(', ')}. `;
      recommendations.push(`Continuar a desafiar o aluno com atividades complementares em ${strengthsList.join(', ')} para não desmotivar.`);
    }

    if (weaknessesList.length > 0) {
      summaryText += `No entanto, apresenta sérias dificuldades em ${weaknessesList.join(', ')} (abaixo de 10).`;
      recommendations.push(`Recomenda-se acompanhamento extra nas disciplinas de ${weaknessesList.join(', ')}.`);
      recommendations.push('Sugerir metodologias mais práticas ou aulas de apoio focadas nos tópicos onde o aluno teve as notas mais baixas.');
    }

    if (weaknessesList.length === 0 && strengthsList.length === 0) {
      summaryText += `O desempenho está na média, sem grandes picos de excelência ou dificuldades acentuadas.`;
      recommendations.push('Manter o ritmo atual, incentivando a participação nas aulas para elevar os resultados para o patamar de excelência.');
    }

    // Add generic pedagogical recommendations based on overall performance
    if (geralStatus === 'Crítico (Em risco escolar)') {
      recommendations.push('Reunião urgente com os encarregados de educação para alinhar expectativas e estratégias de estudo em casa.');
      recommendations.push('Aplicar testes diagnósticos para identificar lacunas de anos anteriores.');
    } else if (geralStatus === 'Excelente') {
      recommendations.push('Convidar o aluno para ajudar os colegas (mentoria de pares), desenvolvendo as suas soft skills.');
    }

    return {
      studentName: student.name,
      status: geralStatus,
      summary: summaryText,
      strengths: strengthsList,
      weaknesses: weaknessesList,
      recommendations,
      chartData: subjectAverages.map(s => ({
        subject: s.subject,
        score: s.average
      }))
    };
  }

  async chatWithAi(question: string, studentId: string, institutionId: string) {
    const questionLower = question.toLowerCase();
    
    // Default response
    let responseText = "Entendido. A educação é um processo contínuo. Sugiro manter um acompanhamento próximo e dialogar com a escola sempre que necessário.";
    
    // Very simple heuristics based on keywords
    if (questionLower.includes('estudo') || questionLower.includes('rotina') || questionLower.includes('horário')) {
      responseText = "Para criar uma rotina de estudos eficaz, recomendo definir horários fixos diários (ex: 1 a 2 horas), intercalar disciplinas diferentes e garantir pausas de 10-15 minutos (Técnica Pomodoro).";
    } else if (questionLower.includes('concentração') || questionLower.includes('foco') || questionLower.includes('atenção')) {
      responseText = "Para melhorar a concentração, crie um ambiente de estudo livre de distrações (sem telemóvel por perto), bem iluminado e organizado. Dividir as tarefas em partes menores também ajuda a manter o foco.";
    } else if (questionLower.includes('ansiedade') || questionLower.includes('emocional') || questionLower.includes('nervoso')) {
      responseText = "A ansiedade antes das provas é comum. Ajudar o aluno a praticar exercícios de respiração, garantir uma boa noite de sono antes da avaliação e reforçar que a nota não define o seu valor são passos fundamentais.";
    } else if (questionLower.includes('leitura') || questionLower.includes('ler')) {
      responseText = "Para melhorar a leitura, sugira livros de temas que o aluno gosta, leia com ele e debata a história. A leitura deve ser um hábito prazeroso e não apenas uma obrigação escolar.";
    } else if (questionLower.includes('nota') || questionLower.includes('desempenho') || questionLower.includes('prova')) {
       // If student is provided, try to integrate student data
       if (studentId) {
          try {
             const analysis = await this.generateStudentAnalysis(studentId, "", institutionId);
             if (analysis.weaknesses.length > 0) {
               responseText = `O desempenho do ${analysis.studentName} precisa de atenção especial nas disciplinas de ${analysis.weaknesses.join(', ')}. Tente focar o estudo nestas matérias.`;
             } else if (analysis.strengths.length > 0) {
               responseText = `O desempenho do ${analysis.studentName} está excelente, com destaque para ${analysis.strengths.join(', ')}. Continue a incentivar este ritmo!`;
             } else {
               responseText = `O desempenho do ${analysis.studentName} está estável. Acompanhe os resultados regularmente.`;
             }
          } catch(e) {
             // fallback
             responseText = "As avaliações são termómetros. Foque no processo de aprendizagem e em identificar onde o aluno tem mais dúvidas para o poder ajudar direcionadamente.";
          }
       } else {
         responseText = "As avaliações são termómetros. Foque no processo de aprendizagem e em identificar onde o aluno tem mais dúvidas para o poder ajudar direcionadamente.";
       }
    }
    
    return {
       resposta: responseText,
       categoria: 'apoio_pedagogico'
    };
  }

  getSuggestions() {
    return [
      { texto: 'Como criar uma rotina de estudos eficaz?', categoria: 'organizacao' },
      { texto: 'Meu filho tem dificuldades de concentração', categoria: 'concentracao' },
      { texto: 'Como lidar com ansiedade antes das provas?', categoria: 'emocional' },
      { texto: 'Estratégias para melhorar a leitura', categoria: 'leitura' },
      { texto: 'Como motivar meu filho a estudar mais?', categoria: 'motivacao' }
    ];
  }

  getResources() {
    return [
      {
        titulo: 'Plano de Estudos Personalizado',
        descricao: 'Crie rotinas de estudo adaptadas ao perfil do seu educando',
        icon: 'Target',
        categoria: 'planejamento'
      },
      {
        titulo: 'Atividades Educativas',
        descricao: 'Sugestões de jogos e exercícios para reforçar o aprendizado',
        icon: 'BookOpen',
        categoria: 'atividades'
      },
      {
        titulo: 'Apoio Emocional',
        descricao: 'Orientações para lidar com questões emocionais e motivacionais',
        icon: 'Heart',
        categoria: 'emocional'
      },
      {
        titulo: 'Comunicação Escola-Casa',
        descricao: 'Dicas para melhorar a parceria com professores e escola',
        icon: 'Users',
        categoria: 'comunicacao'
      }
    ];
  }
}
