import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { logout, getCurrentUser } from '@/lib/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/feed" className="flex items-center gap-2">
                <Icon name="Zap" className="text-primary" size={32} />
                <span className="text-xl font-bold text-primary">СоцСеть</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link to="/feed" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <Icon name="Home" size={20} />
                  Главная
                </Link>
                <Link to="/friends" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <Icon name="Users" size={20} />
                  Друзья
                </Link>
                <Link to="/messages" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <Icon name="MessageCircle" size={20} />
                  Сообщения
                </Link>
                <Link to="/music" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <Icon name="Music" size={20} />
                  Музыка
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user?.username}</span>
                </Button>
              </Link>

              <Link to="/settings">
                <Button variant="ghost" size="icon">
                  <Icon name="Settings" size={20} />
                </Button>
              </Link>

              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <Icon name="LogOut" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 СоцСеть. Все права защищены.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
