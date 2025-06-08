<template>
  <el-container class="chat-container">
    <!-- Message display area -->
    <el-main class="chat-messages">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
        <div class="message-content">
          <div v-for="(block, i) in message.contents" :key="i">
            <div v-if="block.type === 'think'" class="think-block">{{ block.text }}</div>
            <span v-else v-html="block.text"></span>
          </div>
        </div>
      </div>
      <!-- This div is used for scrolling to the bottom -->
      <div ref="messagesEndRef"></div>
    </el-main>

    <!-- Input area -->
    <div class="chat-input-area-wrapper">
      <div class="chat-input-container">
        <!-- Contenteditable input area -->
        <div
          ref="chatInputRef"
          class="chat-contenteditable"
          contenteditable="true"
          @input="handleInput"
          @keydown="handleKeyDown"
          @focus="isFocused = true"
          @blur="isFocused = false"
        >
          <!-- <p>{{ inputMessage }}</p> -->
        </div>
        <!-- Placeholder -->
        <div v-if="!inputMessage && !isFocused" class="chat-placeholder">
            输入你的问题...
        </div>
        <!-- Bottom row with buttons -->
        <div class="input-bottom-row">
            <div class="input-addons left-addons">
              <!-- Placeholder for Add button -->
              <div class="add-button">
                <el-icon><Plus /></el-icon>
              </div>
              <!-- Placeholder for Tools -->
              <div class="tools-button">
                <el-icon><Setting /></el-icon> <!-- Using Setting icon as a placeholder for tools -->
                <span>工具</span>
              </div>
            </div>
             <div class="input-addons right-addons">
                 <!-- Placeholder for Microphone button -->
                <div class="microphone-button">
                    <el-icon><Microphone /></el-icon>
                </div>
                <!-- Send button -->
                <div class="send-button" @click="sendMessage">
                    <el-icon><Promotion /></el-icon>
                </div>
             </div>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { ElContainer, ElMain, ElInput, ElButton, ElIcon, ElAvatar } from 'element-plus';
import { Promotion, Plus, Setting, Microphone } from '@element-plus/icons-vue';

interface MessageBlock {
  type: 'text' | 'think';
  text: string;
}

interface Message {
  contents: MessageBlock[];
  sender: 'user' | 'ai';
  isTyping?: boolean;
}

const messages = ref<Message[]>([]);
const inputMessage = ref<string>('');
const messagesEndRef = ref<HTMLDivElement | null>(null);
const chatInputRef = ref<HTMLDivElement | null>(null); // Ref for the contenteditable div
const isFocused = ref(false); // To track focus for placeholder
const isTyping = ref(false);  // 添加全局打字状态
const typingSpeed = 30;  // 打字速度（毫秒）

let abortController: AbortController | null = null; // 用于取消 fetch 请求的 AbortController
let isFirstChunk = true;
let aiBuffer = '';
let typing = false;
let inThinkBlock = false;
let currentThinkText = '';

// Function to scroll to the latest message
const scrollToBottom = () => {
  nextTick(() => {
    messagesEndRef.value?.scrollIntoView({ behavior: "smooth" });
  });
};

// Watch for message changes to scroll to bottom
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

// 移除 onMounted 中的 establishSSEConnection 调用
onMounted(() => {
  
});

onUnmounted(() => {
  // 在组件卸载时取消 fetch 请求，关闭连接
  if (abortController) {
    abortController.abort();
    console.log('SSE fetch connection aborted.');
  }
  // 停止所有正在进行的打字效果
  messages.value.forEach(message => {
    if (message.isTyping) {
      message.isTyping = false;
    }
  });
  isTyping.value = false;
});

// 打字机效果函数
const typeWriter = async (message: Message) => {
  typing = true;
  message.isTyping = true;
  isTyping.value = true;
  const index = messages.value.indexOf(message);
  if (index === -1) return;
  while (aiBuffer.length > 0) {
    if (
      messages.value[index].contents.length === 0 ||
      messages.value[index].contents[messages.value[index].contents.length - 1].type !== 'text'
    ) {
      messages.value[index].contents.push({ type: 'text', text: '' });
    }
    messages.value[index].contents[messages.value[index].contents.length - 1].text += aiBuffer[0];
    aiBuffer = aiBuffer.slice(1);
    await new Promise(resolve => setTimeout(resolve, typingSpeed));
    scrollToBottom();
  }
  message.isTyping = false;
  isTyping.value = false;
};

