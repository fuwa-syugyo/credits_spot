export const fetchRecordings = async (): Promise<any> => {
  const url = `https://musicbrainz.org/ws/2/recording/?query=recording:残酷な天使のテーゼ&offset=0&limit=2&fmt=json`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};
