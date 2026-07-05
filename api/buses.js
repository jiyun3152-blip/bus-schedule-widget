export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { departure, arrival, apiKey } = req.body;

    if (!departure || !arrival || !apiKey) {
        return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    try {
        const url = new URL('https://apis.data.go.kr/1613000/ExpBusInfo/searchExpBusInfo');
        url.searchParams.append('serviceKey', apiKey);
        url.searchParams.append('startStn', departure);
        url.searchParams.append('endStn', arrival);
        url.searchParams.append('_type', 'json');

        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.response && data.response.body && data.response.body.items) {
            const buses = data.response.body.items.map(item => ({
                routeName: item.routeName || '노선 정보',
                departureTime: item.departureTime || '-',
                departureTerminal: item.departureTerminal || '-',
                fare: item.fare || '-',
                travelTime: item.travelTime || '-'
            }));

            return res.status(200).json({ buses: buses });
        } else {
            return res.status(200).json({ buses: [] });
        }
    } catch (error) {
        return res.status(500).json({ error: '서버 오류: ' + error.message });
    }
}
