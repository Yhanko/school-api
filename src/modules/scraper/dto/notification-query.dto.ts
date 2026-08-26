export class NotificationQueryDto {
  page?: string;
  limit?: string;
  type?: 'NOTICIA' | 'CONCURSO' | 'SEMINARIO' | 'COMUNICADO';
  unreadOnly?: boolean | string;
}
