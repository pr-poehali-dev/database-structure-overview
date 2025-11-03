import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  thumbnail: string;
  platform: 'youtube' | 'yandex';
}

const Music = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [yandexUrl, setYandexUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const addYoutubeTrack = () => {
    if (!youtubeUrl.trim()) return;
    
    const videoId = extractYoutubeId(youtubeUrl);
    if (!videoId) {
      alert('Неверная ссылка YouTube');
      return;
    }

    const newTrack: Track = {
      id: Date.now().toString(),
      title: 'YouTube трек',
      artist: 'Неизвестен',
      url: youtubeUrl,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      platform: 'youtube'
    };

    setTracks([...tracks, newTrack]);
    setYoutubeUrl('');
  };

  const addYandexTrack = () => {
    if (!yandexUrl.trim()) return;
    
    const newTrack: Track = {
      id: Date.now().toString(),
      title: 'Яндекс.Музыка трек',
      artist: 'Неизвестен',
      url: yandexUrl,
      thumbnail: '',
      platform: 'yandex'
    };

    setTracks([...tracks, newTrack]);
    setYandexUrl('');
  };

  const extractYoutubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const removeTrack = (id: string) => {
    setTracks(tracks.filter(t => t.id !== id));
    if (currentTrack?.id === id) {
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Music" className="text-primary" />
              Музыка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="youtube" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
                <TabsTrigger value="yandex">Яндекс.Музыка</TabsTrigger>
              </TabsList>
              
              <TabsContent value="youtube" className="mt-6 space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Вставьте ссылку на YouTube видео"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addYoutubeTrack()}
                  />
                  <Button onClick={addYoutubeTrack}>
                    <Icon name="Plus" className="mr-2" />
                    Добавить
                  </Button>
                </div>

                <div className="space-y-3">
                  {tracks.filter(t => t.platform === 'youtube').map(track => (
                    <div key={track.id} className="flex items-center gap-4 p-3 bg-card border rounded-lg hover:bg-accent transition-colors">
                      {track.thumbnail && (
                        <img src={track.thumbnail} alt="" className="w-20 h-14 object-cover rounded" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => playTrack(track)}
                        >
                          <Icon name={currentTrack?.id === track.id && isPlaying ? "Pause" : "Play"} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removeTrack(track.id)}
                        >
                          <Icon name="Trash2" className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="yandex" className="mt-6 space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Вставьте ссылку на трек Яндекс.Музыки"
                    value={yandexUrl}
                    onChange={(e) => setYandexUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addYandexTrack()}
                  />
                  <Button onClick={addYandexTrack}>
                    <Icon name="Plus" className="mr-2" />
                    Добавить
                  </Button>
                </div>

                <div className="space-y-3">
                  {tracks.filter(t => t.platform === 'yandex').map(track => (
                    <div key={track.id} className="flex items-center gap-4 p-3 bg-card border rounded-lg hover:bg-accent transition-colors">
                      <div className="w-14 h-14 bg-primary/10 rounded flex items-center justify-center">
                        <Icon name="Music2" className="text-primary" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => window.open(track.url, '_blank')}
                        >
                          <Icon name="ExternalLink" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removeTrack(track.id)}
                        >
                          <Icon name="Trash2" className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {currentTrack && currentTrack.platform === 'youtube' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Сейчас играет</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${extractYoutubeId(currentTrack.url)}?autoplay=1`}
                  title="YouTube player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Music;