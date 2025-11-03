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

interface iTunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  trackTimeMillis: number;
  collectionName: string;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  thumbnail: string;
  platform: 'youtube' | 'itunes';
  duration?: number;
}

const ITUNES_API = 'https://itunes.apple.com/search';

const Music = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [iTunesTracks, setITunesTracks] = useState<iTunesTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
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
    await searchMusic('top hits 2024');
  };

  const searchMusic = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${ITUNES_API}?term=${encodeURIComponent(query)}&entity=song&limit=20`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setITunesTracks(data.results);
        toast({
          title: 'Успешно',
          description: `Найдено треков: ${data.results.length}`
        });
      } else {
        setITunesTracks([]);
        toast({
          title: 'Не найдено',
          description: 'Попробуйте другой запрос',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить поиск',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const searchITunes = () => {
    searchMusic(searchQuery);
  };

  const addYoutubeTrack = () => {
    if (!youtubeUrl.trim()) return;
    
    const videoId = extractYoutubeId(youtubeUrl);
    if (!videoId) {
      toast({
        title: 'Ошибка',
        description: 'Неверная ссылка YouTube',
        variant: 'destructive'
      });
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
    toast({
      title: 'Добавлено',
      description: 'YouTube трек добавлен в библиотеку'
    });
  };

  const addToLibrary = (iTunesTrack: iTunesTrack) => {
    const newTrack: Track = {
      id: iTunesTrack.trackId.toString(),
      title: iTunesTrack.trackName,
      artist: iTunesTrack.artistName,
      url: iTunesTrack.previewUrl,
      thumbnail: iTunesTrack.artworkUrl100,
      platform: 'itunes',
      duration: Math.floor(iTunesTrack.trackTimeMillis / 1000)
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

  const playPreview = (track: Track) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    if (currentTrack?.id === track.id && isPlaying) {
      setIsPlaying(false);
      setCurrentTrack(null);
      return;
    }

    if (track.url && track.platform === 'itunes') {
      const audio = new Audio(track.url);
      audio.play();
      setCurrentAudio(audio);
      setCurrentTrack(track);
      setIsPlaying(true);
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTrack(null);
      };
    } else if (track.platform === 'youtube') {
      window.open(track.url, '_blank');
    }
  };

  const removeTrack = (id: string) => {
    setTracks(tracks.filter(t => t.id !== id));
    if (currentTrack?.id === id) {
      if (currentAudio) {
        currentAudio.pause();
      }
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
            <Tabs defaultValue="itunes" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="itunes">iTunes</TabsTrigger>
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
              </TabsList>
              
              <TabsContent value="itunes" className="mt-6 space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Поиск треков на iTunes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchITunes()}
                  />
                  <Button onClick={searchITunes} disabled={loading}>
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

                {!loading && iTunesTracks.length > 0 && (
                  <div className="space-y-3">
                    {iTunesTracks.map(track => (
                      <div key={track.trackId} className="flex items-center gap-4 p-3 bg-card border rounded-lg hover:bg-accent transition-colors">
                        {track.artworkUrl100 ? (
                          <img src={track.artworkUrl100} alt="" className="w-14 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-14 h-14 bg-primary/10 rounded flex items-center justify-center">
                            <Icon name="Music2" className="text-primary" size={24} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{track.trackName}</p>
                          <p className="text-sm text-muted-foreground truncate">{track.artistName}</p>
                          {track.trackTimeMillis > 0 && (
                            <p className="text-xs text-muted-foreground">{formatDuration(Math.floor(track.trackTimeMillis / 1000))}</p>
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

                {!loading && iTunesTracks.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Music2" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Используйте поиск или загрузите популярные треки</p>
                  </div>
                )}

                {tracks.filter(t => t.platform === 'itunes').length > 0 && (
                  <>
                    <div className="border-t pt-4 mt-6">
                      <h3 className="text-lg font-semibold mb-3">Моя библиотека</h3>
                    </div>
                    <div className="space-y-3">
                      {tracks.filter(t => t.platform === 'itunes').map(track => (
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
                            {track.duration && (
                              <p className="text-xs text-muted-foreground">{formatDuration(track.duration)}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => playPreview(track)}
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
                  </>
                )}
              </TabsContent>

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

                {tracks.filter(t => t.platform === 'youtube').length > 0 ? (
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
                            onClick={() => playPreview(track)}
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
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Youtube" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Добавьте YouTube видео, чтобы начать</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Music;
