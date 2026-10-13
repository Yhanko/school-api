import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface BullConfigResult {
  prefix: string;
  connection: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    db?: number;
    url?: string;
    maxRetriesPerRequest: null;
    enableReadyCheck: boolean;
    enableOfflineQueue: boolean;
    connectTimeout: number;
    connectionName: string;
    retryStrategy: (times: number) => number;
    tls?: any;
    [key: string]: any;
  };
}

const logger = new Logger('RedisConfig');

/**
 * Cria a configuração recomendada e isolada para o BullMQ e Redis.
 *
 * Pilares de Isolamento para Coexistência com outras aplicações:
 * 1. Namespace / Key Prefix: Todas as chaves criadas pelo BullMQ recebem o prefixo
 *    (padrão 'school_api'), impedindo conflitos com chaves padrão ('bull:') de outros apps.
 * 2. Banco Lógico (DB): Suporta seleção de base lógica (ex: DB 1 ou 2), isolando o keyspace.
 * 3. Client Name: Registra a conexão como 'school_api_scraper', visível no `CLIENT LIST`.
 * 4. Resiliência: Reconexão automática com backoff exponencial, sem derrubar a API.
 * 5. Flexibilidade: Aceita URL completa (REDIS_URL) com suporte a TLS (rediss://)
 *    ou parâmetros granulares (HOST, PORT, PASSWORD, USERNAME, DB).
 */
export function getBullConfig(configService: ConfigService): BullConfigResult {
  const redisUrl = configService.get<string>('REDIS_URL');
  const redisHost = configService.get<string>('REDIS_HOST');
  const redisPort = Number(configService.get<number>('REDIS_PORT', 6379));
  const redisPassword = configService.get<string>('REDIS_PASSWORD');
  const redisUsername = configService.get<string>('REDIS_USERNAME');
  const redisDb = Number(configService.get<number>('REDIS_DB', 0));
  const redisPrefix = configService.get<string>('REDIS_PREFIX', 'school_api');
  const redisClientName = configService.get<string>('REDIS_CLIENT_NAME', 'school_api_scraper');
  const redisTls =
    configService.get<string>('REDIS_TLS') === 'true' ||
    Boolean(redisUrl && redisUrl.startsWith('rediss://'));

  // Reconexão com backoff progressivo (máximo 3 segundos por tentativa)
  const retryStrategy = (times: number) => {
    return Math.min(times * 150, 3000);
  };

  const baseConnectionOptions: any = {
    maxRetriesPerRequest: null, // Obrigatório pelo BullMQ
    enableReadyCheck: false,
    enableOfflineQueue: true,
    connectTimeout: 10000,
    connectionName: redisClientName,
    retryStrategy,
  };

  if (redisTls) {
    baseConnectionOptions.tls = {
      rejectUnauthorized: configService.get<string>('REDIS_TLS_REJECT_UNAUTHORIZED', 'false') === 'true',
    };
  }

  let connection: any;

  if (redisUrl) {
    connection = {
      ...baseConnectionOptions,
      url: redisUrl,
    };

    if (configService.get('REDIS_DB') !== undefined) {
      connection.db = redisDb;
    }

    // Mascara a senha para exibição segura nos logs de inicialização
    const sanitizedUrl = redisUrl.replace(/\/\/[^@]*@/, '//***:***@');
    logger.log(
      `BullMQ configurado via REDIS_URL: ${sanitizedUrl} (Prefix: "${redisPrefix}", DB: ${connection.db ?? 'url-default'}, Client: "${redisClientName}")`,
    );
  } else {
    connection = {
      ...baseConnectionOptions,
      host: redisHost || '127.0.0.1',
      port: redisPort,
      db: redisDb,
      ...(redisUsername ? { username: redisUsername } : {}),
      ...(redisPassword ? { password: redisPassword } : {}),
    };

    logger.log(
      `BullMQ configurado via parâmetros: ${connection.host}:${connection.port} (DB: ${redisDb}, Prefix: "${redisPrefix}", Client: "${redisClientName}")`,
    );
  }

  return {
    prefix: redisPrefix,
    connection,
  };
}
