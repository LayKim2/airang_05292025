-- 시스템 메시지 함수 업데이트 마이그레이션
-- 기존 함수들을 system_message_code와 system_message_params를 활용하도록 수정

-- 멤버 입장 시 시스템 메시지 생성 함수 업데이트
CREATE OR REPLACE FUNCTION create_member_join_message()
RETURNS TRIGGER AS $$
DECLARE
  chat_room_id BIGINT;
  user_name TEXT;
BEGIN
  -- 채팅방 ID 가져오기
  SELECT id INTO chat_room_id 
  FROM group_chat_rooms 
  WHERE group_id = NEW.group_id;
  
  -- 사용자 이름 가져오기
  SELECT CONCAT(first_name, ' ', last_name) INTO user_name
  FROM users 
  WHERE clerk_user_id = NEW.user_id;
  
  -- 시스템 메시지 삽입 (system_message_code와 system_message_params 포함)
  INSERT INTO group_chat_messages (
    chat_room_id, 
    user_id, 
    message, 
    message_type,
    system_message_code,
    system_message_params
  )
  VALUES (
    chat_room_id, 
    NEW.user_id, 
    user_name || '님이 그룹에 참여했습니다.', 
    'system',
    'MEMBER_JOIN',
    json_build_object(
      'user_name', user_name,
      'user_id', NEW.user_id,
      'role', NEW.role
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 멤버 퇴장 시 시스템 메시지 생성 함수 업데이트
CREATE OR REPLACE FUNCTION create_member_leave_message()
RETURNS TRIGGER AS $$
DECLARE
  chat_room_id BIGINT;
  user_name TEXT;
BEGIN
  -- 채팅방 ID 가져오기
  SELECT id INTO chat_room_id 
  FROM group_chat_rooms 
  WHERE group_id = OLD.group_id;
  
  -- 사용자 이름 가져오기
  SELECT CONCAT(first_name, ' ', last_name) INTO user_name
  FROM users 
  WHERE clerk_user_id = OLD.user_id;
  
  -- 시스템 메시지 삽입 (system_message_code와 system_message_params 포함)
  INSERT INTO group_chat_messages (
    chat_room_id, 
    user_id, 
    message, 
    message_type,
    system_message_code,
    system_message_params
  )
  VALUES (
    chat_room_id, 
    OLD.user_id, 
    user_name || '님이 그룹을 나갔습니다.', 
    'system',
    'MEMBER_LEAVE',
    json_build_object(
      'user_name', user_name,
      'user_id', OLD.user_id,
      'role', OLD.role
    )
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;
