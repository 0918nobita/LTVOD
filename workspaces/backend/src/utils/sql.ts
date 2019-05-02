import MySQL from 'mysql';

export type Params<T> =
  | number
  | boolean
  | Date
  | Buffer
  | string
  | { [K in keyof T]: T[keyof T] }
  | { toSqlString(): string; [key: string]: any }
  | undefined
  | null;

export const connect = (connection: MySQL.Connection) =>
  new Promise<void>((resolve: () => void, reject) => {
    connection.connect(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

export function query<T>(
  connection: MySQL.Connection,
  queryString: string,
  params: (Params<T> | Params<T>[])[] = []
) {
  return new Promise((resolve: (rows: T[]) => void, reject) => {
    connection.query(queryString, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}
