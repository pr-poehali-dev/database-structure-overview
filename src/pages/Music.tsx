import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface YandexTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover: string;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  thumbnail: string;
  platform: 'youtube' | 'yandex';
  duration?: number;
}

const YANDEX_MUSIC_API = 'https://functions.poehali.dev/c205c678-85e2-4601-aefb-ea38f04f824b';

const Music = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [yandexTracks, setYandexTracks] = useState<YandexTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      loadPopularTracks();
    }
  }, [navigate]);

  const loadPopularTracks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${YANDEX_MUSIC_API}?action=popular`);
      const data = await response.json();
      
      if (response.ok && data.tracks) {
        setYandexTracks(data.tracks);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось загрузить популярные треки',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к API',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const searchYandexMusic = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${YANDEX_MUSIC_API}?action=search&query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (response.ok && data.tracks) {
        setYandexTracks(data.tracks);
        toast({
          title: 'Успешно',
          description: `Найдено треков: ${data.tracks.length}`
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось найти треки',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к API',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

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

  const addToLibrary = (yandexTrack: YandexTrack) => {
    const newTrack: Track = {
      id: yandexTrack.id,
      title: yandexTrack.title,
      artist: yandexTrack.artist,
      url: '',
      thumbnail: yandexTrack.cover,
      platform: 'yandex',
      duration: yandexTrack.duration
    };

    if (!tracks.find(t => t.id === newTrack.id)) {
      setTracks([...tracks, newTrack]);
      toast({
        title: 'Добавлено',
        description: `${newTrack.title} - ${newTrack.artist}`
      });
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                    placeholder="Поиск треков на Яндекс.Музыке..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchYandexMusic()}
                  />
                  <Button onClick={searchYandexMusic} disabled={loading}>
                    <Icon name={loading ? "Loader2" : "Search"} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Поиск
                  </Button>
                  <Button variant="outline" onClick={loadPopularTracks} disabled={loading}>
                    <Icon name="TrendingUp" className="mr-2" />
                    Популярное
                  </Button>
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <Icon name="Loader2" className="animate-spin mx-auto text-primary" size={32} />
                    <p className="text-muted-foreground mt-2">Загрузка...</p>
                  </div>
                )}

                {!loading && yandexTracks.length > 0 && (
                  <div className="space-y-3">
                    {yandexTracks.map(track => (
                      <div key={track.id} className="flex items-center gap-4 p-3 bg-card border rounded-lg hover:bg-accent transition-colors">
                        {track.cover ? (
                          <img src={track.cover} alt="" className="w-14 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-14 h-14 bg-primary/10 rounded flex items-center justify-center">
                            <Icon name="Music2" className="text-primary" size={24} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{track.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                          {track.duration > 0 && (
                            <p className="text-xs text-muted-foreground">{formatDuration(track.duration)}</p>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => addToLibrary(track)}
                        >
                          <Icon name="Plus" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && yandexTracks.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Music2" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Используйте поиск или загрузите популярные треки</p>
                  </div>
                )}

                {tracks.filter(t => t.platform === 'yandex').length > 0 && (
                  <>
                    <div className="border-t pt-4 mt-6">
                      <h3 className="text-lg font-semibold mb-3">Моя библиотека</h3>
                    </div>
                    <div className="space-y-3">
                      {tracks.filter(t => t.platform === 'yandex').map(track => (
                        <div key={track.id} className="flex items-center gap-4 p-3 bg-card border rounded-lg hover:bg-accent transition-colors">
                          {track.thumbnail ? (
                            <img src={track.thumbnail} alt="" className="w-14 h-14 object-cover rounded" />
                          ) : (
                            <div className="w-14 h-14 bg-primary/10 rounded flex items-center justify-center">
                              <Icon name="Music2" className="text-primary" size={24} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{track.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => removeTrack(track.id)}
                          >
                            <Icon name="Trash2" className="text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
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