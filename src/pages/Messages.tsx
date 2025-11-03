import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  sender_id: string;
  sender_name: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  online: boolean;
}

const Messages = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [chats] = useState<Chat[]>([
    { id: '1', name: 'Анна Иванова', avatar: '', lastMessage: 'Привет! Как дела?', unread: 2, online: true },
    { id: '2', name: 'Дмитрий Петров', avatar: '', lastMessage: 'Увидимся завтра', unread: 0, online: false },
    { id: '3', name: 'Мария Сидорова', avatar: '', lastMessage: 'Отлично!', unread: 1, online: true }
  ]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedChat) {
      const mockMessages: Message[] = [
        {
          id: '1',
          text: 'Привет! Как дела?',
          sender_id: selectedChat.id,
          sender_name: selectedChat.name,
          timestamp: new Date(Date.now() - 3600000),
          isOwn: false
        },
        {
          id: '2',
          text: 'Отлично, спасибо! А у тебя?',
          sender_id: currentUser?.id || '0',
          sender_name: currentUser?.username || 'Вы',
          timestamp: new Date(Date.now() - 3000000),
          isOwn: true
        },
        {
          id: '3',
          text: 'Тоже хорошо! Что нового?',
          sender_id: selectedChat.id,
          sender_name: selectedChat.name,
          timestamp: new Date(Date.now() - 1800000),
          isOwn: false
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedChat, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender_id: currentUser?.id || '0',
      sender_name: currentUser?.username || 'Вы',
      timestamp: new Date(),
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)]">
        <Card className="h-full">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Icon name="MessageCircle" className="text-primary" />
              Личные сообщения
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-5rem)]">
            <div className="grid grid-cols-12 h-full">
              <div className="col-span-12 md:col-span-4 border-r">
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-1">
                    {chats.map(chat => (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedChat?.id === chat.id ? 'bg-primary/10' : 'hover:bg-accent'
                        }`}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={chat.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {chat.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {chat.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-medium truncate">{chat.name}</p>
                            {chat.unread > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="col-span-12 md:col-span-8 flex flex-col">
                {selectedChat ? (
                  <>
                    <div className="p-4 border-b flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedChat.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {selectedChat.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedChat.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedChat.online ? 'В сети' : 'Не в сети'}
                        </p>
                      </div>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] space-y-1`}>
                              {!msg.isOwn && (
                                <p className="text-xs text-muted-foreground px-3">{msg.sender_name}</p>
                              )}
                              <div
                                className={`p-3 rounded-2xl ${
                                  msg.isOwn
                                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                                    : 'bg-accent rounded-bl-sm'
                                }`}
                              >
                                <p>{msg.text}</p>
                              </div>
                              <p className="text-xs text-muted-foreground px-3">
                                {formatTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    <div className="p-4 border-t">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          sendMessage();
                        }}
                        className="flex gap-2"
                      >
                        <Input
                          placeholder="Написать сообщение..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit">
                          <Icon name="Send" />
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Выберите чат для начала общения</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Messages;