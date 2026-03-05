// Name: BloxBridge
// ID: bloxbridge
// Description: Direct bridge between TurboWarp and Roblox Studio.
// License: CC0 1.0

(function (Scratch) {
  'use strict';

  class BloxBridge {
    getInfo() {
      return {
        id: 'bloxbridge',
        name: 'BloxBridge',
        color1: '#FF0000', // Roblox Red
        color2: '#D10000',
        blocks: [
          {
            opcode: 'sendData',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Send to Roblox - X: [X] Y: [Y] URL: [URL]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://(ID HERE).replit.dev/send' }
            }
          },
          {
            opcode: 'downloadScripts',
            blockType: Scratch.BlockType.COMMAND,
            text: 'DOWNLOAD ALL SCRIPTS (LUA & PY)'
          }
        ]
      };
    }

    sendData(args) {
      const url = args.URL;
      const body = JSON.stringify({
        user: "TurboWarp",
        content: `X${args.X}Y${args.Y}`
      });

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      }).catch(err => console.error("BloxBridge Error:", err));
    }

    downloadScripts() {
      const readme = `--- BloxBridge Instructions ---
Created by: Stormwindsky
License: CC0 1.0

SERVER SIDE (Replit):
1. Create a new Python Repl.
2. In the Shell, type: pip install flask-cors
3. Paste the content of 'main.py' and click RUN.

ROBLOX SIDE:
1. Create a RemoteEvent in ReplicatedStorage named 'ChatBridgeEvent'.
2. Create a Part in Workspace named 'TurboPart' (Anchored: Yes, CanCollide: No).
3. Put 'ServerScript.lua' in ServerScriptService.
4. Put 'LocalScript.lua' in StarterPlayerScripts.
5. In 'ServerScript.lua', replace the URL with your Replit 'get-chat' address.`;

      const mainPy = `from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

last_message = {"user": "System", "content": "Bridge Ready!"}

@app.route('/')
def home():
    return "BloxBridge is Online!"

@app.route('/send', methods=['POST', 'OPTIONS'])
def send():
    global last_message
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    data = request.get_json()
    if data and 'user' in data and 'content' in data:
        last_message = {"user": data['user'], "content": data['content']}
        return jsonify({"status": "success"}), 200
    return jsonify({"status": "error"}), 400

@app.route('/get-chat', methods=['GET'])
def get_chat():
    return jsonify(last_message)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)`;

      const serverScript = `local HttpService = game:GetService("HttpService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local part = workspace:FindFirstChild("TurboPart")
local RemoteEvent = ReplicatedStorage:FindFirstChild("ChatBridgeEvent") or Instance.new("RemoteEvent", ReplicatedStorage)
RemoteEvent.Name = "ChatBridgeEvent"

local URL = "REPLACE_WITH_YOUR_GET_CHAT_URL"
local lastMsg = ""

while true do
    task.wait(0.5)
    pcall(function()
        local res = HttpService:GetAsync(URL)
        local data = HttpService:JSONDecode(res)
        if data.content ~= lastMsg then
            lastMsg = data.content
            local x = string.match(data.content, "X([%-?%d%.]+)")
            local y = string.match(data.content, "Y([%-?%d%.]+)")
            if x and y and part then
                part.Position = Vector3.new(tonumber(x), part.Position.Y, tonumber(y))
            end
            RemoteEvent:FireAllClients("TurboWarp", data.content)
        end
    end)
end`;

      const localScript = `local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TextChatService = game:GetService("TextChatService")
local RemoteEvent = ReplicatedStorage:WaitForChild("ChatBridgeEvent")

local generalChannel = TextChatService:WaitForChild("TextChannels"):WaitForChild("RBXGeneral")

RemoteEvent.OnClientEvent:Connect(function(user, message)
    local formattedMessage = "<font color='#00E3FF'>[BRIDGE - " .. user .. "]:</font> " .. message
    generalChannel:DisplaySystemMessage(formattedMessage)
end)`;

      // Download all 4 files
      this._downloadFile("instructions.txt", readme);
      this._downloadFile("main.py", mainPy);
      this._downloadFile("ServerScript.lua", serverScript);
      this._downloadFile("LocalScript.lua", localScript);
    }

    _downloadFile(name, content) {
      const blob = new Blob([content], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
    }
  }

  Scratch.extensions.register(new BloxBridge());
})(Scratch);
