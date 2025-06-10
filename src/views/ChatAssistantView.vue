<template>
  <el-container class="chat-container">
    <!-- Message display area -->
    <el-main class="chat-messages">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
        <div class="message-content" v-if="message.contents.length > 0 || message.isTyping">
          <div v-for="(block, i) in message.contents" :key="i">
            <div v-if="block.type === 'think' && block.text" class="think-block">{{ block.text }}</div>
            <div v-else-if="block.type === 'text' && block.text" class="message-text" v-html="block.text"></div>
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
import { getApiUrl } from '../config/api';
import { useRoute } from 'vue-router';
import { de } from 'element-plus/es/locales.mjs';



interface MessageBlock {
  type: 'text' | 'think';
  text: string;
}

interface Message {
  contents: MessageBlock[];
  sender: 'user' | 'ai';
  isTyping?: boolean;
}

interface ChatRecord {
  message_type: number;
  message_id: string;
  prompt: {
    'sys.query': string;
    'sys.conversation_id': string;
  };
  message: {
    message: string;
  };
  query: string;
  conversation_id: string;
}

const route = useRoute();
const messages = ref<Message[]>([]);
const inputMessage = ref<string>('');
const messagesEndRef = ref<HTMLDivElement | null>(null);
const chatInputRef = ref<HTMLDivElement | null>(null);
const isFocused = ref(false);
const isTyping = ref(false);
const typingSpeed = 30;
const currentConversationId = ref<string>('');

let abortController: AbortController | null = null; // 用于取消 fetch 请求的 AbortController
let isFirstChunk = true;



let aiTextBuffer = '';
let aiThinkBuffer = '';
let typing = false;
let inThinkBlock = false;

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

// Function to parse message content and extract think blocks
const parseMessageContent = (content: string): MessageBlock[] => {
  const blocks: MessageBlock[] = [];
  let currentText = '';
  let inThinkBlock = false;
  let thinkContent = '';

  for (let i = 0; i < content.length; i++) {
    if (content.substring(i, i + 7) === '<think>') {
      if (currentText.trim()) {
        blocks.push({ type: 'text', text: currentText.trim() });
        currentText = '';
      }
      inThinkBlock = true;
      i += 6; // Skip the <think> tag
      continue;
    }
    if (content.substring(i, i + 8) === '</think>') {
      if (thinkContent.trim()) {
        blocks.push({ type: 'think', text: thinkContent.trim() });
        thinkContent = '';
      }
      inThinkBlock = false;
      i += 7; // Skip the </think> tag
      continue;
    }
    // debugger;
    if (inThinkBlock) {
      thinkContent += content[i];
      // debugger;
    } else {
      currentText += content[i];
      // debugger;
    }
  }

  if (currentText.trim()) {
    blocks.push({ type: 'text', text: currentText.trim() });
  }
  if (thinkContent.trim()) {
    blocks.push({ type: 'think', text: thinkContent.trim() });
  }

  return blocks;
};

