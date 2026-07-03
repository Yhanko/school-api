import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    getStudentAnalysis(studentId: string, classId: string, user: any): Promise<{
        studentName: string;
        status: string;
        summary: string;
        strengths: string[];
        weaknesses: string[];
        recommendations: string[];
        chartData: {
            subject: string;
            score: number;
        }[];
    }>;
    chat(question: string, studentId: string, user: any): Promise<{
        resposta: string;
        categoria: string;
    }>;
    getSuggestions(): {
        texto: string;
        categoria: string;
    }[];
    getResources(): {
        titulo: string;
        descricao: string;
        icon: string;
        categoria: string;
    }[];
}
