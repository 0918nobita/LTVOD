import { Router, Request, Response } from 'express';
import MySQL from 'mysql';
import moment from 'moment';

import { VideosRecord } from '../models/records';
import { connect, query } from '../utils/sql';
import { dbConfig } from '../config';

export const router = Router();

// endpoint prefix: /video

router.get('/latest', async (req: Request, res: Response) => {
  const records: string = req.query.records;

  const connection = MySQL.createConnection(dbConfig);

  try {
    await connect(connection);
    const videos = await query<VideosRecord>(
      connection,
      'SELECT * FROM videos ORDER BY modified DESC LIMIT ?',
      [Number.parseInt(records)]
    );
    res.json(
      videos.map(video =>
        Object.assign(video, {
          created: moment(video.created).format('YYYY年M月D日 H:m'),
          modified: moment(video.modified).format('YYYY年M月D日 H:m'),
        })
      )
    );
  } catch (e) {
    console.log(e);
    res.writeHead(500);
    res.end();
  } finally {
    connection.end();
  }
});

router.get('/:videoId', async (req: Request, res: Response) => {
  const videoId: string = req.params.videoId;

  const connection = MySQL.createConnection(dbConfig);

  try {
    await connect(connection);
    const videos = await query<VideosRecord>(
      connection,
      'SELECT * FROM videos WHERE id=?',
      [videoId]
    );
    if (videos.length === 0) {
      console.log(
        `Video ID '${videoId}' に対する動画リソースが見つかりませんでした`
      );
      res.writeHead(404);
      res.end();
      return;
    }
    const video = videos[0];
    res.json(
      Object.assign(video, {
        created: moment(video.created).format('YYYY年M月D日 H:m'),
        modified: moment(video.modified).format('YYYY年M月D日 H:m'),
      })
    );
  } catch (e) {
    console.log(e);
    res.writeHead(500);
    res.end();
  } finally {
    connection.end();
  }
});
