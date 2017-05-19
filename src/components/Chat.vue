<template>
  <div class="chat-box" >
    <div class="chat-content-box" v-show="routeName==='Main'">
    </div>
    <div class="chat-content-box" v-show="routeName==='Chat'">
      <chat-title :conversation="conversation"></chat-title>
      <div class="content" id="content">
          <div class="history-box"><a v-show="hasMsg" @click="getMoreHistory" class="history">获取更多历史信息</a></div>
          <message-component v-for="message,index in messageList" :message="message" key="index"></message-component>
      </div>
      <div class="edit">
        <div class="edit-select">
          <span class="edit-sel fa fa-user-circle fa-2x"></span>
          <span class="edit-sel fa fa-file-image-o fa-2x" ><input type="file" class="edit-file" @change="sendImageAndFile"></span>
          <span class="edit-sel fa fa-file-code-o fa-2x"><input type="file" class="edit-file" @change="sendImageAndFile"></span>
        </div>
        <div class="edit-input">
            <pre class="send-input"  contenteditable="true" @keyup="changeTextMessage"></pre>
            <input class="send-btn btn btn-default" type="button" value="发送" @click="sendTextMessage">
        </div>
      </div>
    </div>
  </div>
</template>


<script>

  import Message from '../factory/Message';
  import IMSDK from '../factory/IMSdk';
  import MessageComponent from './Message.vue';
  import ChatTitle from './Title.vue';
  import Upload from '../factory/Upload';

  export default {
    name: 'Chat',
    data: function () {
      return {
          routeName: null,
          title:null,
          messageList: [],
          textMessage: null,
          hasMsg: false
      };
    },
    props: ['receiveMessage'],
    components: {MessageComponent, ChatTitle},
    methods: {
        setupBase: function(route) {
            this.routeName = route.name;
            let conversation = route.params.content || null;
            this.conversation = conversation;
        },
        setupRedirection: function(route) {
            if (!route.params.content) {
                this.$router.push({name: 'Main'});
            }
        },
        setupHistoryList: function() {
            var route = this.$route;
            if (route.name === 'Main') return;
            var targetId = route.params.id;
            var type = route.params.type;
            IMSDK.historyMessages(type, targetId, 0, 15, function(list, hasMsg) {
              console.log(hasMsg);
                this.messageList = list;
                this.hasMsg = hasMsg;
            }.bind(this));
        },
        initital: function(route) {
            this.setupBase(route);
            this.setupRedirection(route);
            this.setupHistoryList();
        },
        sendTextMessage: function() {
            var targetId = this.$route.params.id;
            var type = this.$route.params.type;
            var msg = new RongIMLib.TextMessage({content: this.textMessage, extra:'附加消息'});
            Message.sendMessage(type, targetId, msg, function(message) {
                this.messageList.push(message);
            }.bind(this));
        },
        changeTextMessage: function($event) {
            this.textMessage = $event.target.innerHTML;
        },
        sendImageAndFile: function(event) {
            var file = event.target.files[0];
            Upload.getUploadUrl(file, function(data) {
                if (data.fileType === 'image') {
                    this.sendImage(data);
                } else {
                    this.sendFile(data);
                }
            }.bind(this));
        },
        sendImage: function(data) {
            var base64 = data.hash;
            var url = data.downloadUrl;
            var msg = new RongIMLib.ImageMessage({content:base64, imageUri:url});
            Message.sendMessage(this.conversation.conversationType, this.conversation.targetId, msg, function(message) {
                this.messageList.push(message);
            }.bind(this));
        },
        sendFile: function(data) {
            var msg = new RongIMLib.FileMessage({name: data.name, size: data.size, type:data.fileType, fileUrl: data.downloadUrl});
            Message.sendMessage(this.conversation.conversationType, this.conversation.targetId, msg, function(message) {
                this.messageList.push(message);
            }.bind(this));
        },
        getMoreHistory: function() {
          var route = this.$route;
            var targetId = route.params.id;
            var type = route.params.type;
            IMSDK.historyMessages(type, targetId, null, 15, function(list, hasMsg) {
                this.messageList = list.concat(this.messageList);
                this.hasMsg = hasMsg;
            }.bind(this));
        }
    },
    computed: {

    },
    watch: {
        '$route': function (to, from) {
            this.initital(to);
        },
        'receiveMessage': function(newMessage) {
            if (newMessage.targetId === this.$route.params.id) {
                this.messageList.push(newMessage);
            }
        }
    },
    created: function () {
        this.routeName = this.$route.name;
        this.initital(this.$route);
    },
    beforeUpdate: function() {

    }
  }

</script>

<style>
  .chat-box {
    width: auto;
    height: 100%;
    background-color: rgb(249, 251, 253);
    position: relative;
  }

  .title {
    color: black;
    font-size: 1.2em;
    text-align: center;
    width: 100%;
    height: 54px;
    line-height: 54px;
    background-color: white;
    position: absolute;
  }

  .chat-content-box {
    width: 100%;
    height: 100%;
  }

  .content {
    position: absolute;
    top: 54px;
    bottom: 118px;
    height: auto;
    width: 100%;
    overflow: auto;
  }

  .edit {
    width: 100%;
    height: 118px;
    position: absolute;
    bottom: 0;
    background-color: white;
  }

  .edit-select {
    padding-left: 10px;
    padding-top: 8px;
    width: 100%;
    height: 38px;
    text-align: left;
  }

  .edit-input {
    width: 100%;
    height: 80px;
  }

  .edit-sel {
    display: inline-block;
    height: 30px;
    margin: 0 2px;
    cursor: pointer;
    position: relative;
    line-height: 30px;
    text-align: center;
    width: 30px;
  }
  .send-btn {
      width: 15%;
      height: 100%;
  }
  .send-input {
      width: 85%;
      float: left;
      height: 100%;
      padding: 5px 0 5px 20px;
      text-align: left;
      background-color: white;
      outline: none;
      font-size: 1.2em;
      padding-left: 20px;
  }
  .chat-talk {
      width: 100%;
      margin: 28px 0;
      text-align: left;
  }

  .talk-head {
      width: 45px;
      height: 45px;
      border-radius: 22.5px;
      background-color: rgb(243, 219, 115);
      float: left;
      margin-left: 5px;
      position: relative;
      top: 10px;
      color: white;
      line-height: 45px;
      text-align: center;
      font-weight: 900;
      font-size: 1.3em;
  }

  .talk-content {
      margin-left: 60px;
      width: auto;
      height: 100%;
  }
  .talk-title {
      height: 28px;
      width: 100%;
      margin: 0;
      font-size: 1.2em;
      color:#333;
      line-height: 28px;
      font-weight: 500
  }

  .talk-text {
      width: 100%;
      margin: 0;
  }
  .voice-talk {
      cursor: pointer;
      display: inline-block;
      padding: 4px 20px;
      border-radius: 20px;
      color:white;
      font-weight: 900;
      top: 50%;
      background-color: rgb(0, 163, 255)
  }
  .edit-file {
      width: 100%;
      cursor: pointer;
      height: 100%;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
  }
  .history {
    cursor: pointer;
  }
  .history-box {
    position: absolute;
    width: 100%;
    height: 18px;
  }

</style>
