import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Settings = () => {
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
              <Icon name="Settings" className="text-primary" />
              Настройки
            </CardTitle>
            <CardDescription>
              Управляйте настройками вашего аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Профиль</h3>
                <p className="text-sm text-muted-foreground">
                  Изменение имени, фото профиля и биографии
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Приватность</h3>
                <p className="text-sm text-muted-foreground">
                  Управление видимостью профиля и постов
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Уведомления</h3>
                <p className="text-sm text-muted-foreground">
                  Настройка уведомлений о новых сообщениях и активности
                </p>
              </div>
              
              <div className="pb-4">
                <h3 className="font-medium mb-2">Безопасность</h3>
                <p className="text-sm text-muted-foreground">
                  Изменение пароля и настройки безопасности
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
