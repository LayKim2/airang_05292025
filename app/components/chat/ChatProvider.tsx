"use client"

import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useUserProfile } from '@/app/lib/useUserProfile';
import GlobalChatFab from "./GlobalChatFab";
import GroupChatModal from "./GroupChatModal";

export default function ChatProvider() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const { profile } = useUserProfile();

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

  return (
    <>
      {!isChatOpen && <GlobalChatFab onClick={() => setIsChatOpen(true)} />}
      <GroupChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        userGroups={userGroups}
        selectedGroup={selectedGroup}
        onGroupSelect={setSelectedGroup}
        onGroupLeave={handleGroupLeave}
      />
    </>
  );
} 