<template>
  <div class="sidebar-content">
    <div class="sidebar-logo">
      <h2> AI-小助手 </h2>
    </div>

    <!-- 第一部分：新建对话 链接/Div -->
    <div class="new-chat-button">
      <a href="#" @click.prevent="handleNewChat" class="new-chat-link">
        <div class="new-chat-link-content">
          <div class="new-chat-link-icon"><el-icon><Plus /></el-icon></div>
          <div class="new-chat-link-text">新聊天</div>
        </div>
      </a>
    </div>

    <!-- 第二部分：历史对话列表 -->
    <div class="history-chats">
      <el-menu
        :default-active="activeConversationId"
        class="el-menu-vertical-demo"
        @select="handleMenuSelect"
      >
        <el-menu-item 
          v-for="conversation in conversations" 
          :key="conversation.conversation_id"
          :index="conversation.conversation_id"
        >
          <span>{{ conversation.title }}</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 第三部分：辅助功能及其他菜单 -->
    <div class="other-menus">
       <el-menu
        default-active="4"
        class="el-menu-vertical-demo"
        @select="handleMenuSelect"
      >
         <el-sub-menu index="4">
          <template #title>
            <span>辅助功能</span>
          </template>
          <el-menu-item index="4-1">文档助手</el-menu-item>
          <el-menu-item index="4-2">邮件助手</el-menu-item>
          <el-menu-item index="4-3">知识库</el-menu-item>
          <el-menu-item index="4-4">工作计划</el-menu-item>
          <el-menu-item index="4-5">会议助手</el-menu-item>
          <el-menu-item index="4-6">健康关怀</el-menu-item>
          <el-menu-item index="4-7">创意助手</el-menu-item>
          <el-menu-item index="4-8">翻译助手</el-menu-item>
          <el-menu-item index="4-9">旅行助手</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>

    <!-- Optional: User/Account Info at the bottom -->
    <div class="sidebar-footer">
        <div class="user-info">
            <el-avatar :size="32" class="user-avatar">张</el-avatar>
            <span>张三</span>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ElButton, ElMenu, ElMenuItem, ElSubMenu, ElIcon, ElAvatar } from 'element-plus';
import { Share, Plus } from '@element-plus/icons-vue';
import { ref, onMounted, watch } from 'vue';
import { getApiUrl } from '../config/api';
import { useRouter } from 'vue-router';

interface Conversation {
  type: number;
  id: number;
  conversation_id: string;
  user_id: number;
  gmt_modified: string;
  create_by: number;
  title: string;
  gmt_create: string;
}

interface ApiResponse {
  data: Conversation[];
  success: boolean;
  code: number;
  msg: string;
}

const router = useRouter();
const conversations = ref<Conversation[]>([]);
const activeConversationId = ref<string>('');

