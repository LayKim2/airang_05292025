"use client"

import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from "@/lib/supabase";
import { useUserProfile } from '@/app/lib/useUserProfile';
import GlobalChatFab from "./GlobalChatFab";
import GroupChatModal from "./GroupChatModal";

// Chat Context 생성
interface ChatContextType {
  openChatWithGroup: (groupId: number) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Chat Hook
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export default function ChatProvider({ children }: ChatProviderProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const { profile } = useUserProfile();

  // URL 파라미터에서 채팅 열기 신호 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const shouldOpenChat = urlParams.get('openChat');
      const selectedGroupId = urlParams.get('selectedGroupId');
      
      if (shouldOpenChat === 'true' && selectedGroupId) {
        // URL 파라미터 제거
        const url = new URL(window.location.href);
        url.searchParams.delete('openChat');
        url.searchParams.delete('selectedGroupId');
        window.history.replaceState({}, '', url.toString());
        
        // 채팅 모달 열기
        setIsChatOpen(true);
        
        // 그룹 목록을 가져온 후 해당 그룹 선택
        fetchUserGroups().then(() => {
          const targetGroup = userGroups.find(group => group.id.toString() === selectedGroupId);
          if (targetGroup) {
            setSelectedGroup(targetGroup);
          }
        });
      }
    }
  }, []);

  // 사용자가 속한 모든 그룹 정보 가져오기
  const fetchUserGroups = async () => {
    if (!profile?.clerk_user_id) return;

    try {
      // 사용자가 속한 모든 그룹 정보 가져오기
      const { data: groupMembers, error } = await supabase
        .from('group_members')
        .select(`
          *,
          groups:group_id (
            id,
            title,
            description,
            created_at,
            image_url
          )
        `)
        .eq('user_id', profile.clerk_user_id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('그룹 정보 가져오기 실패:', error);
        return;
      }

      if (groupMembers && groupMembers.length > 0) {
        const groups = groupMembers.map((member: any) => ({
          ...member.groups,
          membership_id: member.id,
          joined_at: member.created_at,
          role: member.role || 'member'
        }));
        setUserGroups(groups);
        
        // 첫 번째 그룹을 기본 선택
        if (!selectedGroup && groups.length > 0) {
          setSelectedGroup(groups[0]);
        }
      } else {
        setUserGroups([]);
        setSelectedGroup(null);
      }
    } catch (error) {
      console.error('그룹 정보 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchUserGroups();
  }, [profile?.clerk_user_id]);

  // 그룹 나가기 후 리스트 업데이트
  const handleGroupLeave = async (groupId: number) => {
    // 그룹 리스트에서 해당 그룹 제거
    const updatedGroups = userGroups.filter(group => group.id !== groupId);
    setUserGroups(updatedGroups);
    
    // 선택된 그룹이 삭제된 그룹이면 첫 번째 그룹으로 변경
    if (selectedGroup?.id === groupId) {
      if (updatedGroups.length > 0) {
        setSelectedGroup(updatedGroups[0]);
      } else {
        setSelectedGroup(null);
        setIsChatOpen(false); // 참여한 그룹이 없으면 모달 닫기
      }
    }
  };

  // 채팅 모달 열기 시 그룹 목록 새로 가져오기
  const handleOpenChat = async () => {
    setIsChatOpen(true);
    await fetchUserGroups(); // 그룹 목록 새로 가져오기
  };

  // 특정 그룹을 선택하고 채팅 모달 열기
  const handleOpenChatWithGroup = async (groupId: number) => {
    setIsChatOpen(true);
    await fetchUserGroups(); // 그룹 목록 새로 가져오기
    
    // 그룹 목록에서 해당 그룹 찾기
    const targetGroup = userGroups.find(group => group.id === groupId);
    if (targetGroup) {
      setSelectedGroup(targetGroup);
    }
  };

  const contextValue: ChatContextType = {
    openChatWithGroup: handleOpenChatWithGroup
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
      {!isChatOpen && <GlobalChatFab onClick={handleOpenChat} />}
      <GroupChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        userGroups={userGroups}
        selectedGroup={selectedGroup}
        onGroupSelect={setSelectedGroup}
        onGroupLeave={handleGroupLeave}
      />
    </ChatContext.Provider>
  );
} 