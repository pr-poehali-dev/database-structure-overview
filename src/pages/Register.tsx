import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { setAuthToken, setCurrentUser } from '@/lib/auth';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    age_confirmed: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.age_confirmed) {
      toast({
        title: 'Ошибка',
        description: 'Вы должны подтвердить, что вам есть 16 лет',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/7747eac9-eecb-412c-8ff9-438520bc353e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации');
      }

      const loginResponse = await fetch('https://functions.poehali.dev/d9589d01-148c-40a0-9cec-ffe2d964ccea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: formData.username,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        setAuthToken(loginData.session_token);
        setCurrentUser(loginData.user);
        toast({
          title: 'Успешно!',
          description: 'Регистрация завершена',
        });
        navigate('/feed');
      } else {
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Произошла ошибка',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Регистрация</h1>
          <p className="text-muted-foreground">Создайте аккаунт в социальной сети</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg border">
          <div className="space-y-2">
            <Label htmlFor="username">Имя пользователя *</Label>
            <Input
              id="username"
              type="text"
              required
              minLength={3}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль *</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Минимум 8 символов, цифры, заглавные и строчные буквы
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_name">Имя</Label>
            <Input
              id="first_name"
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Фамилия</Label>
            <Input
              id="last_name"
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="bg-background"
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="age_confirmed"
              checked={formData.age_confirmed}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, age_confirmed: checked as boolean })
              }
            />
            <Label htmlFor="age_confirmed" className="text-sm leading-tight cursor-pointer">
              Я подтверждаю, что мне есть 16 лет, я прочитал(а) и соглашаюсь с{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Правилами пользования и Политикой конфиденциальности
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
