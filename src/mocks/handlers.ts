import { rest } from 'msw';
import { recordingSearchResponse } from '../__tests__/data/response';

export const handlers = [
  rest.get('https://musicbrainz.org/ws/2/recording/', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(recordingSearchResponse),
    );
  }),
];
