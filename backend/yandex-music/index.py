import json
import os
from typing import Dict, Any
from urllib.request import Request, urlopen
from urllib.error import HTTPError

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Search and get tracks from Yandex.Music API
    Args: event - dict with httpMethod, queryStringParameters (query, action)
          context - object with request_id, function_name attributes
    Returns: HTTP response with tracks data or error
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'search')
    query = params.get('query', '')
    
    token = os.environ.get('YANDEX_MUSIC_TOKEN')
    if not token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'YANDEX_MUSIC_TOKEN not configured'})
        }
    
    if action == 'search':
        if not query:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Query parameter required'})
            }
        
        url = f'https://api.music.yandex.net/search?type=track&text={query}&page=0&pageSize=20'
        
        req = Request(url)
        req.add_header('Authorization', f'OAuth {token}')
        
        try:
            with urlopen(req) as response:
                data = json.loads(response.read().decode())
                
                tracks = []
                if 'result' in data and 'tracks' in data['result']:
                    for item in data['result']['tracks'].get('results', []):
                        track = {
                            'id': item.get('id'),
                            'title': item.get('title'),
                            'artist': ', '.join([a.get('name', '') for a in item.get('artists', [])]),
                            'duration': item.get('durationMs', 0) // 1000,
                            'cover': ''
                        }
                        
                        if 'coverUri' in item:
                            track['cover'] = f"https://{item['coverUri'].replace('%%', '400x400')}"
                        
                        tracks.append(track)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'tracks': tracks})
                }
        
        except HTTPError as e:
            error_body = e.read().decode()
            return {
                'statusCode': e.code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Yandex API error: {error_body}'})
            }
    
    elif action == 'popular':
        url = 'https://api.music.yandex.net/landing3/chart'
        
        req = Request(url)
        req.add_header('Authorization', f'OAuth {token}')
        
        try:
            with urlopen(req) as response:
                data = json.loads(response.read().decode())
                
                tracks = []
                if 'result' in data:
                    chart = data['result'].get('chart', {})
                    for item in chart.get('tracks', [])[:20]:
                        track_data = item.get('track', {})
                        track = {
                            'id': track_data.get('id'),
                            'title': track_data.get('title'),
                            'artist': ', '.join([a.get('name', '') for a in track_data.get('artists', [])]),
                            'duration': track_data.get('durationMs', 0) // 1000,
                            'cover': ''
                        }
                        
                        if 'coverUri' in track_data:
                            track['cover'] = f"https://{track_data['coverUri'].replace('%%', '400x400')}"
                        
                        tracks.append(track)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'tracks': tracks})
                }
        
        except HTTPError as e:
            error_body = e.read().decode()
            return {
                'statusCode': e.code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Yandex API error: {error_body}'})
            }
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Invalid action'})
    }
