import { setupServer } from 'msw/node';
import { handlers } from './handlers'; // このファイルは後で作成します

// サーバーをセットアップ
const server = setupServer(...handlers);

// テスト実行前にサーバーを起動
beforeAll(() => server.listen());

// 各テスト後にサーバーをリセット
afterEach(() => server.resetHandlers());

// テスト完了後にサーバーを閉じる
afterAll(() => server.close());
