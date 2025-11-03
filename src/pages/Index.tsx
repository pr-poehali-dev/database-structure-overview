import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/feed');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Icon name="Zap" className="text-primary mx-auto mb-8" size={80} />
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
          Добро пожаловать в СоцСеть
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Общайтесь с друзьями, делитесь моментами жизни, слушайте музыку вместе
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">
              <Icon name="UserPlus" className="mr-2" />
              Регистрация
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Icon name="LogIn" className="mr-2" />
              Вход
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-card rounded-lg border">
            <Icon name="Users" className="text-primary mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Находите друзей</h3>
            <p className="text-muted-foreground">
              Добавляйте друзей и следите за их жизнью
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-lg border">
            <Icon name="MessageCircle" className="text-primary mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Общайтесь</h3>
            <p className="text-muted-foreground">
              Делитесь постами, фото и видео с друзьями
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-lg border">
            <Icon name="Music" className="text-primary mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Слушайте музыку</h3>
            <p className="text-muted-foreground">
              Интеграция с YouTube и Яндекс.Музыкой
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;