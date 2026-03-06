import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockConversations, mockMessages, mockUsers } from '@/data/mockData';
import { format } from 'date-fns';
import { Search, Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Messages() {
  const [selectedConv, setSelectedConv] = useState<string | null>(mockConversations[0]?.participantId || null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentUserId = 'user-4';
  const conversations = mockConversations.map(c => ({ ...c, participant: mockUsers.find(u => u.id === c.participantId) }));
  const filteredConvs = conversations.filter(c => c.participant?.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const messages = mockMessages.filter(m => (m.senderId === selectedConv && m.receiverId === currentUserId) || (m.senderId === currentUserId && m.receiverId === selectedConv)).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const selectedUser = mockUsers.find(u => u.id === selectedConv);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setNewMessage('');
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Layout showFooter={false}>
      <div className="container py-6 h-[calc(100vh-4rem)]">
        <div className="grid md:grid-cols-3 gap-4 h-full">
          {/* Contacts */}
          <Card className="md:col-span-1 flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search contacts..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredConvs.map(conv => (
                <div key={conv.id} onClick={() => setSelectedConv(conv.participantId)} className={cn('flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-colors border-b', selectedConv === conv.participantId && 'bg-muted')}>
                  <Avatar><AvatarFallback className="bg-primary text-primary-foreground text-sm">{conv.participant && getInitials(conv.participant.name)}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{conv.participant?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{conv.participant?.department}</p>
                  </div>
                  {conv.unreadCount > 0 && <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{conv.unreadCount}</div>}
                </div>
              ))}
            </ScrollArea>
          </Card>

          {/* Chat */}
          <Card className="md:col-span-2 flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar><AvatarFallback className="bg-primary text-primary-foreground">{getInitials(selectedUser.name)}</AvatarFallback></Avatar>
                  <div><p className="font-medium">{selectedUser.name}</p><p className="text-sm text-muted-foreground">{selectedUser.department}</p></div>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className={cn('flex', msg.senderId === currentUserId ? 'justify-end' : 'justify-start')}>
                        <div className={cn('max-w-[70%] rounded-lg px-4 py-2', msg.senderId === currentUserId ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={cn('text-xs mt-1', msg.senderId === currentUserId ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{format(new Date(msg.createdAt), 'h:mm a')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t flex gap-2">
                  <Input placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                  <Button onClick={handleSend}><Send className="h-4 w-4" /></Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center"><MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-30" /><p>Select a conversation</p></div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
