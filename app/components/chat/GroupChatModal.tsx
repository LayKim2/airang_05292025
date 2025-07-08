"use client"
import { useState, useEffect, useRef } from "react";
import { X, Send, Users, MessageCircle, Crown, User, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUserProfile } from '@/app/lib/useUserProfile';
import { useTranslation } from "@/app/i18n/useTranslation";

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userGroups: any[];
  selectedGroup: any;
  onGroupSelect: (group: any) => void;
  onGroupLeave: (groupId: number) => void;
}

export default function GroupChatModal({ isOpen, onClose, userGroups, selectedGroup, onGroupSelect, onGroupLeave }: GroupChatModalProps) {
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 메시지 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 폴링으로 새 메시지 확인 (백업 메커니즘)
  const checkNewMessages = async () => {
    if (!chatRoomId) return;
    
    if (!lastMessageId) {
      // lastMessageId가 없으면 전체 메시지를 다시 로드
      try {
        const { data: allMessages, error } = await supabase
          .from('group_chat_messages')
          .select(`
            *,
            users:user_id (
              clerk_user_id,
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('chat_room_id', chatRoomId)
          .order('created_at', { ascending: true });

        if (!error && allMessages && allMessages.length > 0) {
          setMessages(allMessages);
          setLastMessageId(Math.max(...allMessages.map(m => m.id)));
        }
      } catch (error) {
        console.error('폴링: 전체 메시지 로드 실패:', error);
      }
      return;
    }

    try {
      const { data: newMessages, error } = await supabase
        .from('group_chat_messages')
        .select(`
          *,
          users:user_id (
            clerk_user_id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('chat_room_id', chatRoomId)
        .gt('id', lastMessageId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('폴링: 쿼리 오류:', error);
        return;
      }

      if (newMessages && newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
        setLastMessageId(Math.max(...newMessages.map(m => m.id)));
      }
    } catch (error) {
      console.error('폴링 중 오류:', error);
    }
  };

  // 채팅방 및 메시지 로드
  useEffect(() => {
    if (!isOpen || !selectedGroup?.id) return;
    
    const loadChatData = async () => {
      setLoading(true);
      
      try {
        // 1. 채팅방 생성 또는 가져오기
        let { data: chatRoom, error: chatRoomError } = await supabase
          .from('group_chat_rooms')
          .select('*')
          .eq('group_id', selectedGroup.id)
          .single();
        
        if (chatRoomError && chatRoomError.code === 'PGRST116') {
          // 채팅방이 없으면 생성
          const { data: newChatRoom, error: createError } = await supabase
            .from('group_chat_rooms')
            .insert({ group_id: selectedGroup.id })
            .select()
            .single();
          
          if (createError) throw createError;
          chatRoom = newChatRoom;
        } else if (chatRoomError) {
          throw chatRoomError;
        }

        // 채팅방 ID 저장
        if (chatRoom) {
          setChatRoomId(chatRoom.id);
        }

        // 2. 메시지 로드
        if (chatRoom) {
          const { data: messagesData, error: messagesError } = await supabase
            .from('group_chat_messages')
            .select(`
              *,
              users:user_id (
                clerk_user_id,
                first_name,
                last_name,
                avatar_url
              )
            `)
            .eq('chat_room_id', chatRoom.id)
            .order('created_at', { ascending: true });
          
          if (messagesError) throw messagesError;
          setMessages(messagesData || []);
          setLastMessageId(Math.max(...(messagesData || []).map(m => m.id)));
        }

        // 3. 멤버 목록 로드
        const { data: membersData, error: membersError } = await supabase
          .from('group_members')
          .select(`
            *,
            users:user_id (
              clerk_user_id,
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('group_id', selectedGroup.id)
          .order('created_at', { ascending: true });
        
        if (membersError) throw membersError;
        setMembers(membersData || []);

      } catch (error) {
        console.error('채팅 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatData();
  }, [isOpen, selectedGroup?.id]);

  // 실시간 메시지 구독
  useEffect(() => {
    if (!isOpen || !chatRoomId) return;
    
    let subscription: any = null;
    let isMounted = true;
    let realtimeFailed = false;
    let realtimeTimeout: NodeJS.Timeout | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const setupRealtime = async () => {
      try {
        // 더 안정적인 실시간 구독 방식
        subscription = supabase
          .channel(`group_chat_${chatRoomId}`)
          .on(
            'postgres_changes',
            {
              event: '*', // 모든 이벤트 수신
              schema: 'public',
              table: 'group_chat_messages',
              filter: `chat_room_id=eq.${chatRoomId}`,
            },
            async (payload) => {
              if (!isMounted) return;
              
              // INSERT 이벤트만 처리
              if (payload.eventType === 'INSERT' && payload.new) {
                // 실시간으로 메시지를 받았으므로 타임아웃 취소
                if (realtimeTimeout) {
                  clearTimeout(realtimeTimeout);
                  realtimeTimeout = null;
                }
                
                // 중복 메시지 방지
                setMessages(prev => {
                  const messageExists = prev.some(msg => msg.id === payload.new.id);
                  if (messageExists) {
                    return prev;
                  }
                  
                  return [...prev, payload.new];
                });
                
                // 사용자 정보가 없는 경우에만 추가로 가져오기
                if (!payload.new.users) {
                  try {
                    const { data: userData, error: userError } = await supabase
                      .from('users')
                      .select('clerk_user_id, first_name, last_name, avatar_url')
                      .eq('clerk_user_id', payload.new.user_id)
                      .single();
                    
                    if (!userError && userData) {
                      setMessages(prev => prev.map(msg => 
                        msg.id === payload.new.id 
                          ? { ...msg, users: userData }
                          : msg
                      ));
                    }
                  } catch (error) {
                    console.error('사용자 정보 가져오기 실패:', error);
                  }
                }
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              realtimeFailed = false;
              
              // 실시간 구독이 성공해도 5초 후 폴링으로 전환 (더 빠른 전환)
              realtimeTimeout = setTimeout(() => {
                startPolling();
              }, 5000);
            } else if (status === 'CHANNEL_ERROR') {
              console.error('실시간 구독 오류 발생');
              realtimeFailed = true;
              startPolling();
            } else if (status === 'TIMED_OUT') {
              console.error('실시간 구독 시간 초과 - 재연결 시도');
              realtimeFailed = true;
              
              // 3초 후 재연결 시도
              reconnectTimeout = setTimeout(() => {
                if (isMounted) {
                  console.log('실시간 구독 재연결 시도...');
                  setupRealtime();
                }
              }, 3000);
              
              // 재연결 실패 시 폴링으로 전환
              setTimeout(() => {
                if (realtimeFailed) {
                  startPolling();
                }
              }, 10000);
            } else if (status === 'CLOSED') {
              if (!realtimeFailed) {
                startPolling();
              }
            }
          });

      } catch (error) {
        console.error('실시간 구독 설정 실패:', error);
        realtimeFailed = true;
        startPolling();
      }
    };

    // 폴링 시작 함수
    const startPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      pollingIntervalRef.current = setInterval(() => {
        checkNewMessages();
      }, 2000); // 더 빠른 폴링
    };

    setupRealtime();

    return () => {
      isMounted = false;
      if (subscription) {
        supabase.removeChannel(subscription);
      }
      if (realtimeTimeout) {
        clearTimeout(realtimeTimeout);
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isOpen, chatRoomId]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !profile?.clerk_user_id || !chatRoomId) return;

    try {
      // 메시지 전송
      const { data: messageData, error: messageError } = await supabase
        .from('group_chat_messages')
        .insert({
          chat_room_id: chatRoomId,
          user_id: profile.clerk_user_id,
          message: newMessage.trim()
        })
        .select(`
          *,
          users:user_id (
            clerk_user_id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .single();

      if (messageError) throw messageError;

      // 로컬 상태 업데이트 (즉시 화면에 표시)
      setMessages(prev => [...prev, messageData]);
      setNewMessage("");
      setLastMessageId(messageData.id); // 새 메시지가 추가되면 폴링 범위 업데이트

    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 그룹 나가기 핸들러
  const handleLeaveGroup = async () => {
    if (!profile?.clerk_user_id || !selectedGroup?.id) return;

    // 확인 다이얼로그
    if (!confirm(`"${selectedGroup.title}" 그룹에서 나가시겠습니까?`)) {
      return;
    }

    try {
      // group_members에서 사용자 삭제
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', selectedGroup.id)
        .eq('user_id', profile.clerk_user_id);

      if (error) {
        console.error('그룹 나가기 실패:', error);
        return;
      }

      // 부모 컴포넌트에 그룹 나가기 알림
      onGroupLeave(selectedGroup.id);
      
    } catch (error) {
      console.error('그룹 나가기 실패:', error);
    }
  };

  // 그룹 삭제 핸들러 (리더만)
  const handleDeleteGroup = async () => {
    if (!profile?.clerk_user_id || !selectedGroup?.id) return;

    // 확인 다이얼로그
    if (!confirm(`"${selectedGroup.title}" 그룹을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      // 그룹 삭제 (CASCADE로 인해 관련 데이터도 자동 삭제)
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', selectedGroup.id)
        .eq('user_id', profile.clerk_user_id); // 리더만 삭제 가능

      if (error) {
        console.error('그룹 삭제 실패:', error);
        return;
      }

      // 부모 컴포넌트에 그룹 삭제 알림
      onGroupLeave(selectedGroup.id);
      
    } catch (error) {
      console.error('그룹 삭제 실패:', error);
    }
  };

  // 멤버 내보내기 핸들러 (리더만)
  const handleKickMember = async (memberUserId: string, memberName: string) => {
    if (!profile?.clerk_user_id || !selectedGroup?.id) return;

    // 확인 다이얼로그
    if (!confirm(`"${memberName}"님을 그룹에서 내보내시겠습니까?`)) {
      return;
    }

    try {
      // group_members에서 해당 멤버 삭제
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', selectedGroup.id)
        .eq('user_id', memberUserId);

      if (error) {
        console.error('멤버 내보내기 실패:', error);
        return;
      }

      // 멤버 목록 새로고침
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select(`
          *,
          users:user_id (
            clerk_user_id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('group_id', selectedGroup.id)
        .order('created_at', { ascending: true });
      
      if (!membersError) {
        setMembers(membersData || []);
      }
      
    } catch (error) {
      console.error('멤버 내보내기 실패:', error);
    }
  };

  if (!isOpen) return null;

  // 그룹이 없을 때 메시지 표시
  if (userGroups.length === 0) {
    return (
      <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">그룹 채팅</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="text-gray-600 mb-6">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">그룹에 참여해주세요</p>
            <p className="text-sm">채팅을 사용하려면 먼저 그룹에 가입해야 합니다.</p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-violet-500 text-white rounded-full hover:bg-violet-600 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[85vh] max-h-[900px] flex overflow-hidden">
        {/* 왼쪽: 그룹 리스트 */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* 헤더 */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">그룹 채팅</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {userGroups.length}개 그룹 참여 중
            </div>
          </div>

          {/* 그룹 리스트 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {userGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => onGroupSelect(group)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedGroup?.id === group.id
                      ? 'bg-violet-100 border-2 border-violet-300'
                      : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* 그룹 이미지 */}
                    {group.image_url ? (
                      <img
                        src={group.image_url}
                        alt={group.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-violet-600" />
                      </div>
                    )}
                    
                    {/* 그룹 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {group.title}
                        </h3>
                        {group.role === 'leader' && (
                          <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {group.description?.replace(/<[^>]+>/g, '').slice(0, 30)}...
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(group.joined_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* 선택 표시 */}
                    {selectedGroup?.id === group.id && (
                      <ChevronRight className="w-5 h-5 text-violet-600 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 채팅 영역 */}
        <div className="flex-1 flex flex-col">
          {selectedGroup ? (
            <>
              {/* 채팅 헤더 */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedGroup.image_url ? (
                      <img
                        src={selectedGroup.image_url}
                        alt={selectedGroup.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-violet-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedGroup.title}</h3>
                      <div className="text-sm text-gray-500">
                        {members.length}명 참여 중
                      </div>
                    </div>
                  </div>
                  
                  {/* 그룹 나가기/삭제 버튼 */}
                  {selectedGroup.role === 'leader' ? (
                    <button
                      onClick={handleDeleteGroup}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="그룹 삭제"
                    >
                      그룹 삭제
                    </button>
                  ) : (
                    <button
                      onClick={handleLeaveGroup}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="그룹 나가기"
                    >
                      나가기
                    </button>
                  )}
                </div>
              </div>

              {/* 메시지 영역 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="text-center text-gray-500">채팅을 불러오는 중...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500">아직 메시지가 없습니다.</div>
                ) : (
                  messages.map((message) => {
                    const isMyMessage = message.user_id === profile?.clerk_user_id;
                    const isSystemMessage = message.message_type === 'system';
                    
                    // 시스템 메시지 렌더링
                    if (isSystemMessage) {
                      return (
                        <div key={message.id} className="flex justify-center my-2">
                          <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full border border-gray-200">
                            <span className="text-gray-500">💬</span> {message.message}
                          </div>
                        </div>
                      );
                    }
                    
                    // 일반 사용자 메시지 렌더링
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isMyMessage ? 'flex-row-reverse' : ''}`}
                      >
                        {/* 프로필 이미지 */}
                        <div className="flex-shrink-0">
                          {message.users?.avatar_url ? (
                            <img
                              src={message.users.avatar_url}
                              alt={`${message.users.first_name} ${message.users.last_name}`}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-sm font-semibold text-violet-600">
                              {message.users?.first_name?.[0] || 'U'}
                            </div>
                          )}
                        </div>

                        {/* 메시지 */}
                        <div className={`max-w-xs ${isMyMessage ? 'text-right' : ''}`}>
                          <div className={`inline-block p-3 rounded-2xl ${
                            isMyMessage 
                              ? 'bg-violet-500 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="text-sm">{message.message}</div>
                          </div>
                          <div className={`text-xs text-gray-500 mt-1 ${
                            isMyMessage ? 'text-right' : 'text-left'
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 메시지 입력 */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-violet-500 text-white rounded-full hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">그룹을 선택해주세요</p>
                <p className="text-sm">채팅을 보려면 왼쪽에서 그룹을 선택하세요.</p>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽: 멤버 목록 */}
        {selectedGroup && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            {/* 멤버 헤더 */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">멤버 목록</h3>
            </div>

            {/* 멤버 목록 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.user_id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {member.users?.avatar_url ? (
                          <img
                            src={member.users.avatar_url}
                            alt={`${member.users.first_name} ${member.users.last_name}`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-sm font-semibold text-violet-600">
                            {member.users?.first_name?.[0] || 'U'}
                          </div>
                        )}
                        {member.role === 'leader' && (
                          <Crown className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {member.users?.first_name} {member.users?.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {member.role === 'leader' ? '리더' : '멤버'}
                        </div>
                      </div>
                    </div>
                    
                    {/* 리더만 다른 멤버 내보내기 */}
                    {selectedGroup.role === 'leader' && member.user_id !== profile?.clerk_user_id && (
                      <button
                        onClick={() => handleKickMember(
                          member.user_id, 
                          `${member.users?.first_name} ${member.users?.last_name}`
                        )}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="내보내기"
                      >
                        내보내기
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 