// Function to load chat history
const loadChatHistory = async (conversationId: string) => {
  try {
    const response = await fetch(getApiUrl(`/api/chat/record/list/${conversationId}`), {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiYXVkIjpbImZhc3RhcGktdXNlcnM6YXV0aCJdLCJleHAiOjE3NDk5NjExODR9.YQw7FN8PsSmGrSKHCpjoOQ_rIw9nQ8tXf81dClnS3Jk'
      }
    });

    if (!response.ok) {
      console.error('Failed to load chat history:', response.status);
      return;
    }

    const data = await response.json();
    if (data.success && data.data) {
      // Clear existing messages
      messages.value = [];
      
      // Process each record
      data.data.forEach((record: ChatRecord) => {
        // Add user message
        messages.value.push({
          contents: [{ type: 'text', text: record.query }],
          sender: 'user'
        });

        // Add AI message
        if (record.message && record.message.message) {
          let aiRawMessage = record.message.message;

          // Normalize <br> tags to \n, then normalize newlines and trim whitespace from AI response
          aiRawMessage = aiRawMessage.replace(/<br\s*\/?>/gi, '\n').replace(/\n+/g, '\n').trim();

          // Check if AI response starts with user's query (potentially echoed by AI)
          // and remove it to prevent duplicate display of user query on AI side.
          if (aiRawMessage.startsWith(record.query.trim())) {
            aiRawMessage = aiRawMessage.substring(record.query.trim().length).trim();
          }

          const aiMessage: Message = {
            contents: parseMessageContent(aiRawMessage),
            sender: 'ai'
          };
          messages.value.push(aiMessage);
        }
      });

      // Set current conversation ID
      currentConversationId.value = conversationId;
      
      // Scroll to bottom after loading history
      scrollToBottom();
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
};

// Watch for route changes to load chat history when conversation_id changes
watch(
  () => route.params.conversation_id,
  (newConversationId) => {
    if (newConversationId) {
      loadChatHistory(newConversationId as string);
    }
  },
  { immediate: true }
);

onMounted(() => {
  // Initial load of chat history if conversation_id is present
  const conversationId = route.params.conversation_id as string;
  if (conversationId) {
    loadChatHistory(conversationId);
  }
});

onUnmounted(() => {
  // 在组件卸载时取消 fetch 请求，关闭连接
  if (abortController) {
    (abortController as AbortController).abort(); // Type assertion to resolve linter error
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

const typeWriter = async (message: Message, blockType: 'text' | 'think') => {
  if (typing) return; // 防止并发打字
  
  typing = true;
  message.isTyping = true;
  isTyping.value = true;
  
  const index = messages.value.indexOf(message);
  if (index === -1) return;

  const blocks = messages.value[index].contents;
  const buffer = blockType === 'text' ? aiTextBuffer : aiThinkBuffer;

  if (buffer.length > 0) {
    // 确保当前块类型正确
    if (blocks.length === 0) {
      blocks.push({ type: blockType, text: '' });
    } else if (blocks[blocks.length - 1].type !== blockType) {
      // 如果最后一个块不是当前类型，创建新块
      blocks.push({ type: blockType, text: '' });
    }

    const targetBlock = blocks[blocks.length - 1];
    
    // 逐字添加内容
    for (let i = 0; i < buffer.length; i++) {
      targetBlock.text += buffer[i];
      await new Promise(resolve => setTimeout(resolve, typingSpeed));
      scrollToBottom();
    }

    // 清空对应的缓冲区
    if (blockType === 'text') {
      aiTextBuffer = '';
    } else {
      aiThinkBuffer = '';
    }
  }

  message.isTyping = false;
  isTyping.value = false;
  typing = false;
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
  const aiMessage: Message = {
    contents: [],
    sender: 'ai',
    isTyping: false
  };
  messages.value.push(aiMessage);

  // 重置所有状态
  aiTextBuffer = '';
  aiThinkBuffer = '';
  typing = false;
  inThinkBlock = false;

  // Initialize a new AbortController for each request
  if (abortController) {
    // If a previous request is still active, abort it
    abortController.abort();
  }
  abortController = new AbortController(); // Create a new AbortController
  const signal = abortController.signal; // Get the signal for the fetch request

  try {
    console.log('Sending message to backend via POST and attempting to read SSE stream from response...');
    const response = await fetch(getApiUrl('/api/chat'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiYXVkIjpbImZhc3RhcGktdXNlcnM6YXV0aCJdLCJleHAiOjE3NDk5NjExODR9.YQw7FN8PsSmGrSKHCpjoOQ_rIw9nQ8tXf81dClnS3Jk'
      },
      body: JSON.stringify({
        "conversation_id": currentConversationId.value,
        "query": userMessageText
      }),
      signal: signal, // Pass the signal here
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

        if (eventString.startsWith('data: ')) {
          try {
            const jsonStr = eventString.substring('data: '.length);
            const data = JSON.parse(jsonStr);

            if (data.event === 'message' && typeof data.data === 'string') {
              console.log('data.data:', data.data);
              let innerData;
              try {
                innerData = JSON.parse(data.data);
              } catch (e) {
                innerData = { message: data.data };
              }
              
              if (data.conversation_id) {
                currentConversationId.value = data.conversation_id;
              }

              if (typeof innerData.message === 'string') {
                // Normalize <br> tags to \n, then normalize newlines and trim whitespace from the incoming message data
                innerData.message = innerData.message.replace(/<br\s*\/?>/gi, '\n').replace(/\n+/g, '\n').trim();

                const parts = innerData.message.split(/(<think>|<\/think>)/g);
                
                for (const part of parts) {
                  if (part === '<think>') {
                    // 确保之前的文本内容被处理
                    if (aiTextBuffer && !typing) {
                      await typeWriter(aiMessage, 'text');
                    }
                    inThinkBlock = true;
                  } else if (part === '</think>') {
                    // 确保思考内容被处理
                    if (aiThinkBuffer && !typing) {
                      await typeWriter(aiMessage, 'think');
                    }
                    inThinkBlock = false;
                  } else if (part !== '') {
                    if (inThinkBlock) {
                      aiThinkBuffer += part;
                      // 如果积累了一定量的内容，就立即显示
                      if (aiThinkBuffer.length > 10 && !typing) {
                        await typeWriter(aiMessage, 'think');
                      }
                    } else {
                      aiTextBuffer += part;
                      // 如果积累了一定量的内容，就立即显示
                      if (aiTextBuffer.length > 10 && !typing) {
                        await typeWriter(aiMessage, 'text');
                      }
                    }
                  }
                }
              }
            } else if (data.event === 'done') {
              // 处理最后可能剩余的缓冲区内容
              if (aiThinkBuffer && !typing) {
                await typeWriter(aiMessage, 'think');
              }
              if (aiTextBuffer && !typing) {
                await typeWriter(aiMessage, 'text');
              }
              console.log('SSE stream finished (done event received)');
              break;
            }
          } catch (error) {
            console.error('Error parsing SSE data:', error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in sendMessage:', error);
    // Ensure the message object exists before pushing error
    if (!aiMessage.contents) {
        aiMessage.contents = [];
    }
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
   align-items: flex-start;
   flex-wrap: wrap; /* Allow content to wrap */
}

.message.user .message-content {
  max-width: 75%; /* Limit user message bubble width */
}

.message p {
  padding: 10px 14px;
  border-radius: 8px;
  line-height: 1.0; /* Adjusted for tighter spacing */
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
  flex-direction: column; /* Ensure AI content stacks vertically */
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
  width: 100%;
}

.message-text {
  background-color: #f0f0f0;
  padding: 10px 14px;
  border-radius: 8px;
  line-height: 1.0; /* Adjusted for tighter spacing */
  word-wrap: break-word;
  white-space: pre-wrap;
  margin: 0;
}

.message.user .message-text {
  background-color: #dcf8c6;
  color: #000;
  border-bottom-right-radius: 2px;
  width: 100%; /* Ensure it takes full width of its parent content box */
}

.message.ai .message-text {
  background-color: #f0f0f0;
  color: #000;
  border-bottom-left-radius: 2px;
}
</style> 