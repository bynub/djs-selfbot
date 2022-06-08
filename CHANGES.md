# Changes


## [0.0.0] - Make it work
**Path**: `/src/client/rest/RESTManager.js`

**Function**
Default
```js
  getAuth() {
    const token = this.client.token ?? this.client.accessToken;
    if (token) return `Bot ${token}`;
    throw new Error('TOKEN_MISSING');
  }
```
New
```js
  getAuth() {
    if (this.client.token && this.client.user && this.client.user.bot) {
      return `Bot ${this.client.token}`;
    } else if (this.client.token) {
      return this.client.token;
    }
    throw new Error("TOKEN_MISSING");
  }
```

## [0.0.1] - Disable Rich Embeds For User Accounts
**Path**: `/src/structures/MessagePayload.js`
**Function**
Default
```js
  resolveData() {
    if (this.data) return this;
    const isInteraction = this.isInteraction;
    const isWebhook = this.isWebhook;

    const content = this.makeContent();
    const tts = Boolean(this.options.tts);

    let nonce;
    if (typeof this.options.nonce !== 'undefined') {
      nonce = this.options.nonce;
      // eslint-disable-next-line max-len
      if (typeof nonce === 'number' ? !Number.isInteger(nonce) : typeof nonce !== 'string') {
        throw new RangeError('MESSAGE_NONCE_TYPE');
      }
    }

    const components = this.options.components?.map(c => BaseMessageComponent.create(c).toJSON());

    let username;
    let avatarURL;
    if (isWebhook) {
      username = this.options.username ?? this.target.name;
      if (this.options.avatarURL) avatarURL = this.options.avatarURL;
    }

    let flags;
    if (
      typeof this.options.flags !== 'undefined' ||
      (this.isMessage && typeof this.options.reply === 'undefined') ||
      this.isMessageManager
    ) {
      // eslint-disable-next-line eqeqeq
      flags = this.options.flags != null ? new MessageFlags(this.options.flags).bitfield : this.target.flags?.bitfield;
    }

    if (isInteraction && this.options.ephemeral) {
      flags |= MessageFlags.FLAGS.EPHEMERAL;
    }

    let allowedMentions =
      typeof this.options.allowedMentions === 'undefined'
        ? this.target.client.options.allowedMentions
        : this.options.allowedMentions;

    if (allowedMentions) {
      allowedMentions = Util.cloneObject(allowedMentions);
      allowedMentions.replied_user = allowedMentions.repliedUser;
      delete allowedMentions.repliedUser;
    }

    let message_reference;
    if (typeof this.options.reply === 'object') {
      const reference = this.options.reply.messageReference;
      const message_id = this.isMessage ? reference.id ?? reference : this.target.messages.resolveId(reference);
      if (message_id) {
        message_reference = {
          message_id,
          fail_if_not_exists: this.options.reply.failIfNotExists ?? this.target.client.options.failIfNotExists,
        };
      }
    }

    const attachments = this.options.files?.map((file, index) => ({
      id: index.toString(),
      description: file.description,
    }));
    if (Array.isArray(this.options.attachments)) {
      this.options.attachments.push(...(attachments ?? []));
    } else {
      this.options.attachments = attachments;
    }

    this.data = {
      content,
      tts,
      nonce,
      embeds: this.options.embeds?.map(embed => new MessageEmbed(embed).toJSON()),
      components,
      username,
      avatar_url: avatarURL,
      allowed_mentions:
        typeof content === 'undefined' && typeof message_reference === 'undefined' ? undefined : allowedMentions,
      flags,
      message_reference,
      attachments: this.options.attachments,
      sticker_ids: this.options.stickers?.map(sticker => sticker.id ?? sticker),
    };
    return this;
  }
```

New
```js
  resolveData() {
    if (this.data) return this;
    const isInteraction = this.isInteraction;
    const isWebhook = this.isWebhook;

    const content = this.makeContent();
    const tts = Boolean(this.options.tts);

    let nonce;
    if (typeof this.options.nonce !== "undefined") {
      nonce = this.options.nonce;
      // eslint-disable-next-line max-len
      if (
        typeof nonce === "number"
          ? !Number.isInteger(nonce)
          : typeof nonce !== "string"
      ) {
        throw new RangeError("MESSAGE_NONCE_TYPE");
      }
    }

    const components = this.options.components?.map((c) =>
      BaseMessageComponent.create(c).toJSON()
    );

    let username;
    let avatarURL;
    if (isWebhook) {
      username = this.options.username ?? this.target.name;
      if (this.options.avatarURL) avatarURL = this.options.avatarURL;
    }

    let flags;
    if (this.isMessage || this.isMessageManager) {
      // eslint-disable-next-line eqeqeq
      flags =
        this.options.flags != null
          ? new MessageFlags(this.options.flags).bitfield
          : this.target.flags?.bitfield;
    } else if (isInteraction && this.options.ephemeral) {
      flags = MessageFlags.FLAGS.EPHEMERAL;
    }

    let allowedMentions =
      typeof this.options.allowedMentions === "undefined"
        ? this.target.client.options.allowedMentions
        : this.options.allowedMentions;

    if (allowedMentions) {
      allowedMentions = Util.cloneObject(allowedMentions);
      allowedMentions.replied_user = allowedMentions.repliedUser;
      delete allowedMentions.repliedUser;
    }

    let message_reference;
    if (typeof this.options.reply === "object") {
      const reference = this.options.reply.messageReference;
      const message_id = this.isMessage
        ? reference.id ?? reference
        : this.target.messages.resolveId(reference);
      if (message_id) {
        message_reference = {
          message_id,
          fail_if_not_exists:
            this.options.reply.failIfNotExists ??
            this.target.client.options.failIfNotExists,
        };
      }
    }

    const attachments = this.options.files?.map((file, index) => ({
      id: index.toString(),
      description: file.description,
    }));
    if (Array.isArray(this.options.attachments)) {
      this.options.attachments.push(...(attachments ?? []));
    } else {
      this.options.attachments = attachments;
    }

    this.data = {
      content,
      tts,
      nonce,
      embeds: this.options.embeds?.map((embed) =>
        new MessageEmbed(embed).toJSON()
      ),
      components,
      username,
      avatar_url: avatarURL,
      allowed_mentions:
        typeof content === "undefined" &&
        typeof message_reference === "undefined"
          ? undefined
          : allowedMentions,
      flags,
      message_reference,
      attachments: this.options.attachments,
      sticker_ids: this.options.stickers?.map(
        (sticker) => sticker.id ?? sticker
      ),
    };

    if (this.data.embeds) {
      this.data.embeds = undefined;
      process.emitWarning(
        "MessageEmbed is deprecated for user accounts. Use normal messages instead.",
        "DeprecationError"
      );
      if (!this.data.content) {
        this.data.content =
          "MessageEmbed is deprecated for user accounts. Use normal messages instead.";
      }
    }

    return this;
  }
```