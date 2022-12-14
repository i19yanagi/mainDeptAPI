import { Client } from 'postgres';
import 'dotenv/load.ts';
import { Result } from './result.ts';

export class DB {
  client = new Client({
    user: Deno.env.get('DB_USER'),
    database: Deno.env.get('POSTGRES_DB'),
    hostname: Deno.env.get('DB_HOST'),
    password: Deno.env.get('DB_PASSWORD'),
    port: Deno.env.get('DB_PORT'),
    tls: {
      enabled: false,
    },
  });

  public initialize = async () => {
    await this.client.connect();
  };

  /**
   * @return Return an array of Result type
   */
  public getAllResult = async (): Promise<Result[]> => {
    const result = await this.client.queryObject<Result>(
      'SELECT score.name, score.score FROM score ORDER BY score DESC',
    );
    return result.rows;
  };

  /**
   * @param param: string
   * @return Returns an array of Result type matching the parameter name
   */
  public getResultByName = async (param: string): Promise<Result[]> => {
    const result = await this.client.queryObject<Result>(
      'SELECT score.name, score.score FROM score WHERE score.name = $1',
      [param],
    );
    return result.rows;
  };

  /**
   * @param result: Result
   * @return Return all at DB after sending results
   */
  public postResult = async (
    result: Result,
  ): Promise<() => Promise<Result[]>> => {
    await this.client.queryObject(
      'INSERT INTO score (name, score) VALUES ($1, $2)',
      [result.name, result.score],
    );
    return this.getAllResult;
  };

  /**
   * delete data when matching the parameter name
   * @param param: string
   * @return Returns an array of Result type
   */
  public deleteResult = async (param: string): Promise<Result[]> => {
    await this.client.queryObject(
        'DELETE FROM score WHERE score.name = $1',
        [param],
    );
    return this.getAllResult();
  };
}
