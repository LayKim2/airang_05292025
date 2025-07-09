"use client"
import { useState, useEffect, useRef } from "react";
import { X, Send, Users, MessageCircle, Crown, User, ChevronRight, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUserProfile } from '@/app/lib/useUserProfile';
import { useTranslation } from "@/app/i18n/useTranslation";
import { ChatMessage, SystemMessageCode, SystemMessageParams, GroupMember } from "@/app/types";

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
  const [showMembers, setShowMembers] = useState(false); // 모바일에서 멤버 목록 표시 여부
  const [showGroups, setShowGroups] = useState(false); // 모바일에서 그룹 목록 표시 여부
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 메시지 자동 스크롤
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // PC에서 강제 스크롤
    const messageContainer = document.querySelector('.message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  };

  // 메시지 변경 시 스크롤 (통합)
  useEffect(() => {
    if (!loading && messages.length > 0) {
      // DOM 렌더링 완료 후 스크롤
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, loading]);

  // 모달 열림/닫힘에 따른 배경 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      // 모달이 열리면 body 스크롤 막기
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // 스크롤바 사라짐으로 인한 레이아웃 시프트 방지
    } else {
      // 모달이 닫히면 body 스크롤 복원
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

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
    if (!confirm(`${t('chat.leaveConfirm')}`)) {
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
    if (!confirm(`${t('chat.deleteConfirm')}`)) {
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
    if (!confirm(`${t('chat.kickConfirm')}`)) {
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
            <h2 className="text-xl font-bold text-gray-900">{t('chat.title')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="text-gray-600 mb-6">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">{t('chat.noGroups')}</p>
            <p className="text-sm">{t('chat.noGroupsDesc')}</p>
          </div>
          <button
            onClick={() => {
              onClose();
              window.location.href = '/match/groups';
            }}
            className="px-6 py-2 bg-violet-500 text-white rounded-full hover:bg-violet-600 transition-colors"
          >
            {t('groups.registerButton')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50">
      {/* PC 버전 (lg 이상) */}
      <div className="hidden lg:flex bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[85vh] max-h-[900px] overflow-hidden">
        {/* 왼쪽: 그룹 리스트 */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* 헤더 */}
          <div className="p-6 border-b border-gray-200">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t('chat.title')}</h2>
            </div>
            <div className="text-sm text-gray-600">
              {userGroups.length} {t('chat.groupsParticipating')}
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

          {/* 모임 나가기/삭제 버튼 */}
          {selectedGroup && (
            <div className="p-4 border-t border-gray-200">
              {selectedGroup.role === 'leader' ? (
                <button
                  onClick={handleDeleteGroup}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                  title={t('button.delete')}
                >
                  {t('button.delete')}
                </button>
              ) : (
                <button
                  onClick={handleLeaveGroup}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                  title={t('button.leave')}
                >
                  {t('button.leave')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* 중앙: 채팅 영역 */}
        <div className="flex-1 flex flex-col" style={{ minHeight: '0' }}>
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
                        {members.length}{t('chat.participating')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* 멤버 목록 토글 버튼 */}
                    <button
                      onClick={() => setShowMembers(!showMembers)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('chat.toggleMembers')}
                    >
                      <Users className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    
                    {/* 닫기 버튼 */}
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('button.close')}
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 메시지 영역 */}
              <div 
                className="message-container flex-1 overflow-y-auto p-4 space-y-4"
                style={{ 
                  minHeight: '0',
                  maxHeight: 'calc(100vh - 200px)',
                  height: '100%'
                }}
              >
                {loading ? (
                  <div className="text-center text-gray-500">{t('chat.loading')}</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500">{t('chat.noMessages')}</div>
                ) : (
                  messages.map((message) => {
                    const isMyMessage = message.user_id === profile?.clerk_user_id;
                    const isSystemMessage = message.message_type === 'system';
                    
                    // 시스템 메시지 렌더링 (system_message_code와 system_message_params 활용)
                    if (isSystemMessage) {
                      const systemCode = message.system_message_code;
                      const systemParams = message.system_message_params;
                      
                      // 시스템 메시지 코드별 아이콘과 스타일 결정
                      const getSystemMessageStyle = (code: string) => {
                        switch (code) {
                          case 'MEMBER_JOIN':
                            return {
                              icon: '👋',
                              bgColor: 'bg-green-50',
                              textColor: 'text-green-700',
                              borderColor: 'border-green-200'
                            };
                          case 'MEMBER_LEAVE':
                            return {
                              icon: '👋',
                              bgColor: 'bg-orange-50',
                              textColor: 'text-orange-700',
                              borderColor: 'border-orange-200'
                            };
                          default:
                            return {
                              icon: '💬',
                              bgColor: 'bg-gray-50',
                              textColor: 'text-gray-600',
                              borderColor: 'border-gray-200'
                            };
                        }
                      };
                      
                      // 다국어 지원 시스템 메시지 생성
                      const getSystemMessageText = (code: string, params: any) => {
                        if (!code || !params) return message.message; // fallback to original message
                        
                        try {
                          // 간단한 문자열 치환 함수
                          const replaceParams = (template: string, params: any) => {
                            return template.replace(/\{(\w+)\}/g, (match, key) => {
                              return params[key] || match;
                            });
                          };
                          
                          switch (code) {
                            case 'MEMBER_JOIN':
                              const joinTemplate = t('chat.systemMessages.memberJoin');
                              return replaceParams(joinTemplate, { userName: params.user_name || 'Unknown User' });
                            case 'MEMBER_LEAVE':
                              const leaveTemplate = t('chat.systemMessages.memberLeave');
                              return replaceParams(leaveTemplate, { userName: params.user_name || 'Unknown User' });
                            default:
                              return message.message; // fallback
                          }
                        } catch (error) {
                          console.error('System message translation error:', error);
                          return message.message; // fallback
                        }
                      };
                      
                      const style = getSystemMessageStyle(systemCode);
                      const translatedMessage = getSystemMessageText(systemCode as SystemMessageCode, systemParams as SystemMessageParams);
                      
                      return (
                        <div key={message.id} className="flex justify-center my-2">
                          <div className={`${style.bgColor} ${style.textColor} text-sm px-4 py-2 rounded-full border ${style.borderColor}`}>
                            <span className="mr-2">{style.icon}</span> {translatedMessage}
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
                    placeholder={t('chat.messagePlaceholder')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-violet-500 text-white rounded-full hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={t('button.send')}
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
                <p className="text-lg font-medium mb-2">{t('chat.selectGroup')}</p>
                <p className="text-sm">{t('chat.selectGroupDesc')}</p>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽: 멤버 목록 */}
        {selectedGroup && showMembers && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            {/* 멤버 헤더 */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">{t('chat.membersTitle')}</h3>
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
                          {member.role === 'leader' ? t('chat.leader') : t('chat.member')}
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
                        title={t('button.kick')}
                      >
                        {t('button.kick')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 모바일 버전 (lg 미만) */}
      <div 
        className="lg:hidden bg-white rounded-2xl shadow-2xl w-[95%] h-[90%] max-w-md mx-auto flex flex-col overflow-hidden touch-pan-y" 
        style={{ 
          maxHeight: '100vh',
          position: 'fixed',
          top: '5%',
          left: '2.5%',
          right: '2.5%',
          bottom: '5%',
          zIndex: 3001
        }}
      >
        {/* 모바일 헤더 */}
        <div className="p-3 border-b border-gray-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGroups(!showGroups)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t('chat.title')}</h2>
              <div className="text-xs text-gray-500">
                {userGroups.length} {t('chat.groupsParticipating')}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 모바일 그룹 리스트 (토글) */}
        {showGroups && (
          <div 
            className="bg-gray-50 border-b border-gray-200 max-h-64 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="p-4 space-y-2">
              {userGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => {
                    onGroupSelect(group);
                    setShowGroups(false);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedGroup?.id === group.id
                      ? 'bg-violet-100 border-2 border-violet-300'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {group.image_url ? (
                      <img
                        src={group.image_url}
                        alt={group.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-violet-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {group.title}
                        </h3>
                        {group.role === 'leader' && (
                          <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {group.description?.replace(/<[^>]+>/g, '').slice(0, 20)}...
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 모바일 모임 나가기/삭제 버튼 */}
            {selectedGroup && (
              <div className="p-4 border-t border-gray-200">
                {selectedGroup.role === 'leader' ? (
                  <button
                    onClick={handleDeleteGroup}
                    className="w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                    title={t('button.delete')}
                  >
                    {t('button.delete')}
                  </button>
                ) : (
                  <button
                    onClick={handleLeaveGroup}
                    className="w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                    title={t('button.leave')}
                  >
                    {t('button.leave')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 모바일 채팅 영역 */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedGroup ? (
            <>
              {/* 채팅 헤더 */}
              <div className="p-3 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {selectedGroup.image_url ? (
                      <img
                        src={selectedGroup.image_url}
                        alt={selectedGroup.title}
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-violet-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{selectedGroup.title}</h3>
                      <div className="text-xs text-gray-500">
                        {members.length}{t('chat.participating')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* 멤버 목록 토글 버튼 */}
                    <button
                      onClick={() => setShowMembers(!showMembers)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('chat.toggleMembers')}
                    >
                      <Users className="w-4 h-4 text-gray-600" />
                    </button>
                    
                  </div>
                </div>
              </div>

              {/* 멤버 목록 (모바일 토글) */}
              {showMembers && (
                <div 
                  className="bg-gray-50 border-b border-gray-200 max-h-48 overflow-y-auto overscroll-contain"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('chat.membersTitle')}</h4>
                    <div className="space-y-2">
                      {members.map((member) => (
                        <div key={member.user_id} className="flex items-center justify-between p-2 rounded-lg bg-white">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              {member.users?.avatar_url ? (
                                <img
                                  src={member.users.avatar_url}
                                  alt={`${member.users.first_name} ${member.users.last_name}`}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-xs font-semibold text-violet-600">
                                  {member.users?.first_name?.[0] || 'U'}
                                </div>
                              )}
                              {member.role === 'leader' && (
                                <Crown className="w-2 h-2 text-yellow-500 absolute -top-0.5 -right-0.5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {member.users?.first_name} {member.users?.last_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {member.role === 'leader' ? t('chat.leader') : t('chat.member')}
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
                              className="px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title={t('button.kick')}
                            >
                              {t('button.kick')}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 메시지 영역 */}
              <div 
                className="flex-1 overflow-y-auto p-3 space-y-3 overscroll-contain" 
                style={{ 
                  WebkitOverflowScrolling: 'touch',
                  minHeight: '0',
                  height: '100%',
                  maxHeight: 'calc(100vh - 200px)'
                }}
              >
                {loading ? (
                  <div className="text-center text-gray-500 text-sm">{t('chat.loading')}</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm">{t('chat.noMessages')}</div>
                ) : (
                  messages.map((message) => {
                    const isMyMessage = message.user_id === profile?.clerk_user_id;
                    const isSystemMessage = message.message_type === 'system';
                    
                    // 시스템 메시지 렌더링 (system_message_code와 system_message_params 활용)
                    if (isSystemMessage) {
                      const systemCode = message.system_message_code;
                      const systemParams = message.system_message_params;
                      
                      // 시스템 메시지 코드별 아이콘과 스타일 결정
                      const getSystemMessageStyle = (code: string) => {
                        switch (code) {
                          case 'MEMBER_JOIN':
                            return {
                              icon: '👋',
                              bgColor: 'bg-green-50',
                              textColor: 'text-green-700',
                              borderColor: 'border-green-200'
                            };
                          case 'MEMBER_LEAVE':
                            return {
                              icon: '👋',
                              bgColor: 'bg-orange-50',
                              textColor: 'text-orange-700',
                              borderColor: 'border-orange-200'
                            };
                          default:
                            return {
                              icon: '💬',
                              bgColor: 'bg-gray-50',
                              textColor: 'text-gray-600',
                              borderColor: 'border-gray-200'
                            };
                        }
                      };
                      
                      // 다국어 지원 시스템 메시지 생성
                      const getSystemMessageText = (code: SystemMessageCode | undefined, params: SystemMessageParams | undefined) => {
                        if (!code || !params) return message.message; // fallback to original message
                        
                        try {
                          // 간단한 문자열 치환 함수
                          const replaceParams = (template: string, params: SystemMessageParams) => {
                            return template.replace(/\{(\w+)\}/g, (match, key) => {
                              return params[key as keyof SystemMessageParams] || match;
                            });
                          };
                          
                          switch (code) {
                            case 'MEMBER_JOIN':
                              const joinTemplate = t('chat.systemMessages.memberJoin');
                              return replaceParams(joinTemplate, { userName: params.user_name || 'Unknown User' });
                            case 'MEMBER_LEAVE':
                              const leaveTemplate = t('chat.systemMessages.memberLeave');
                              return replaceParams(leaveTemplate, { userName: params.user_name || 'Unknown User' });
                            default:
                              return message.message; // fallback
                          }
                        } catch (error) {
                          console.error('System message translation error:', error);
                          return message.message; // fallback
                        }
                      };
                      
                      const style = getSystemMessageStyle(systemCode);
                      const translatedMessage = getSystemMessageText(systemCode as SystemMessageCode, systemParams as SystemMessageParams);
                      
                      return (
                        <div key={message.id} className="flex justify-center my-2">
                          <div className={`${style.bgColor} ${style.textColor} text-xs px-3 py-1.5 rounded-full border ${style.borderColor}`}>
                            <span className="mr-1">{style.icon}</span> {translatedMessage}
                          </div>
                        </div>
                      );
                    }
                    
                    // 일반 사용자 메시지 렌더링
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${isMyMessage ? 'flex-row-reverse' : ''}`}
                      >
                        {/* 프로필 이미지 */}
                        <div className="flex-shrink-0">
                          {message.users?.avatar_url ? (
                            <img
                              src={message.users.avatar_url}
                              alt={`${message.users.first_name} ${message.users.last_name}`}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-xs font-semibold text-violet-600">
                              {message.users?.first_name?.[0] || 'U'}
                            </div>
                          )}
                        </div>

                        {/* 메시지 */}
                        <div className={`max-w-[70%] ${isMyMessage ? 'text-right' : ''}`}>
                          <div className={`inline-block p-2.5 rounded-2xl ${
                            isMyMessage 
                              ? 'bg-violet-500 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="text-sm leading-relaxed">{message.message}</div>
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
              <div className="p-2 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                                      <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('chat.messagePlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                      style={{
                        fontSize: '16px', // iOS에서 자동 확대 방지
                        transform: 'translateZ(0)', // 하드웨어 가속
                        backgroundColor: '#ffffff', // 배경색 명시적 설정
                        color: '#000000', // 텍스트 색상 명시적 설정
                        WebkitAppearance: 'none', // iOS 기본 스타일 제거
                        MozAppearance: 'none', // Firefox 기본 스타일 제거
                        appearance: 'none' // 기본 스타일 제거
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="px-3 py-2 bg-violet-500 text-white rounded-full hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                      title={t('button.send')}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-base font-medium mb-2">{t('chat.selectGroup')}</p>
                <p className="text-sm">{t('chat.selectGroupMobile')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 