import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Music = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

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
              
              <TabsContent value="youtube" className="mt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="Youtube" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Добавьте видео с YouTube</p>
                  <p className="text-sm mt-2">Создавайте плейлисты и делитесь музыкой</p>
                </div>
              </TabsContent>
              
              <TabsContent value="yandex" className="mt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="Music2" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Добавьте треки из Яндекс.Музыки</p>
                  <p className="text-sm mt-2">Ваша музыкальная коллекция</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Music;
