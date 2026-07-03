export declare class UploadsController {
    uploadFile(file: Express.Multer.File): {
        filename: string;
        path: string;
        originalname: string;
        mimetype: string;
        size: number;
    };
}
