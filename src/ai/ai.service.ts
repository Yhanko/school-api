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
    const studyPlan: string[] = [];
    const goals: string[] = [];

    // Calcula a média global do aluno para definir as metas
    const overallAvg = subjectAverages.length > 0 
      ? subjectAverages.reduce((acc, s) => acc + s.average, 0) / subjectAverages.length
      : 0;

    if (strengthsList.length > 0) {
      summaryText += `O aluno demonstra grande facilidade em ${strengthsList.join(', ')}. `;
      recommendations.push(`Continuar a desafiar o aluno com atividades complementares em ${strengthsList.join(', ')} para não desmotivar.`);
    }

    if (weaknessesList.length > 0) {
      summaryText += `No entanto, apresenta sérias dificuldades em ${weaknessesList.join(', ')} (abaixo de 10).`;
      recommendations.push(`Recomenda-se acompanhamento extra nas disciplinas de ${weaknessesList.join(', ')}.`);
      recommendations.push('Sugerir metodologias mais práticas ou aulas de apoio focadas nos tópicos onde o aluno teve as notas mais baixas.');
      
      weaknessesList.forEach(w => {
        studyPlan.push(`Dedicar 2-3 horas semanais extra a ${w}`);
      });
      studyPlan.push('Revisar conceitos básicos nas disciplinas com menor desempenho');
      goals.push(`Melhorar nas disciplinas de maior dificuldade para pelo menos 12 valores`);
    }

    if (mediumSubjects.length > 0) {
       studyPlan.push('Praticar exercícios adicionais nas disciplinas médias para alcançar a excelência');
    }

    if (weaknessesList.length === 0 && strengthsList.length === 0) {
      summaryText += `O desempenho está na média, sem grandes picos de excelência ou dificuldades acentuadas.`;
      recommendations.push('Manter o ritmo atual, incentivando a participação nas aulas para elevar os resultados para o patamar de excelência.');
      studyPlan.push('Manter um horário de estudo regular de 1-2 horas por dia');
    }

    // Add generic pedagogical recommendations based on overall performance
    if (geralStatus === 'Crítico (Em risco escolar)') {
      recommendations.push('Reunião urgente com os encarregados de educação para alinhar expectativas e estratégias de estudo em casa.');
      recommendations.push('Aplicar testes diagnósticos para identificar lacunas de anos anteriores.');
      goals.push(`Atingir pelo menos o nível de aprovação (10 valores) nas disciplinas críticas`);
    } else if (geralStatus === 'Excelente') {
      recommendations.push('Convidar o aluno para ajudar os colegas (mentoria de pares), desenvolvendo as suas soft skills.');
      studyPlan.push('Explorar tópicos extracurriculares ou avançados');
      goals.push('Manter o padrão de excelência e liderar projetos de grupo');
    }

    if (overallAvg > 0) {
       const targetAvg = overallAvg < 14 ? 14 : Math.ceil(overallAvg + 1);
       goals.push(`Manter ou elevar a média geral para acima de ${targetAvg}`);
    }
    goals.push('Manter frequência acima de 95% em todas as disciplinas');
    goals.push('Participar mais ativamente nas aulas e discussões');

    return {
      studentName: student.name,
      status: geralStatus,
      summary: summaryText,
      strengths: strengthsList,
      weaknesses: weaknessesList,
      recommendations,
      studyPlan,
      goals,
      chartData: subjectAverages.map(s => ({
        subject: s.subject,
        score: s.average
      }))
    };
  }

  async generateTeacherAnalysis(teacherId: string, institutionId: string) {
    // Buscar as turmas e disciplinas que o professor leciona
    const teacher = await this.prisma.user.findFirst({
      where: { id: teacherId, institutionId, role: 'TEACHER' },
      include: {
        classSubjects: {
          include: {
            class: true,
            subject: true
          }
        }
      }
    });

    if (!teacher || teacher.classSubjects.length === 0) {
      return {
        teacherName: teacher?.name || 'Professor',
        status: 'Sem turmas',
        summary: 'Não tem turmas ou disciplinas atribuídas no momento.',
        strugglingStudents: [],
        recommendations: ['Solicite à secretaria a atribuição das suas turmas e disciplinas.']
      };
    }

    const classIds = teacher.classSubjects.map(cs => cs.classId);
    const subjectIds = teacher.classSubjects.map(cs => cs.subjectId);

    // Buscar notas dos alunos nessas turmas e disciplinas
    const grades = await this.prisma.grade.findMany({
      where: {
        classId: { in: classIds },
        subjectId: { in: subjectIds },
        institutionId
      },
      include: {
        student: true,
        class: true,
        subject: true
      }
    });

    if (grades.length === 0) {
      return {
        teacherName: teacher.name,
        status: 'Sem notas',
        summary: `Professor(a) **${teacher.name}**, ainda não lançou notas para os alunos nas suas disciplinas.`,
        strugglingStudents: [],
        recommendations: ['Lembre-se de lançar as notas das avaliações contínuas para podermos analisar o desempenho das suas turmas.']
      };
    }

    // Agrupar alunos por nota média na disciplina
    const studentAverages: Record<string, { name: string, className: string, subjectName: string, total: number, count: number }> = {};
    
    for (const g of grades) {
      const key = `${g.studentId}-${g.subjectId}`;
      if (!studentAverages[key]) {
        studentAverages[key] = {
          name: g.student.name,
          className: g.class.name,
          subjectName: g.subject.name,
          total: 0,
          count: 0
        };
      }
      studentAverages[key].total += g.value;
      studentAverages[key].count += 1;
    }

    const struggling: any[] = [];
    let excellentCount = 0;
    
    for (const data of Object.values(studentAverages)) {
      const avg = data.total / data.count;
      if (avg < 10) {
        struggling.push({ ...data, average: Number(avg.toFixed(1)) });
      } else if (avg >= 15) {
        excellentCount++;
      }
    }

    // Ordenar alunos com mais dificuldades (menor nota primeiro)
    struggling.sort((a, b) => a.average - b.average);

    const strugglingStudentsText = struggling.map(s => 
      `- **${s.name}** (Turma ${s.className}): Média de ${s.average} a ${s.subjectName}.`
    );

    let summaryText = `Olá Professor(a) **${teacher.name}**. Realizei a análise global das suas turmas. `;
    if (struggling.length > 0) {
      summaryText += `Identifiquei **${struggling.length} alunos** que necessitam de intervenção pedagógica urgente nas suas disciplinas. Por outro lado, tem ${excellentCount} aluno(s) com excelente desempenho.`;
    } else {
      summaryText += `Boas notícias! Nenhum dos seus alunos apresenta média negativa nas suas disciplinas de momento.`;
    }

    const recommendations = [
      'Utilize metodologias ativas: invés de aulas apenas expositivas, promova trabalhos de grupo e debates.',
      'Para os alunos em dificuldade, proponha fichas formativas e indique mentores (colegas com médias altas).',
      'Crie planos de aula focados na resolução de problemas práticos, ligando a teoria à realidade dos alunos.'
    ];

    return {
      teacherName: teacher.name,
      status: struggling.length > 0 ? 'Atenção Necessária' : 'Estável',
      summary: summaryText,
      strugglingStudents: strugglingStudentsText,
      recommendations
    };
  }

  async chatWithAi(question: string, studentId: string, user: any) {
    const institutionId = user.institutionId;
    const questionLower = question.toLowerCase();

    if (user.role === 'TEACHER') {
        let responseText = "Entendi a sua dúvida. Como docente, o seu papel é fundamental na orientação dos alunos. Como posso ajudar com metodologias de ensino, atividades ou planos de aula?";

        if (questionLower.includes('aluno') || questionLower.includes('turma') || questionLower.includes('desempenho') || questionLower.includes('dificuldade')) {
            try {
               const analysis = await this.generateTeacherAnalysis(user.id, institutionId);
               responseText = `${analysis.summary}\n\n`;
               
               if (analysis.strugglingStudents.length > 0) {
                 responseText += `🚨 **Alunos a requerer maior atenção:**\n${analysis.strugglingStudents.join('\n')}\n\n`;
                 responseText += `💡 **Como intervir:**\nCada aluno aprende de forma diferente. Para os alunos acima, recomendo **Diferenciação Pedagógica**: adapte os exercícios ao nível de prontidão de cada um. Fale com eles em privado para compreender se a dificuldade é de base (falta de bases de anos anteriores) ou de método de estudo.\n\n`;
               }

               responseText += `📚 **Sugestões Metodológicas:**\n`;
               analysis.recommendations.forEach(r => responseText += `- ${r}\n`);

            } catch(e) {
               responseText = "Não foi possível carregar os dados das suas turmas neste momento. Mas de forma geral, para turmas com baixo desempenho, recomenda-se adotar metodologias ativas, como *Flipped Classroom* (Sala de Aula Invertida) e Aprendizagem Baseada em Projetos (PBL).";
            }
        } else if (questionLower.includes('metodologia') || questionLower.includes('ensino') || questionLower.includes('atividade')) {
            responseText = `Para tornar as suas aulas mais dinâmicas, sugiro diversificar os **Recursos de Ensino** e as **Metodologias**:\n
1. **Gamificação:** Utilize quizzes interativos (como Kahoot ou Quizizz) no início ou fim das aulas para aferir o nível de compreensão sem o stress da avaliação.
2. **Sala de Aula Invertida:** Dê aos alunos os materiais teóricos (vídeos ou textos curtos) para estudarem em casa. Use o tempo de aula **exclusivamente** para debates, dúvidas e resolução de problemas práticos.
3. **Aprendizagem Cooperativa:** Agrupe alunos heterogéneos (um aluno muito bom com alunos que sentem dificuldades) para trabalharem num projeto comum.`;
        } else if (questionLower.includes('plano') || questionLower.includes('aula') || questionLower.includes('estrutura')) {
             responseText = `Uma estrutura excelente para o seu **Plano de Aula** baseia-se em 4 momentos chave (Modelo 4MAT):\n
1. **Motivação (Porquê aprender isto?):** 5-10 mins. Capte a atenção com uma história real, um desafio prático ou um mistério relacionado com a matéria.
2. **Informação (O que é isto?):** 15 mins. Exposição teórica clara, direta e com apoio visual.
3. **Prática (Como se faz?):** 20 mins. Resolução guiada de exercícios ou cenários práticos.
4. **Aplicação (E se...?):** 5-10 mins. O aluno tenta aplicar o conhecimento numa situação nova ou faz o resumo da aula com as suas próprias palavras.`;
        } else if (questionLower.includes('olá') || questionLower.includes('bom dia') || questionLower.includes('boa tarde')) {
            responseText = "Olá, Colega! Sou a sua IA Assistente Pedagógica. Estou aqui para otimizar os seus planos de aula, sugerir metodologias ativas e dar-lhe um panorama analítico de todas as suas turmas. O que deseja explorar agora?";
        }

        return {
           resposta: responseText,
           categoria: 'apoio_docente'
        };
    }

    
    // Default response
    let responseText = "Entendi a sua dúvida. O processo de aprendizagem é contínuo e requer paciência. Para obter melhores resultados, recomendo sempre organizar o seu tempo, tirar dúvidas com os professores e manter um ritmo de estudo constante. Posso ajudá-lo com algum tópico mais específico?";
    
    // Very simple heuristics based on keywords but with rich responses
    if (questionLower.includes('rotina') || questionLower.includes('horário') || questionLower.includes('organizar')) {
      responseText = `Para criar uma **rotina de estudos altamente eficaz**, a consistência é a chave. Siga este plano prático:

1. **Defina um horário fixo:** Estude à mesma hora todos os dias para habituar o seu cérebro.
2. **Use o método Pomodoro:** Estude focadamente durante 25-30 minutos e faça pausas reais de 5 minutos. Isto evita a sobrecarga mental.
3. **Intercale disciplinas:** Não passe 4 horas a estudar a mesma matéria. A mudança ajuda o cérebro a manter-se alerta.
4. **Planeamento semanal:** Ao domingo, organize o que vai estudar em cada dia da semana seguinte.

O segredo não é estudar muitas horas, mas sim estudar com qualidade e foco!`;
    } else if (questionLower.includes('concentração') || questionLower.includes('foco') || questionLower.includes('atenção') || questionLower.includes('distração')) {
      responseText = `A concentração é como um músculo que precisa de ser treinado. Aqui estão as estratégias mais eficazes, baseadas em neurociência:

* **Ambiente de Estudo:** Estude num local iluminado e organizado. A desorganização visual distrai o cérebro.
* **Barreira Digital:** Coloque o telemóvel noutra divisão ou use aplicações que bloqueiam redes sociais durante o estudo. 80% das perdas de foco vêm de notificações.
* **Alimentação e Sono:** O cérebro não consegue focar-se se estiver cansado ou desidratado. Beba muita água e durma pelo menos 8 horas por noite.
* **Uma tarefa de cada vez:** O *multitasking* é um mito. Foque-se em ler um texto, depois em fazer os exercícios, e só depois avance para outra matéria.`;
    } else if (questionLower.includes('ansiedade') || questionLower.includes('nervos') || questionLower.includes('stress') || questionLower.includes('emocional')) {
      responseText = `É completamente normal sentir ansiedade antes de testes importantes. O seu corpo está a preparar-se para um desafio. Para controlar isso:

1. **Respiração Diafragmática:** Inspire durante 4 segundos, segure 4 segundos, e expire lentamente durante 6 segundos. Repita isto 5 vezes antes de começar o teste para diminuir a frequência cardíaca.
2. **Preparação Antecipada:** A maior fonte de ansiedade é a incerteza. Começar a estudar dias antes reduz drasticamente a sensação de "não saber nada".
3. **Foque-se no que controla:** Não pode controlar a dificuldade do teste, mas pode controlar a sua preparação e a sua calma no momento.
4. **Perspetiva Saudável:** Lembre-se que uma nota é apenas uma fotografia do seu conhecimento naquele dia específico. Não define a sua inteligência nem o seu valor.`;
    } else if (questionLower.includes('memorizar') || questionLower.includes('aprender') || questionLower.includes('técnicas') || questionLower.includes('leitura') || questionLower.includes('ler')) {
      responseText = `Aprender não é apenas ler. A leitura é passiva. Para memorizar a longo prazo e melhorar a compreensão, use o **Estudo Ativo**:

* **Recordação Ativa (Active Recall):** Leia um parágrafo, feche o livro e tente explicar o que acabou de ler em voz alta como se fosse o professor.
* **Repetição Espaçada:** Não reveja a matéria apenas na véspera do teste. Reveja 1 dia depois da aula, depois 3 dias, depois 1 semana.
* **Mapas Mentais:** Conecte conceitos visualmente. O cérebro memoriza imagens e ligações muito melhor do que listas de texto.
* **Pratique com Exercícios:** Fazer provas e fichas antigas é a forma número 1 de fixar conhecimentos (especialmente em disciplinas Exatas).`;
    } else if (questionLower.includes('nota') || questionLower.includes('desempenho') || questionLower.includes('prova') || questionLower.includes('análise') || questionLower.includes('estou') || questionLower.includes('minhas')) {
       // If student is provided, try to integrate student data
       if (studentId) {
          try {
             const analysis = await this.generateStudentAnalysis(studentId, "", institutionId);
             
             responseText = `Realizei uma análise profunda e em tempo real do seu histórico académico, **${analysis.studentName}**. \n\n`;
             
             if (analysis.status === 'Sem dados') {
               responseText += "Neste momento, ainda não tenho dados suficientes (notas registadas) para gerar o seu perfil pedagógico. Continue a assistir às aulas e em breve terei um relatório completo para si!";
             } else {
               responseText += `O seu desempenho global atual é classificado como **${analysis.status}**.\n\n`;
               
               if (analysis.strengths.length > 0) {
                 responseText += `🌟 **Os seus Pontos Fortes:**\nEstá a demonstrar um domínio excelente em **${analysis.strengths.join(', ')}**. O seu esforço nestas áreas é evidente. Pode até ajudar os seus colegas ou explorar tópicos mais avançados para se desafiar ainda mais!\n\n`;
               }
               
               if (analysis.weaknesses.length > 0) {
                 responseText += `⚠️ **Áreas de Foco Prioritário:**\nNotei que as suas avaliações estão mais baixas em **${analysis.weaknesses.join(', ')}**. Não desanime, isto é apenas um sinal de que precisamos de mudar a estratégia de estudo nestas disciplinas. Recomendo:\n- Pedir esclarecimentos diretamente aos professores.\n- Dedicar +30 minutos diários a estas matérias.\n- Fazer revisões com fichas práticas.\n\n`;
               }
               
               if (analysis.strengths.length === 0 && analysis.weaknesses.length === 0) {
                 responseText += `📊 **Panorama Geral:**\nAs suas notas estão equilibradas na média, não apresentando nem picos de dificuldade extrema nem picos de excelência absolutos. Este é um ótimo ponto de partida. Para dar o salto para a excelência, identifique a matéria que mais gosta e aprofunde o seu estudo nela!\n\n`;
               }
               
               responseText += `💡 **A Minha Recomendação Principal:**\n${analysis.recommendations[0] || 'Mantenha o foco, seja consistente e não tenha medo de errar, pois o erro faz parte da aprendizagem.'}`;
             }
          } catch(e) {
             // fallback
             responseText = "Para fazer uma avaliação justa do seu desempenho, preciso de consultar as suas pautas. De forma geral, recomendo que analise em que disciplinas tem tido notas mais baixas e foque o seu tempo de estudo aí, sem esquecer de rever as que já domina.";
          }
       } else {
         responseText = "Como assistente, não tenho o seu ID para verificar as suas notas exatas neste momento. Mas recomendo que faça uma auto-avaliação: em qual disciplina sente mais insegurança? Comece a estruturar o seu plano de estudos por aí.";
       }
    } else if (questionLower.includes('olá') || questionLower.includes('bom dia') || questionLower.includes('boa tarde')) {
      responseText = "Olá! Sou a sua IA Tutora. Estou aqui para ajudar a elevar o seu rendimento escolar, oferecer métodos de estudo baseados em ciência e analisar o seu desempenho para criarmos as melhores estratégias. Em que posso ajudá-lo hoje?";
    }
    
    // Contextualize with subject if passed via dropdown
    const subjectMatch = question.match(/\[Sobre (.*?)\]/);
    if (subjectMatch && subjectMatch[1] && subjectMatch[1] !== 'Geral') {
       const subject = subjectMatch[1];
       if (!questionLower.includes('desempenho') && !questionLower.includes('análise')) {
          responseText = `**Em relação à disciplina de ${subject}:**\nA melhor abordagem depende muito do tipo de disciplina. Se for Exata (como Matemática, FQ), foque-se em praticar exercícios e compreender a lógica dos problemas, não apenas decorar fórmulas. Se for de Humanidades, crie mapas conceituais e explique a matéria por palavras suas.\n\n---\n\n${responseText}`;
       }
    }
    
    return {
       resposta: responseText,
       categoria: 'apoio_pedagogico'
    };
  }

  getSuggestions(user?: any) {
    if (user?.role === 'TEACHER') {
        return [
          { texto: 'Como está o desempenho das minhas turmas na minha disciplina?', categoria: 'desempenho' },
          { texto: 'Que alunos precisam de mais acompanhamento?', categoria: 'desempenho' },
          { texto: 'Sugestões de metodologias ativas e inovadoras', categoria: 'metodologias' },
          { texto: 'Como estruturar um plano de aula dinâmico e envolvente?', categoria: 'planeamento' },
          { texto: 'Dicas de atividades práticas para os alunos', categoria: 'atividades' }
        ];
    }

    return [
      { texto: 'Pode dar-me uma análise detalhada sobre o meu desempenho atual?', categoria: 'desempenho' },
      { texto: 'Como criar uma rotina de estudos altamente eficaz?', categoria: 'organizacao' },
      { texto: 'Sinto dificuldades de concentração nas aulas. O que devo fazer?', categoria: 'concentracao' },
      { texto: 'Como gerir o stress e a ansiedade antes dos testes?', categoria: 'emocional' },
      { texto: 'Que técnicas ativas existem para memorizar a matéria?', categoria: 'aprendizagem' }
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
