import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
    // Criamos a propriedade Pool, ela representa a conexão com o banco de dados.
    private pool: Pool;

    // O constructor é executado automaticamente quando o serviço é criado.
    constructor (private configService: ConfigService){
        // O createPool é nosso gerenciador de conexões com banco de dados.
        this.pool = createPool({
            host: this.configService.get<string>('DB_HOST'), // endereço do banco de dados
            user: this.configService.get<string>('DB_USER'), // usuário do banco de dados
            password: this.configService.get<string>('DB_PASSWORD'), // senha do banco de dados
            database: this.configService.get<string>('DB_NAME') // nome do banco de dados
        });
    }

    // Criamos um módulo genérico chamado query
    // Vamos usá-lo por outros services para executar comandos SQL
    async query(sql: string,  params?: any[]) {
        // o execute envia o comando SQL para o banco
        // Os params são os valores que substituem os "?" nas consultas
        const[resultado] = await this.pool.execute(sql, params);
        return resultado;
    }
}