const fetchConversations = async () => {
  try {
    const response = await fetch(getApiUrl('/api/conversation/list'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiYXVkIjpbImZhc3RhcGktdXNlcnM6YXV0aCJdLCJleHAiOjE3NDk5NjExODR9.YQw7FN8PsSmGrSKHCpjoOQ_rIw9nQ8tXf81dClnS3Jk'
      } ,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    const result: ApiResponse = await response.json();
    if (result.success && result.code === 0) {
      conversations.value = result.data;
      if (result.data.length > 0) {
        activeConversationId.value = result.data[0].conversation_id;
      }
    } else {
      throw new Error(result.msg || 'Failed to fetch conversations');
    }
  } catch (error) {
    console.error('Error fetching conversations:', error);
    // TODO: Add proper error handling/notification
  }
};

const handleNewChat = () => {
  console.log('新建对话 clicked');
  router.push('/chat');
};

const handleMenuSelect = (index: string, indexPath: string[]) => {
  console.log('Menu selected:', index, indexPath);
  activeConversationId.value = index;
  // Navigate to the chat view with the selected conversation ID
  router.push(`/chat/${index}`);
};

onMounted(() => {
  fetchConversations();
});
</script>

<style scoped>
.sidebar-content {
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f8f8f8; /* Light grey background for sidebar */
  color: #212121; /* Dark text color */
}

.sidebar-logo {
  height: 64px;
  padding: 0 16px 16px 16px;
  text-align: center;
  border-bottom: none; /* Remove bottom border */
  margin-bottom: 16px;
  background-color: #f8f8f8; /* Match sidebar background */
  flex-shrink: 0;
  display: flex; /* Use flexbox to center the text */
  justify-content: center;
  align-items: center;
}

/* Remove aide-logo styles as we are using h2 */
/*
.aide-logo {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}
*/

.sidebar-logo h2 {
  margin: 0;
  color: #495057; /* Softer grey text color for logo */
  font-size: 28px; /* Increased font size for logo */
  font-weight: 800; /* Make it bold */
  letter-spacing: 1px; /* Add some letter spacing */
  text-transform: uppercase; /* Optional: make text uppercase */
}

.new-chat-button {
  padding: 0 16px 16px 16px;
  flex-shrink: 0;
}

.new-chat-link {
    display: block; /* Make the link a block element */
    text-decoration: none; /* Remove underline */
    background-color: #ffffff; /* White background */
    border: 1px solid #e0e0e0; /* Subtle border */
    color: #666; /* Medium grey text color */
    border-radius: 5px; /* Slightly rounded corners */
    padding: 8px 12px; /* Adjust padding */
    font-size: 14px; /* Adjust font size */
    width: 100%; /* Full width */
    box-sizing: border-box; /* Include padding and border in width */
}

.new-chat-link-content {
    display: flex; /* Use flexbox for icon and text alignment */
    align-items: center;
    justify-content: center; /* Center content */
}

.new-chat-link-icon {
    display: flex; /* Use flexbox to center the icon */
    align-items: center;
    justify-content: center;
    margin-right: 8px; /* Space between icon and text */
}

.new-chat-link-text {
    flex-grow: 1; /* Allow text to grow */
    white-space: nowrap; /* Prevent text wrapping */
    overflow: hidden; /* Hide overflow text */
    text-overflow: ellipsis; /* Add ellipsis for overflow */
}

.new-chat-link:hover {
  background-color: #f0f0f0; /* Very light grey on hover */
  border-color: #e0e0e0;
  color: #333; /* Slightly darker text on hover */
}

.history-chats {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 300px); /* Adjust this value based on your needs */
  min-height: 200px; /* Minimum height for the history section */
}

.other-menus {
  flex-shrink: 0;
  margin-top: 8px; /* Reduce the gap between sections */
}

.sidebar-footer {
    padding: 16px;
    text-align: center;
    border-top: none; /* Remove top border */
    margin-top: auto;
    color: #212121; /* Dark text color */
    flex-shrink: 0;
    background-color: #f8f8f8; /* Ensure footer stays visible */
}

.user-info {
    display: flex;
    align-items: center;
    justify-content: center; /* Center content horizontally */
    gap: 8px; /* Space between avatar and name */
}

.user-avatar {
    margin-right: 8px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 260px;
}

/* Adjust Element Plus menu styles */
.el-menu {
  border-right: none;
  background-color: #f8f8f8; /* Match sidebar background */
}

.el-menu-item, .el-sub-menu__title {
  color: #212121; /* Dark text color */
}

.el-menu-item.is-active {
  background-color: #e0e0e0; /* Light grey background for selected */
  color: #212121; /* Keep text dark */
}

.el-menu-item:hover, .el-sub-menu__title:hover {
  background-color: #f0f0f0; /* Light grey on hover */
  color: #212121; /* Keep text dark */
}

.el-sub-menu .el-menu-item {
  background-color: #f8f8f8 !important; /* Ensure submenu items have the same background */
}

.el-sub-menu .el-menu-item:hover {
   background-color: #f0f0f0 !important; /* Ensure submenu items have hover effect */
}
</style> 