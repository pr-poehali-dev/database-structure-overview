import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Friends = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Users" className="text-primary" />
              Мои друзья
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="UserPlus" size={48} className="mx-auto mb-4 opacity-50" />
              <p>У вас пока нет друзей</p>
              <p className="text-sm mt-2">Найдите интересных людей и добавьте их в друзья</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Friends;
