/*
  Chat UI integration (Velzon markup) -> NestJS chat APIs
  Handles both direct and group chats in sidebar mode.
*/
(function () {
  var cfg = window.__CHAT_CONFIG__ || {};
  var apiBase = cfg.apiBase || "/user/chats/api";
  var selfUserId = cfg.selfUserId;

  var userListEl = document.getElementById("userList");
  var groupListEl = document.getElementById("groupList");
  var convoEl = document.getElementById("users-conversation");
  var loaderEl = document.getElementById("elmLoader");
  var chatForm = document.getElementById("chatinput-form");
  var chatInput = document.getElementById("chat-input");
  var chatInputFeedback = document.querySelector(".chat-input-feedback");
  var chatSearchInput = document.getElementById("chatSearchInput");

  var currentChatId = cfg.chatId || null;
  var currentChatType = null; // 'direct' | 'group'
  var chatIndex = [];

  // ─── Utilities ───────────────────────────────────────────────────────────────

  function escapeHtml(str) {
    return (str == null ? "" : String(str))
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function fmtTime(d) {
    var dt = new Date(d);
    if (isNaN(dt.getTime())) return "";
    return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function fetchJson(url, opts) {
    return fetch(url, Object.assign({ headers: { "Content-Type": "application/json" }, credentials: "same-origin" }, opts || {}))
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok || data.success === false) throw new Error(data.error || "Request failed");
          return data;
        });
      });
  }

  // ─── Header ──────────────────────────────────────────────────────────────────

  function setHeader(chat) {
    if (!chat) return;

    var headerImg = document.querySelector(".user-chat-topbar .chat-header-img");
    var subEl = document.getElementById("chat-header-sub");

    if (chat.type === "group") {
      var name = chat.groupName || "Group";
      document.querySelectorAll(".username").forEach(function (el) { el.textContent = name; });
      if (headerImg) headerImg.style.display = "none";
      var iconEl = document.querySelector(".group-icon-placeholder");
      if (!iconEl) {
        iconEl = document.createElement("div");
        iconEl.className = "group-icon-placeholder avatar-xs rounded-circle bg-soft-primary d-flex align-items-center justify-content-center";
        iconEl.style.display = "inline-flex";
        iconEl.innerHTML = '<i class="ri-group-line text-primary fs-14"></i>';
        var avatarWrap = document.querySelector(".user-chat-topbar .user-own-img");
        if (avatarWrap) avatarWrap.prepend(iconEl);
      }
      if (subEl) subEl.textContent = "Group Chat";
    } else {
      var otherUser = chat.otherUser;
      var dname = (otherUser && otherUser.name) || cfg.otherUserName || "Select a chat";
      var img = (otherUser && otherUser.profile_image)
        ? "/uploads/users/" + otherUser.profile_image
        : cfg.otherUserProfileImage || "/assets/images/users/user-dummy-img.jpg";

      document.querySelectorAll(".username").forEach(function (el) { el.textContent = dname; });
      if (headerImg) { headerImg.src = img; headerImg.style.display = ""; }
      var old = document.querySelector(".group-icon-placeholder");
      if (old) old.remove();
      if (subEl) subEl.textContent = "";
    }
  }

  // ─── Render list ─────────────────────────────────────────────────────────────

  function renderChatList(items) {
    var directItems = (items || []).filter(function (c) { return c.type === "direct" && c.otherUser; });
    var groupItems = (items || []).filter(function (c) { return c.type === "group"; });

    // Direct messages
    if (userListEl) {
      userListEl.innerHTML = "";
      directItems.forEach(function (c, idx) {
        var isActive = currentChatId ? Number(currentChatId) === Number(c.chatId) && currentChatType === "direct" : idx === 0;
        var badge = c.unreadCount > 0
          ? '<div class="ms-auto"><span class="badge bg-dark-subtle text-body rounded p-1">' + c.unreadCount + '</span></div>'
          : "";
        var profileImg = c.otherUser.profile_image
          ? '<img src="/uploads/users/' + escapeHtml(c.otherUser.profile_image) + '" class="rounded-circle img-fluid userprofile" alt=""><span class="user-status"></span>'
          : '<img src="/assets/images/users/user-dummy-img.jpg" class="rounded-circle img-fluid userprofile" alt=""><span class="user-status"></span>';

        userListEl.insertAdjacentHTML("beforeend",
          '<li data-name="direct-message" class="' + (isActive ? "active" : "") + '">' +
          '<a href="javascript:void(0);" data-chat-id="' + c.chatId + '" data-chat-type="direct">' +
          '<div class="d-flex align-items-center">' +
          '<div class="flex-shrink-0 chat-user-img align-self-center me-2 ms-0"><div class="avatar-xxs">' + profileImg + '</div></div>' +
          '<div class="flex-grow-1 overflow-hidden"><p class="text-truncate mb-0">' + escapeHtml(c.otherUser.name) + '</p>' +
          '<small class="text-muted text-truncate d-block">' + escapeHtml((c.lastMessage && c.lastMessage.content) || "") + '</small></div>' +
          badge +
          '</div></a></li>'
        );
      });
      attachListClickHandlers(userListEl);
    }

    // Group chats
    if (groupListEl) {
      groupListEl.innerHTML = "";
      groupItems.forEach(function (c) {
        var isActive = currentChatId ? Number(currentChatId) === Number(c.chatId) && currentChatType === "group" : false;
        var badge = c.unreadCount > 0
          ? '<div class="ms-auto"><span class="badge bg-dark-subtle text-body rounded p-1">' + c.unreadCount + '</span></div>'
          : "";

        groupListEl.insertAdjacentHTML("beforeend",
          '<li data-name="group-chat" class="' + (isActive ? "active" : "") + '">' +
          '<a href="javascript:void(0);" data-chat-id="' + c.chatId + '" data-chat-type="group">' +
          '<div class="d-flex align-items-center">' +
          '<div class="flex-shrink-0 chat-user-img align-self-center me-2 ms-0"><div class="avatar-xxs">' +
          '<div class="avatar-title rounded-circle bg-soft-primary text-primary fs-11"><i class="ri-group-line"></i></div></div></div>' +
          '<div class="flex-grow-1 overflow-hidden"><p class="text-truncate mb-0">' + escapeHtml(c.groupName || "Group") + '</p>' +
          '<small class="text-muted text-truncate d-block">' + escapeHtml((c.lastMessage && c.lastMessage.content) || "") + '</small></div>' +
          badge +
          '</div></a></li>'
        );
      });
      attachListClickHandlers(groupListEl);
    }

    // Auto open first direct chat
    if (!currentChatId && directItems.length > 0) {
      currentChatId = directItems[0].chatId;
      currentChatType = "direct";
      setHeader(directItems[0]);
      loadMessages(currentChatId);
    }
  }

  function attachListClickHandlers(listEl) {
    listEl.querySelectorAll("a[data-chat-id]").forEach(function (a) {
      a.addEventListener("click", function () {
        var chatId = Number(a.getAttribute("data-chat-id"));
        var chatType = a.getAttribute("data-chat-type");
        var chat = chatIndex.filter(function (x) { return Number(x.chatId) === chatId; })[0];
        currentChatId = chatId;
        currentChatType = chatType;
        document.querySelectorAll(".chat-user-list li").forEach(function (li) { li.classList.remove("active"); });
        if (a.closest("li")) a.closest("li").classList.add("active");
        setHeader(chat);
        loadMessages(chatId).then(function () { return loadChatList(); });
      });
    });
  }

  // ─── Messages ────────────────────────────────────────────────────────────────

  function renderMessages(messages) {
    if (!convoEl) return;
    convoEl.innerHTML = "";
    (messages || []).forEach(function (m) {
      var isRight = (m.senderId || null) === (selfUserId || null);
      var align = isRight ? "right" : "left";
      var time = fmtTime(m.createdAt);
      var text = escapeHtml(m.content || "");

      var avatarHtml = !isRight
        ? '<div class="chat-avatar"><img src="' + (m.senderProfileImage ? "/uploads/users/" + escapeHtml(m.senderProfileImage) : "/assets/images/users/user-dummy-img.jpg") + '" alt=""></div>'
        : "";

      var senderNameHtml = !isRight && currentChatType === "group" && m.senderName
        ? '<div class="mb-1"><small class="fw-semibold text-primary">' + escapeHtml(m.senderName) + '</small></div>'
        : "";

      var dropdownHtml = isRight
        ? '<div class="dropdown align-self-start message-box-drop">' +
        '<a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="ri-more-2-fill"></i></a>' +
        '<div class="dropdown-menu">' +
        '<a class="dropdown-item copy-message" href="#" data-msg="' + escapeHtml(m.content || "") + '"><i class="ri-file-copy-line me-2 text-muted align-bottom"></i>Copy</a>' +
        '<a class="dropdown-item delete-message" href="#" data-message-id="' + m.id + '"><i class="ri-delete-bin-5-line me-2 text-muted align-bottom"></i>Delete</a>' +
        '</div></div>'
        : "";

      convoEl.insertAdjacentHTML("beforeend",
        '<li class="chat-list ' + align + '" id="msg-' + m.id + '">' +
        '<div class="conversation-list">' + avatarHtml +
        '<div class="user-chat-content">' + senderNameHtml +
        '<div class="ctext-wrap"><div class="ctext-wrap-content"><p class="mb-0 ctext-content">' + text + '</p></div>' +
        dropdownHtml + '</div>' +
        '<div class="conversation-name"><small class="text-muted time">' + escapeHtml(time) + '</small></div>' +
        '</div></div></li>'
      );
    });

    convoEl.querySelectorAll(".copy-message").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var txt = el.getAttribute("data-msg") || "";
        if (navigator.clipboard) navigator.clipboard.writeText(txt);
      });
    });
    convoEl.querySelectorAll(".delete-message").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var id = Number(el.getAttribute("data-message-id"));
        if (!currentChatId || !id) return;
        fetchJson(apiBase + "/" + currentChatId + "/messages/" + id + "/delete", { method: "POST" })
          .then(function () {
            var row = document.getElementById("msg-" + id);
            if (row) { var ct = row.querySelector(".ctext-content"); if (ct) ct.textContent = "This message was deleted"; }
          })
          .catch(function (err) { console.error(err); });
      });
    });

    scrollToBottom();
  }

  function scrollToBottom() {
    try {
      var wrap = document.querySelector("#chat-conversation .simplebar-content-wrapper");
      if (wrap) { wrap.scrollTo({ top: wrap.scrollHeight, behavior: "smooth" }); return; }
    } catch (e) { }
    var container = document.getElementById("chat-conversation");
    if (container) container.scrollTop = container.scrollHeight;
  }

  // ─── Group member offcanvas ───────────────────────────────────────────────────

  function loadGroupMembers(chatId) {
    return fetchJson(apiBase + "/group/" + chatId + "/members").then(function (data) {
      var isCreator = data.creatorId === selfUserId;
      var panel = document.getElementById("groupInfoPanel");
      var directPanel = document.getElementById("directInfoPanel");
      var title = document.getElementById("groupInfoTitle");
      var nameEl = document.querySelector(".group-canvas-name");
      var countEl = document.getElementById("memberCountLabel");
      var membersList = document.getElementById("groupMembersList");
      var addSection = document.getElementById("addMemberSection");
      var addSelect = document.getElementById("addMemberSelect");

      if (panel) panel.classList.remove("d-none");
      if (directPanel) directPanel.classList.add("d-none");
      if (title) title.textContent = data.name || "Group Info";
      if (nameEl) nameEl.textContent = data.name || "Group";
      if (countEl) countEl.textContent = (data.members && data.members.length) || 0;

      if (membersList) {
        membersList.innerHTML = "";
        (data.members || []).forEach(function (m) {
          var isMe = m.id === selfUserId;
          var isMemberCreator = m.id === data.creatorId;
          var removeBtn = isCreator && !isMe
            ? '<button class="btn btn-sm btn-ghost-danger remove-member-btn ms-auto" data-user-id="' + m.id + '" title="Remove"><i class="ri-user-unfollow-line"></i></button>'
            : "";
          var creatorBadge = isMemberCreator ? '<span class="badge bg-warning-subtle text-warning ms-1 fs-10">Admin</span>' : "";
          var avatarHtml = m.profile_image
            ? '<img src="/uploads/users/' + escapeHtml(m.profile_image) + '" class="rounded-circle avatar-xs" alt="">'
            : '<div class="avatar-xs"><div class="avatar-title rounded-circle bg-soft-secondary text-secondary fs-12">' + escapeHtml((m.name || "?").charAt(0).toUpperCase()) + '</div></div>';

          membersList.insertAdjacentHTML("beforeend",
            '<li class="d-flex align-items-center mb-3">' +
            '<div class="flex-shrink-0 me-2">' + avatarHtml + '</div>' +
            '<div class="flex-grow-1 overflow-hidden"><p class="text-truncate mb-0 fw-medium">' +
            escapeHtml(m.name || "Unknown") + creatorBadge + (isMe ? ' <span class="text-muted fs-11">(You)</span>' : "") + '</p></div>' +
            removeBtn + '</li>'
          );
        });

        membersList.querySelectorAll(".remove-member-btn").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var uid = btn.getAttribute("data-user-id");
            if (!uid) return;
            fetchJson(apiBase + "/group/" + chatId + "/members/remove", { method: "POST", body: JSON.stringify({ userId: uid }) })
              .then(function () { return loadGroupMembers(chatId); })
              .catch(function (err) {
                if (typeof Swal !== "undefined") Swal.fire("Error", (err && err.message) || "Failed to remove member", "error");
              });
          });
        });
      }

      if (addSection) {
        if (isCreator) {
          addSection.classList.remove("d-none");
          var currentMemberIds = {};
          (data.members || []).forEach(function (m) { currentMemberIds[m.id] = true; });
          return fetchJson(apiBase + "/followers-following").then(function (net) {
            var eligible = (net.users || []).filter(function (u) { return !currentMemberIds[u.id]; });
            if (addSelect) {
              addSelect.innerHTML = '<option value="">Select a person...</option>';
              eligible.forEach(function (u) {
                var opt = document.createElement("option");
                opt.value = u.id;
                opt.textContent = u.name;
                addSelect.appendChild(opt);
              });
            }
          });
        } else {
          addSection.classList.add("d-none");
        }
      }
    }).catch(function (err) { console.error("loadGroupMembers error:", err); });
  }

  function loadDirectInfo(chat) {
    var panel = document.getElementById("groupInfoPanel");
    var directPanel = document.getElementById("directInfoPanel");
    var title = document.getElementById("groupInfoTitle");
    var img = document.getElementById("directInfoImg");
    if (panel) panel.classList.add("d-none");
    if (directPanel) directPanel.classList.remove("d-none");
    if (title) title.textContent = "Profile";
    var otherUser = chat && chat.otherUser;
    if (img) img.src = (otherUser && otherUser.profile_image) ? "/uploads/users/" + otherUser.profile_image : "/assets/images/users/user-dummy-img.jpg";
    document.querySelectorAll("#directInfoPanel .username").forEach(function (el) { el.textContent = (otherUser && otherUser.name) || "Unknown"; });
  }

  var infoBtn = document.getElementById("infoCanvasBtn");
  if (infoBtn) {
    infoBtn.addEventListener("click", function () {
      if (!currentChatId) return;
      var chat = chatIndex.filter(function (c) { return Number(c.chatId) === currentChatId; })[0];
      if (currentChatType === "group") loadGroupMembers(currentChatId);
      else loadDirectInfo(chat);
    });
  }

  var addMemberBtn = document.getElementById("addMemberBtn");
  if (addMemberBtn) {
    addMemberBtn.addEventListener("click", function () {
      var select = document.getElementById("addMemberSelect");
      var uid = select && select.value;
      if (!uid || !currentChatId) return;
      fetchJson(apiBase + "/group/" + currentChatId + "/members/add", { method: "POST", body: JSON.stringify({ userId: uid }) })
        .then(function () { return loadGroupMembers(currentChatId); })
        .catch(function (err) {
          if (typeof Swal !== "undefined") Swal.fire("Error", (err && err.message) || "Failed to add member", "error");
        });
    });
  }

  // ─── Data loading ─────────────────────────────────────────────────────────────

  function loadChatList() {
    if (!userListEl && !groupListEl) return Promise.resolve();
    return fetchJson(apiBase + "/list").then(function (data) {
      chatIndex = data.chats || [];
      renderChatList(chatIndex);
    });
  }

  function loadMessages(chatId) {
    if (!convoEl) return Promise.resolve();
    if (loaderEl) loaderEl.style.display = "block";
    return fetchJson(apiBase + "/" + chatId + "/messages").then(function (data) {
      if (loaderEl) loaderEl.style.display = "none";
      renderMessages(data.messages || []);
    });
  }

  function ensureDirectChat() {
    if (cfg.mode !== "direct") return Promise.resolve();
    if (currentChatId) return Promise.resolve();
    if (!cfg.otherUserId) return Promise.resolve();
    return fetchJson(apiBase + "/direct", { method: "POST", body: JSON.stringify({ otherUserId: cfg.otherUserId }) })
      .then(function (data) {
        currentChatId = data.chatId;
        currentChatType = "direct";
      });
  }

  // ─── Search ───────────────────────────────────────────────────────────────────

  if (chatSearchInput) {
    chatSearchInput.addEventListener("input", function () {
      var q = (chatSearchInput.value || "").toLowerCase();
      document.querySelectorAll(".chat-user-list li").forEach(function (li) {
        var name = (li.querySelector(".text-truncate") && li.querySelector(".text-truncate").textContent.toLowerCase()) || "";
        li.style.display = name.indexOf(q) !== -1 ? "" : "none";
      });
    });
  }

  // ─── Send message ─────────────────────────────────────────────────────────────

  if (chatForm) {
    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = (chatInput && chatInput.value || "").trim();
      if (!text) {
        if (chatInputFeedback) { chatInputFeedback.classList.add("show"); setTimeout(function () { chatInputFeedback.classList.remove("show"); }, 2000); }
        return;
      }
      if (!currentChatId) return;
      fetchJson(apiBase + "/" + currentChatId + "/messages", { method: "POST", body: JSON.stringify({ content: text }) })
        .then(function () {
          if (chatInput) chatInput.value = "";
          return loadMessages(currentChatId);
        })
        .then(function () { return loadChatList(); })
        .catch(function (err) {
          console.error(err);
          if (typeof Swal !== "undefined") Swal.fire("Cannot send message", (err && err.message) || "Failed to send message.", "warning");
        });
    });
  }

  // ─── Emoji picker ────────────────────────────────────────────────────────────

  try {
    if (window.FgEmojiPicker && document.querySelector(".chat-input")) {
      new FgEmojiPicker({
        trigger: [".emoji-btn"],
        removeOnSelection: false,
        closeButton: true,
        position: ["top", "right"],
        preFetch: true,
        dir: "/assets/libs/fg-emoji-picker",
        insertInto: document.querySelector(".chat-input"),
      });
    }
  } catch (e) { }

  // ─── Init ────────────────────────────────────────────────────────────────────

  ensureDirectChat()
    .then(function () {
      if (cfg.mode === "direct" && currentChatId) {
        setHeader({ type: "direct", otherUser: { name: cfg.otherUserName, profile_image: null } });
        return loadMessages(currentChatId);
      }
      return loadChatList();
    })
    .catch(function (e) { console.error(e); });

})();