// Modified sendMessage to send POST request and handle SSE response stream
const sendMessage = async () => {
  if (inputMessage.value.trim() === '') return;

  const userMessageText = inputMessage.value;
  const newUserMessage: Message = { contents: [{ type: 'text', text: userMessageText }], sender: 'user' };

  messages.value.push(newUserMessage);

  // Clear input immediately after sending
  inputMessage.value = '';
  if (chatInputRef.value) {
    chatInputRef.value.innerHTML = '<p><br></p>';
  }

  // Add a placeholder AI message
  const aiMessage: Message = { contents: [], sender: 'ai', isTyping: false };
  messages.value.push(aiMessage);

  aiBuffer = '';
  typing = false;
  inThinkBlock = false;
  currentThinkText = '';

  try {
    console.log('Sending message to backend via POST and attempting to read SSE stream from response...');
    const response = await fetch('http://127.0.0.1:7081/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiYXVkIjpbImZhc3RhcGktdXNlcnM6YXV0aCJdLCJleHAiOjE3NDk5NjExODR9.YQw7FN8PsSmGrSKHCpjoOQ_rIw9nQ8tXf81dClnS3Jk'
      },
      body: JSON.stringify({
        "conversation_id": "",
        "query": userMessageText
      }),
    });

    if (!response.ok) {
      console.error('Failed to send message via POST and get stream:', response.status, response.statusText);
      aiMessage.contents.push({ type: 'text', text: 'Error: Failed to send message or get stream.' });
      return;
    }

    if (!response.body) {
      console.error('SSE response body is null from POST response.');
      aiMessage.contents.push({ type: 'text', text: 'Error: Empty response from AI.' });
      return;
    }

    console.log('Reading SSE stream from POST response body...');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        console.log('SSE stream finished from POST response.');
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const eventString of events) {
        if (!eventString) continue;

        // 直接处理 data 开头的行
        if (eventString.startsWith('data: ')) {
          try {
            const jsonStr = eventString.substring('data: '.length);
            const data = JSON.parse(jsonStr);
            // console.log('Parsed SSE data:', data);

            if (data.event === 'message' && typeof data.data === 'string') {
              const innerData = JSON.parse(data.data);

              if (typeof innerData.message === 'string') {
                let aiMessageContent = innerData.message;
                // 处理 think 块
                if (aiMessageContent.includes('<think>')) {
                  inThinkBlock = true;
                  aiMessageContent = aiMessageContent.replace('<think>', '');
                }
                if (aiMessageContent.includes('</think>')) {
                  inThinkBlock = false;
                  aiMessageContent = aiMessageContent.replace('</think>', '');
                  currentThinkText += aiMessageContent;
                  // 推送 think 块
                  const index = messages.value.indexOf(aiMessage);
                  if (index !== -1 && currentThinkText.trim() !== '') {
                    messages.value[index].contents.push({ type: 'think', text: currentThinkText });
                  }
                  currentThinkText = '';
                  continue;
                }
                if (inThinkBlock) {
                  currentThinkText += aiMessageContent;
                } else {
                  aiBuffer += aiMessageContent;
                  if (!typing) typeWriter(aiMessage);
                }
              } else if (data.event === 'done') {
                console.log('SSE stream finished (done event received)');
                break;
              }
            }
          } catch (error) {
            console.error('Error parsing SSE data:', error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in sendMessage:', error);
    aiMessage.contents.push({ type: 'text', text: 'Error: Failed to communicate with the server.' });
  }
};

// Handle input from contenteditable div
const handleInput = (event: Event) => {
  const target = event.target as HTMLDivElement;
  // Update inputMessage, ensuring we handle potential child elements (like <p>)
  inputMessage.value = target.innerText; // Using innerText to get plain text
};

// Handle keydown events for Enter key
const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent default newline in contenteditable
        sendMessage();
    } else if (event.key === 'Enter' && event.shiftKey) {
        // Allow Shift+Enter for newline - default behavior is fine here
    }
};

