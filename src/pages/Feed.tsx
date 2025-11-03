import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Feed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Edit" className="text-primary" />
              Создать пост
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Что у вас нового?
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Лента новостей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Rss" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Здесь будут отображаться посты от ваших друзей</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Feed;
