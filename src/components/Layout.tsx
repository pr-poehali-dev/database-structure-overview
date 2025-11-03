import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { logout, getCurrentUser } from '@/lib/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/feed', icon: 'Home', label: 'Главная' },
    { to: '/profile', icon: 'User', label: 'Профиль' },
    { to: '/friends', icon: 'Users', label: 'Друзья' },
    { to: '/messages', icon: 'MessageCircle', label: 'Сообщения' },
    { to: '/music', icon: 'Music', label: 'Музыка' },
    { to: '/settings', icon: 'Settings', label: 'Настройки' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r bg-card fixed h-screen flex flex-col">
        <div className="p-6 border-b">
          <Link to="/feed" className="flex items-center gap-2">
            <Icon name="Zap" className="text-primary" size={32} />
            <span className="text-xl font-bold text-primary">СоцСеть</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.to} to={item.to}>
              <Button
                variant={isActive(item.to) ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
              >
                <Icon name={item.icon as any} size={20} />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link to="/profile">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{user?.username}</span>
            </Button>
          </Link>
          
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
            <Icon name="LogOut" size={20} />
            Выйти
          </Button>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>

        <footer className="border-t bg-card mt-12">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>&copy; 2025 СоцСеть. Все права защищены.</p>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;