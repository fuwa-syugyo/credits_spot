import { rest } from 'msw';
import { recordingSearchResponse } from './__tests__/data/response';

export const handlers = [
  rest.get('https://musicbrainz.org/ws/2/recording/', async (req, res, ctx) => {
    const recording_term = req.url.searchParams.get('query');
    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));
    const fmt = req.url.searchParams.get('fmt');

    // 実際のAPIと同じ形式のレスポンスを作成
    const response = recordingSearchResponse;

    return res(ctx.status(200), ctx.json(response));
  }),
];