// Removed redundant handleKeyPress (covered by handleKeyDown)
/*
const handleKeyPress = (e: KeyboardEvent) => {
    // This is redundant now
    // console.log('Old handleKeyPress:', e.key);
};
*/

</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
  padding: 0 20px 20px 20px; /* Adjust padding for the whole container */
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
  padding-top: 20px;
}

.chat-input-area-wrapper {
    flex-shrink: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative; /* Needed for absolute positioning of placeholder */
}

.chat-input-container {
    display: flex;
    flex-direction: column; /* Stack items vertically */
    background-color: #f0f0f0; /* Light grey background */
    border-radius: 24px; /* Increased border radius for more rounded corners */
    padding: 12px 16px; /* Adjusted padding inside the container */
    width: 100%;
    max-width: 800px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    position: relative; /* Needed for absolute positioning of placeholder */
}

.chat-contenteditable {
    flex-grow: 1;
    border: none;
    background-color: transparent; /* Transparent background */
    resize: none;
    padding: 0 8px; /* Adjust padding */
    font-size: 16px;
    outline: none; /* Remove outline */
    box-shadow: none;
    width: 100%;
    min-height: 24px; /* Minimum height for a single line */
    line-height: 1.5;
    word-wrap: break-word;
    -webkit-user-modify: read-write-plaintext-only; /* Suggest plain text input */
    margin-bottom: 8px; /* Space between input and bottom row */
}

/* Style for the paragraph inside contenteditable */
.chat-contenteditable p {
    margin: 0; /* Remove default paragraph margin */
    padding: 0; /* Remove default paragraph padding */
}

.chat-placeholder {
    position: absolute;
    top: 12px; /* Adjust to align with text */
    left: 16px; /* Adjust to align with text */
    padding: 0 8px;
    font-size: 16px;
    color: #999; /* Grey color for placeholder */
    pointer-events: none; /* Allow clicks to go through to contenteditable */
}

.input-bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 8px; /* Add horizontal padding to align with textarea content */
    box-sizing: border-box;
}

.input-addons {
    display: flex;
    align-items: center;
    color: #666;
    flex-shrink: 0;
}

.left-addons {
    /* No specific padding needed here as it's handled by input-bottom-row padding */
}

.right-addons {
     /* No specific padding needed here as it's handled by input-bottom-row padding */
}

.add-button, .tools-button, .microphone-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    cursor: pointer;
    margin-right: 8px; /* Space between buttons */
}

.tools-button span {
    margin-left: 4px;
    font-size: 14px;
}

/* Remove margin-right from the last button in left-addons and right-addons */
.left-addons .tools-button {
    margin-right: 0; /* Remove margin from the last item in left-addons */
}

.right-addons .send-button {
    margin-left: 0; /* Remove margin from the first item in right-addons */
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #000;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  /* margin-left handled by input-addons gap or specific margins */
  flex-shrink: 0;
}

.send-button:hover {
  opacity: 0.8;
}

/* Message display area styles (keep existing or modify as needed) */
.message {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
}

.message.user {
  justify-content: flex-end;
}

.message.ai {
  justify-content: flex-start;
}

.message .message-content {
   display: flex;
   flex-direction: column; /* 关键：垂直排列 */
   align-items: flex-start;
}

.message p {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 8px;
  line-height: 1.5;
  word-wrap: break-word;
  box-shadow: none;
  white-space: pre-wrap;
  margin: 0;
}

.message.user p {
  background-color: #dcf8c6;
  color: #000;
  border-bottom-right-radius: 2px;
}

.message.ai p {
  background-color: #f0f0f0;
  color: #000;
  border-bottom-left-radius: 2px;
}

.typing-indicator {
  display: inline-block;
  animation: blink 1s infinite;
  font-weight: bold;
  color: #409EFF;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.message.ai .message-content {
  position: relative;
}

.message.ai .typing-indicator {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
}

.think-block {
  background: #f5f6fa;
  color: #888;
  font-size: 14px;
  border-left: 3px solid #bfc4cc;
  margin: 8px 0;
  padding: 8px 12px;
  border-radius: 4px;
  font-style: italic;
}
</style> 