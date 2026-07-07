import { ResourcesService } from './resources.service';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    create(createResourceDto: any, user: any): Promise<{
        subject: string | null;
        id: string;
        type: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        title: string;
        description: string | null;
        url: string;
    }>;
    findAll(user: any): Promise<{
        subject: string | null;
        id: string;
        type: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        title: string;
        description: string | null;
        url: string;
    }[]>;
    remove(id: string, user: any): Promise<{
        subject: string | null;
        id: string;
        type: string;
        createdAt: Date;
        institutionId: string;
        updatedAt: Date;
        title: string;
        description: string | null;
        url: string;
    }>;
}
