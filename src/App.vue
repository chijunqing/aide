<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Sidebar from './components/Sidebar.vue'
import { ElContainer, ElAside, ElHeader, ElMain } from 'element-plus'
import { Share, Plus } from '@element-plus/icons-vue'

const selectedMenuName = ref('聊天 ')

const handleNewChat = () => {
  // Implementation of handleNewChat function
}
</script>

<template>
  <el-container class="app-layout">
    <el-aside width="260px" class="app-sidebar">
      <Sidebar />
    </el-aside>
    <el-container class="app-main-content-wrapper">
      <el-header class="app-header">
        <div class="header-left">
          <span>{{ selectedMenuName }}</span>
        </div>
        <div class="header-right">
          <el-icon><Share /></el-icon>
        </div>
      </el-header>
      <el-main class="app-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
/* Global styles or styles for app layout */
/* These styles can be moved to a global CSS file if preferred */
.app-layout {
  min-height: 100vh;
  background-color: #ffffff; /* Main layout background (behind everything) */
}

.app-sidebar {
  box-shadow: 1px 0 6px rgba(0, 0, 0, 0.05);
  z-index: 100;
  overflow-y: auto;
  flex-shrink: 0;
  background-color: #f8f8f8; /* Light grey for sidebar */
}

.app-main-content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff; /* White for main content wrapper */
}

.app-header {
  height: 64px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: none; /* Remove bottom border */
  background-color: #ffffff; /* White for header */
  justify-content: flex-start; /* Align items to the start */
}

.app-content {
  flex-grow: 1;
  padding: 0; /* Adjust as needed for page content padding */
  background-color: #ffffff; /* White for content area */
  overflow-y: auto; /* Allow main content to scroll */
}

.header-left {
  font-size: 18px;
  font-weight: bold;
  color: #212529;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #495057; /* Dark gray */
  margin-left: auto; /* Re-add margin-left auto to push right content to the end */
}

.new-chat-button {
  /* Add your styles here */
}

.new-chat-link {
  /* Add your styles here */
}

.new-chat-link-content {
  /* Add your styles here */
}

.new-chat-link-icon {
  /* Add your styles here */
}

.new-chat-link-text {
  /* Add your styles here */
}
</style>

