import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
fetchMock.mockResponse((req) => {
  return Promise.resolve({
    body: JSON.stringify([]),
    init: { status: 200, headers: { 'content-type': 'application/json' } }
  });
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
